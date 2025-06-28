import { Injectable, NotFoundException } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"
import type { CreateConversationDto } from "./dto/create-conversation.dto"
import type { UpdateConversationDto } from "./dto/update-conversation.dto"

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async create(createConversationDto: CreateConversationDto) {
    const { contactId, whatsappConnectionId, companyId } = createConversationDto

    // Verificar se o contato existe e pertence à empresa
    const contact = await this.prisma.contact.findFirst({
      where: {
        id: contactId,
        companyId,
      },
    })

    if (!contact) {
      throw new NotFoundException("Contato não encontrado ou não pertence a esta empresa")
    }

    // Verificar se a conexão WhatsApp existe e pertence à empresa
    const whatsappConnection = await this.prisma.whatsAppConnection.findFirst({
      where: {
        id: whatsappConnectionId,
        companyId,
      },
    })

    if (!whatsappConnection) {
      throw new NotFoundException("Conexão WhatsApp não encontrada ou não pertence a esta empresa")
    }

    // Verificar se já existe uma conversa ativa entre este contato e esta conexão
    const existingConversation = await this.prisma.conversation.findFirst({
      where: {
        contactId,
        whatsappConnectionId,
        isActive: true,
      },
    })

    if (existingConversation) {
      return existingConversation
    }

    return this.prisma.conversation.create({
      data: createConversationDto,
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            avatar: true,
          },
        },
        whatsappConnection: {
          select: {
            id: true,
            phoneNumber: true,
            displayName: true,
          },
        },
        assignedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })
  }

  async findAll(companyId: string, filters?: any) {
    const where: any = { companyId }

    if (filters?.assignedUserId) {
      where.assignedUserId = filters.assignedUserId
    }

    if (filters?.whatsappConnectionId) {
      where.whatsappConnectionId = filters.whatsappConnectionId
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive
    }

    if (filters?.search) {
      where.contact = {
        OR: [
          { name: { contains: filters.search, mode: "insensitive" } },
          { phoneNumber: { contains: filters.search } },
        ],
      }
    }

    const [conversations, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where,
        include: {
          contact: {
            select: {
              id: true,
              name: true,
              phoneNumber: true,
              avatar: true,
              tags: {
                include: {
                  tag: {
                    select: {
                      id: true,
                      name: true,
                      color: true,
                    },
                  },
                },
              },
            },
          },
          whatsappConnection: {
            select: {
              id: true,
              phoneNumber: true,
              displayName: true,
            },
          },
          assignedUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              messages: true,
            },
          },
        },
        orderBy: {
          lastActivity: "desc",
        },
        skip: filters?.skip || 0,
        take: filters?.take || 50,
      }),
      this.prisma.conversation.count({ where }),
    ])

    return {
      conversations,
      total,
      hasMore: (filters?.skip || 0) + conversations.length < total,
    }
  }

  async findOne(id: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        contact: {
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
        whatsappConnection: {
          select: {
            id: true,
            phoneNumber: true,
            displayName: true,
            status: true,
          },
        },
        assignedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        messages: {
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
            createdAt: "asc",
          },
          take: 50, // Últimas 50 mensagens
        },
      },
    })

    if (!conversation) {
      throw new NotFoundException("Conversa não encontrada")
    }

    return conversation
  }

  async update(id: string, updateConversationDto: UpdateConversationDto) {
    await this.findOne(id)

    return this.prisma.conversation.update({
      where: { id },
      data: updateConversationDto,
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            avatar: true,
          },
        },
        assignedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })
  }

  async assignUser(conversationId: string, userId: string) {
    const conversation = await this.findOne(conversationId)

    // Verificar se o usuário existe e pertence à mesma empresa
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        companyId: conversation.companyId,
        isActive: true,
      },
    })

    if (!user) {
      throw new NotFoundException("Usuário não encontrado ou não pertence a esta empresa")
    }

    return this.prisma.conversation.update({
      where: { id: conversationId },
      data: { assignedUserId: userId },
      include: {
        assignedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })
  }

  async markAsRead(conversationId: string) {
    const conversation = await this.findOne(conversationId)

    // Marcar todas as mensagens não lidas como lidas
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        direction: "INBOUND",
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    return { success: true }
  }

  async archive(id: string) {
    await this.findOne(id)

    return this.prisma.conversation.update({
      where: { id },
      data: { isActive: false },
    })
  }

  async unarchive(id: string) {
    await this.findOne(id)

    return this.prisma.conversation.update({
      where: { id },
      data: { isActive: true },
    })
  }

  async getConversationsByUser(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        assignedUserId: userId,
        isActive: true,
      },
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            avatar: true,
          },
        },
        whatsappConnection: {
          select: {
            id: true,
            phoneNumber: true,
            displayName: true,
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                direction: "INBOUND",
                isRead: false,
              },
            },
          },
        },
      },
      orderBy: {
        lastActivity: "desc",
      },
    })
  }

  async getConversationStats(companyId: string) {
    const [total, active, unassigned, unreadCount] = await Promise.all([
      this.prisma.conversation.count({
        where: { companyId },
      }),
      this.prisma.conversation.count({
        where: { companyId, isActive: true },
      }),
      this.prisma.conversation.count({
        where: { companyId, assignedUserId: null, isActive: true },
      }),
      this.prisma.message.count({
        where: {
          conversation: { companyId },
          direction: "INBOUND",
          isRead: false,
        },
      }),
    ])

    return {
      total,
      active,
      unassigned,
      unreadMessages: unreadCount,
    }
  }
}
