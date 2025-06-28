import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectQueue } from "@nestjs/bull"
import type { Queue } from "bull"
import { MessageDirection, MessageType } from "@prisma/client"

import type { PrismaService } from "../prisma/prisma.service"
import type { CreateMessageDto } from "./dto/create-message.dto"
import type { SendMessageDto } from "./dto/send-message.dto"
import type { ScheduleMessageDto } from "./dto/schedule-message.dto"

@Injectable()
export class MessagesService {
  private messageQueue: Queue

  constructor(private prisma: PrismaService) {
    this.messageQueue = InjectQueue("messages")
  }

  async create(createMessageDto: CreateMessageDto) {
    const { conversationId, whatsappConnectionId } = createMessageDto

    // Verificar se a conversa existe
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        contact: true,
        whatsappConnection: true,
      },
    })

    if (!conversation) {
      throw new NotFoundException("Conversa não encontrada")
    }

    // Verificar se a conexão WhatsApp pertence à mesma empresa
    if (conversation.whatsappConnection.id !== whatsappConnectionId) {
      throw new BadRequestException("Conexão WhatsApp não corresponde à conversa")
    }

    const message = await this.prisma.message.create({
      data: {
        ...createMessageDto,
        sentAt: createMessageDto.direction === MessageDirection.OUTBOUND ? new Date() : undefined,
      },
      include: {
        sentByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Atualizar última atividade da conversa
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastActivity: new Date(),
        lastMessage: createMessageDto.content.substring(0, 100),
      },
    })

    return message
  }

  async sendMessage(sendMessageDto: SendMessageDto, userId: string) {
    const { conversationId, content, messageType = MessageType.TEXT, mediaUrl } = sendMessageDto

    // Verificar se a conversa existe e está ativa
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        contact: true,
        whatsappConnection: true,
        company: true,
      },
    })

    if (!conversation) {
      throw new NotFoundException("Conversa não encontrada")
    }

    if (!conversation.isActive) {
      throw new BadRequestException("Não é possível enviar mensagens para conversas arquivadas")
    }

    // Verificar se o contato não está bloqueado
    if (conversation.contact.isBlocked) {
      throw new BadRequestException("Não é possível enviar mensagens para contatos bloqueados")
    }

    // Criar a mensagem no banco
    const message = await this.create({
      conversationId,
      whatsappConnectionId: conversation.whatsappConnectionId,
      content,
      messageType,
      direction: MessageDirection.OUTBOUND,
      mediaUrl,
      sentByUserId: userId,
    })

    // Adicionar job para envio via WhatsApp
    await this.messageQueue.add(
      "send-whatsapp-message",
      {
        messageId: message.id,
        connectionType: conversation.whatsappConnection.connectionType,
        instanceId: conversation.whatsappConnection.instanceId,
        accessToken: conversation.whatsappConnection.accessToken,
        phoneNumber: conversation.contact.phoneNumber,
        content,
        messageType,
        mediaUrl,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      },
    )

    return message
  }

  async scheduleMessage(scheduleMessageDto: ScheduleMessageDto, userId: string) {
    const { conversationId, content, scheduledFor, messageType = MessageType.TEXT, mediaUrl } = scheduleMessageDto

    // Verificar se a data é futura
    if (new Date(scheduledFor) <= new Date()) {
      throw new BadRequestException("Data de agendamento deve ser futura")
    }

    // Verificar se a conversa existe
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        contact: true,
        whatsappConnection: true,
      },
    })

    if (!conversation) {
      throw new NotFoundException("Conversa não encontrada")
    }

    // Criar a mensagem agendada
    const message = await this.create({
      conversationId,
      whatsappConnectionId: conversation.whatsappConnectionId,
      content,
      messageType,
      direction: MessageDirection.OUTBOUND,
      mediaUrl,
      sentByUserId: userId,
      isScheduled: true,
      scheduledFor: new Date(scheduledFor),
    })

    // Adicionar job agendado
    await this.messageQueue.add(
      "send-scheduled-message",
      {
        messageId: message.id,
      },
      {
        delay: new Date(scheduledFor).getTime() - Date.now(),
        attempts: 3,
      },
    )

    return message
  }

  async findByConversation(conversationId: string, filters?: any) {
    const where: any = { conversationId }

    if (filters?.messageType) {
      where.messageType = filters.messageType
    }

    if (filters?.direction) {
      where.direction = filters.direction
    }

    if (filters?.isRead !== undefined) {
      where.isRead = filters.isRead
    }

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where,
        include: {
          sentByUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: filters?.order === "asc" ? "asc" : "desc",
        },
        skip: filters?.skip || 0,
        take: filters?.take || 50,
      }),
      this.prisma.message.count({ where }),
    ])

    return {
      messages,
      total,
      hasMore: (filters?.skip || 0) + messages.length < total,
    }
  }

  async findOne(id: string) {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: {
        conversation: {
          include: {
            contact: {
              select: {
                id: true,
                name: true,
                phoneNumber: true,
              },
            },
          },
        },
        sentByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    if (!message) {
      throw new NotFoundException("Mensagem não encontrada")
    }

    return message
  }

  async markAsRead(id: string) {
    const message = await this.findOne(id)

    if (message.direction === MessageDirection.OUTBOUND) {
      throw new BadRequestException("Não é possível marcar mensagens enviadas como lidas")
    }

    return this.prisma.message.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })
  }

  async markAsDelivered(id: string) {
    const message = await this.findOne(id)

    return this.prisma.message.update({
      where: { id },
      data: {
        deliveredAt: new Date(),
      },
    })
  }

  async getScheduledMessages(companyId: string) {
    return this.prisma.message.findMany({
      where: {
        conversation: { companyId },
        isScheduled: true,
        sentAt: null,
        scheduledFor: {
          gte: new Date(),
        },
      },
      include: {
        conversation: {
          include: {
            contact: {
              select: {
                id: true,
                name: true,
                phoneNumber: true,
              },
            },
          },
        },
        sentByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        scheduledFor: "asc",
      },
    })
  }

  async cancelScheduledMessage(id: string) {
    const message = await this.findOne(id)

    if (!message.isScheduled || message.sentAt) {
      throw new BadRequestException("Mensagem não pode ser cancelada")
    }

    return this.prisma.message.delete({
      where: { id },
    })
  }

  async getMessageStats(companyId: string, filters?: any) {
    const where: any = {
      conversation: { companyId },
    }

    if (filters?.startDate && filters?.endDate) {
      where.createdAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      }
    }

    const [totalMessages, sentMessages, receivedMessages, readMessages, mediaMessages] = await Promise.all([
      this.prisma.message.count({ where }),
      this.prisma.message.count({
        where: { ...where, direction: MessageDirection.OUTBOUND },
      }),
      this.prisma.message.count({
        where: { ...where, direction: MessageDirection.INBOUND },
      }),
      this.prisma.message.count({
        where: { ...where, direction: MessageDirection.INBOUND, isRead: true },
      }),
      this.prisma.message.count({
        where: { ...where, messageType: { not: MessageType.TEXT } },
      }),
    ])

    return {
      total: totalMessages,
      sent: sentMessages,
      received: receivedMessages,
      read: readMessages,
      media: mediaMessages,
      readRate: receivedMessages > 0 ? (readMessages / receivedMessages) * 100 : 0,
    }
  }
}
