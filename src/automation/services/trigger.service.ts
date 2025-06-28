import { Injectable, Logger } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"

import type { PrismaService } from "../../prisma/prisma.service"
import type { AutomationService } from "../automation.service"

@Injectable()
export class TriggerService {
  private readonly logger = new Logger(TriggerService.name)

  constructor(
    private prisma: PrismaService,
    private automationService: AutomationService,
  ) {}

  async handleMessageReceived(conversationId: string, message: any) {
    try {
      const conversation = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          contact: true,
          company: true,
        },
      })

      if (!conversation) return

      // Buscar fluxos ativos com trigger de mensagem recebida
      const flows = await this.automationService.getActiveFlowsByTrigger(conversation.companyId, "message_received")

      for (const flow of flows) {
        const flowData = flow.flowData as any
        const triggerData = flowData.trigger.data

        // Verificar se a mensagem atende aos critérios do trigger
        if (this.matchesMessageTrigger(message, triggerData)) {
          await this.automationService.executeFlow(flow.id, conversation.contactId, {
            message,
            conversation,
          })
        }
      }
    } catch (error) {
      this.logger.error(`Error handling message trigger: ${error.message}`)
    }
  }

  async handleKeywordTrigger(conversationId: string, message: any) {
    try {
      const conversation = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          contact: true,
          company: true,
        },
      })

      if (!conversation) return

      // Buscar fluxos ativos com trigger de palavra-chave
      const flows = await this.automationService.getActiveFlowsByTrigger(conversation.companyId, "keyword")

      for (const flow of flows) {
        const flowData = flow.flowData as any
        const keywords = flowData.trigger.data.keywords || []

        // Verificar se a mensagem contém alguma palavra-chave
        const messageText = message.content.toLowerCase()
        const hasKeyword = keywords.some((keyword: string) => messageText.includes(keyword.toLowerCase()))

        if (hasKeyword) {
          await this.automationService.executeFlow(flow.id, conversation.contactId, {
            message,
            conversation,
            matchedKeywords: keywords.filter((keyword: string) => messageText.includes(keyword.toLowerCase())),
          })
        }
      }
    } catch (error) {
      this.logger.error(`Error handling keyword trigger: ${error.message}`)
    }
  }

  async handleTagAdded(contactId: string, tagId: string) {
    try {
      const contact = await this.prisma.contact.findUnique({
        where: { id: contactId },
        include: {
          company: true,
        },
      })

      if (!contact) return

      // Buscar fluxos ativos com trigger de tag adicionada
      const flows = await this.automationService.getActiveFlowsByTrigger(contact.companyId, "tag_added")

      for (const flow of flows) {
        const flowData = flow.flowData as any
        const triggerTagIds = flowData.trigger.data.tagIds || []

        // Verificar se a tag adicionada está nos triggers
        if (triggerTagIds.includes(tagId)) {
          await this.automationService.executeFlow(flow.id, contactId, {
            addedTagId: tagId,
            contact,
          })
        }
      }
    } catch (error) {
      this.logger.error(`Error handling tag added trigger: ${error.message}`)
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleTimeBased() {
    try {
      // Buscar todos os fluxos com trigger baseado em tempo
      const flows = await this.prisma.automationFlow.findMany({
        where: {
          isActive: true,
          flowData: {
            path: ["trigger", "type"],
            equals: "time_based",
          },
        },
      })

      const now = new Date()

      for (const flow of flows) {
        const flowData = flow.flowData as any
        const triggerData = flowData.trigger.data

        // Verificar se é hora de executar
        if (this.shouldExecuteTimeBased(triggerData, now)) {
          // Buscar contatos que atendem aos critérios
          const contacts = await this.getContactsForTimeBased(flow.companyId, triggerData)

          for (const contact of contacts) {
            await this.automationService.executeFlow(flow.id, contact.id, {
              triggerTime: now,
              contact,
            })
          }
        }
      }
    } catch (error) {
      this.logger.error(`Error handling time-based triggers: ${error.message}`)
    }
  }

  private matchesMessageTrigger(message: any, triggerData: any): boolean {
    // Implementar lógica de matching para triggers de mensagem
    if (triggerData.messageType && message.messageType !== triggerData.messageType) {
      return false
    }

    if (triggerData.direction && message.direction !== triggerData.direction) {
      return false
    }

    return true
  }

  private shouldExecuteTimeBased(triggerData: any, now: Date): boolean {
    const { schedule, lastExecution } = triggerData

    if (!schedule) return false

    // Implementar lógica de verificação de schedule
    // Por enquanto, executa a cada hora
    if (!lastExecution) return true

    const lastExec = new Date(lastExecution)
    const hoursDiff = (now.getTime() - lastExec.getTime()) / (1000 * 60 * 60)

    return hoursDiff >= 1
  }

  private async getContactsForTimeBased(companyId: string, triggerData: any) {
    const where: any = { companyId }

    // Aplicar filtros baseados nos critérios do trigger
    if (triggerData.tagIds && triggerData.tagIds.length > 0) {
      where.tags = {
        some: {
          tagId: {
            in: triggerData.tagIds,
          },
        },
      }
    }

    if (triggerData.leadSource) {
      where.leadSource = triggerData.leadSource
    }

    return this.prisma.contact.findMany({
      where,
      take: 100, // Limitar para evitar sobrecarga
    })
  }
}
