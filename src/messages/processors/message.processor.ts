import { Processor, Process } from "@nestjs/bull"
import { Logger } from "@nestjs/common"
import type { Job } from "bull"
import { ConnectionType } from "@prisma/client"

import type { PrismaService } from "../../prisma/prisma.service"
import type { EvolutionApiService } from "../../whatsapp/services/evolution-api.service"
import type { OfficialApiService } from "../../whatsapp/services/official-api.service"

@Processor("messages")
export class MessageProcessor {
  private readonly logger = new Logger(MessageProcessor.name)

  constructor(
    private prisma: PrismaService,
    private evolutionApiService: EvolutionApiService,
    private officialApiService: OfficialApiService,
  ) {}

  @Process("send-whatsapp-message")
  async handleSendWhatsAppMessage(job: Job) {
    const { messageId, connectionType, instanceId, accessToken, phoneNumber, content, messageType, mediaUrl } = job.data

    try {
      let result: any

      if (connectionType === ConnectionType.EVOLUTION_API) {
        if (messageType === "TEXT") {
          result = await this.evolutionApiService.sendMessage(instanceId, phoneNumber, content)
        } else {
          result = await this.evolutionApiService.sendMediaMessage(instanceId, phoneNumber, mediaUrl, content)
        }
      } else if (connectionType === ConnectionType.OFFICIAL_API) {
        if (messageType === "TEXT") {
          result = await this.officialApiService.sendMessage(accessToken, phoneNumber, content)
        } else {
          result = await this.officialApiService.sendMediaMessage(accessToken, phoneNumber, mediaUrl, content)
        }
      }

      // Atualizar mensagem com ID do WhatsApp
      await this.prisma.message.update({
        where: { id: messageId },
        data: {
          messageId: result?.messageId || result?.id,
          sentAt: new Date(),
        },
      })

      this.logger.log(`Message sent successfully: ${messageId}`)
    } catch (error) {
      this.logger.error(`Error sending message ${messageId}: ${error.message}`)

      // Marcar mensagem como falha
      await this.prisma.message.update({
        where: { id: messageId },
        data: {
          sentAt: new Date(),
          // Adicionar campo de erro se necessário
        },
      })

      throw error
    }
  }

  @Process("send-scheduled-message")
  async handleSendScheduledMessage(job: Job) {
    const { messageId } = job.data

    try {
      const message = await this.prisma.message.findUnique({
        where: { id: messageId },
        include: {
          conversation: {
            include: {
              contact: true,
              whatsappConnection: true,
            },
          },
        },
      })

      if (!message || message.sentAt) {
        this.logger.warn(`Scheduled message ${messageId} already sent or not found`)
        return
      }

      // Verificar se ainda está agendada para o futuro
      if (new Date(message.scheduledFor) > new Date()) {
        this.logger.warn(`Scheduled message ${messageId} is still in the future`)
        return
      }

      // Enviar mensagem
      const connection = message.conversation.whatsappConnection
      const contact = message.conversation.contact

      let result: any

      if (connection.connectionType === ConnectionType.EVOLUTION_API) {
        if (message.messageType === "TEXT") {
          result = await this.evolutionApiService.sendMessage(
            connection.instanceId,
            contact.phoneNumber,
            message.content,
          )
        } else {
          result = await this.evolutionApiService.sendMediaMessage(
            connection.instanceId,
            contact.phoneNumber,
            message.mediaUrl,
            message.content,
          )
        }
      } else if (connection.connectionType === ConnectionType.OFFICIAL_API) {
        if (message.messageType === "TEXT") {
          result = await this.officialApiService.sendMessage(
            connection.accessToken,
            contact.phoneNumber,
            message.content,
          )
        } else {
          result = await this.officialApiService.sendMediaMessage(
            connection.accessToken,
            contact.phoneNumber,
            message.mediaUrl,
            message.content,
          )
        }
      }

      // Atualizar mensagem
      await this.prisma.message.update({
        where: { id: messageId },
        data: {
          messageId: result?.messageId || result?.id,
          sentAt: new Date(),
          isScheduled: false,
        },
      })

      // Atualizar conversa
      await this.prisma.conversation.update({
        where: { id: message.conversationId },
        data: {
          lastActivity: new Date(),
          lastMessage: message.content.substring(0, 100),
        },
      })

      this.logger.log(`Scheduled message sent successfully: ${messageId}`)
    } catch (error) {
      this.logger.error(`Error sending scheduled message ${messageId}: ${error.message}`)
      throw error
    }
  }
}
