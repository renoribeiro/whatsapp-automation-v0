import { Injectable, Logger } from "@nestjs/common"
import { type MessageType, MessageDirection } from "@prisma/client"

import type { PrismaService } from "../../prisma/prisma.service"
import type { MessagesService } from "../../messages/messages.service"

interface FlowAction {
  id: string
  type: "send_message" | "add_tag" | "remove_tag" | "wait" | "condition" | "webhook"
  data: any
  nextAction?: string
  conditions?: {
    field: string
    operator: "equals" | "contains" | "not_equals" | "greater_than" | "less_than"
    value: any
    nextAction: string
  }[]
}

interface FlowData {
  trigger: {
    type: "message_received" | "keyword" | "tag_added" | "time_based"
    data: any
  }
  actions: FlowAction[]
}

@Injectable()
export class FlowExecutorService {
  private readonly logger = new Logger(FlowExecutorService.name)

  constructor(
    private prisma: PrismaService,
    private messagesService: MessagesService,
  ) {}

  async executeFlow(flowId: string, contactId: string, triggerData?: any) {
    try {
      const flow = await this.prisma.automationFlow.findUnique({
        where: { id: flowId },
      })

      if (!flow || !flow.isActive) {
        throw new Error("Fluxo não encontrado ou inativo")
      }

      const contact = await this.prisma.contact.findUnique({
        where: { id: contactId },
        include: {
          conversations: {
            where: { isActive: true },
            include: {
              whatsappConnection: true,
            },
            take: 1,
          },
        },
      })

      if (!contact) {
        throw new Error("Contato não encontrado")
      }

      const flowData = flow.flowData as FlowData
      const conversation = contact.conversations[0]

      if (!conversation) {
        throw new Error("Nenhuma conversa ativa encontrada para o contato")
      }

      // Executar ações do fluxo
      await this.executeActions(flowData.actions, contact, conversation, triggerData)

      this.logger.log(`Flow ${flowId} executed successfully for contact ${contactId}`)
    } catch (error) {
      this.logger.error(`Error executing flow ${flowId}: ${error.message}`)
      throw error
    }
  }

  private async executeActions(actions: FlowAction[], contact: any, conversation: any, context: any = {}) {
    let currentActionId = actions[0]?.id

    while (currentActionId) {
      const action = actions.find((a) => a.id === currentActionId)
      if (!action) break

      try {
        const nextActionId = await this.executeAction(action, contact, conversation, context)
        currentActionId = nextActionId || action.nextAction
      } catch (error) {
        this.logger.error(`Error executing action ${action.id}: ${error.message}`)
        break
      }
    }
  }

  private async executeAction(
    action: FlowAction,
    contact: any,
    conversation: any,
    context: any,
  ): Promise<string | null> {
    switch (action.type) {
      case "send_message":
        return this.executeSendMessage(action, contact, conversation, context)

      case "add_tag":
        return this.executeAddTag(action, contact, context)

      case "remove_tag":
        return this.executeRemoveTag(action, contact, context)

      case "wait":
        return this.executeWait(action, context)

      case "condition":
        return this.executeCondition(action, contact, context)

      case "webhook":
        return this.executeWebhook(action, contact, context)

      default:
        this.logger.warn(`Unknown action type: ${action.type}`)
        return null
    }
  }

  private async executeSendMessage(
    action: FlowAction,
    contact: any,
    conversation: any,
    context: any,
  ): Promise<string | null> {
    const { message, messageType = "TEXT", delay = 0 } = action.data

    // Substituir variáveis na mensagem
    const processedMessage = this.processMessageVariables(message, contact, context)

    if (delay > 0) {
      await this.sleep(delay * 1000)
    }

    // Enviar mensagem
    await this.messagesService.create({
      conversationId: conversation.id,
      whatsappConnectionId: conversation.whatsappConnectionId,
      content: processedMessage,
      messageType: messageType as MessageType,
      direction: MessageDirection.OUTBOUND,
    })

    return null
  }

  private async executeAddTag(action: FlowAction, contact: any, context: any): Promise<string | null> {
    const { tagId } = action.data

    // Verificar se a tag existe
    const tag = await this.prisma.tag.findFirst({
      where: {
        id: tagId,
        companyId: contact.companyId,
      },
    })

    if (tag) {
      // Adicionar tag se não existir
      await this.prisma.contactTag.upsert({
        where: {
          contactId_tagId: {
            contactId: contact.id,
            tagId,
          },
        },
        update: {},
        create: {
          contactId: contact.id,
          tagId,
        },
      })
    }

    return null
  }

  private async executeRemoveTag(action: FlowAction, contact: any, context: any): Promise<string | null> {
    const { tagId } = action.data

    await this.prisma.contactTag.deleteMany({
      where: {
        contactId: contact.id,
        tagId,
      },
    })

    return null
  }

  private async executeWait(action: FlowAction, context: any): Promise<string | null> {
    const { duration } = action.data // em segundos

    await this.sleep(duration * 1000)

    return null
  }

  private async executeCondition(action: FlowAction, contact: any, context: any): Promise<string | null> {
    const { conditions } = action

    if (!conditions || conditions.length === 0) {
      return null
    }

    for (const condition of conditions) {
      if (this.evaluateCondition(condition, contact, context)) {
        return condition.nextAction
      }
    }

    return null
  }

  private async executeWebhook(action: FlowAction, contact: any, context: any): Promise<string | null> {
    const { url, method = "POST", headers = {}, data = {} } = action.data

    try {
      const payload = {
        contact,
        context,
        timestamp: new Date().toISOString(),
        ...data,
      }

      // Implementar chamada HTTP para webhook
      // Por enquanto apenas log
      this.logger.log(`Webhook called: ${method} ${url}`, payload)
    } catch (error) {
      this.logger.error(`Webhook error: ${error.message}`)
    }

    return null
  }

  private evaluateCondition(condition: any, contact: any, context: any): boolean {
    const { field, operator, value } = condition

    let fieldValue: any

    // Obter valor do campo
    if (field.startsWith("contact.")) {
      const contactField = field.replace("contact.", "")
      fieldValue = contact[contactField]
    } else if (field.startsWith("context.")) {
      const contextField = field.replace("context.", "")
      fieldValue = context[contextField]
    } else {
      fieldValue = context[field]
    }

    // Avaliar condição
    switch (operator) {
      case "equals":
        return fieldValue === value
      case "not_equals":
        return fieldValue !== value
      case "contains":
        return String(fieldValue).toLowerCase().includes(String(value).toLowerCase())
      case "greater_than":
        return Number(fieldValue) > Number(value)
      case "less_than":
        return Number(fieldValue) < Number(value)
      default:
        return false
    }
  }

  private processMessageVariables(message: string, contact: any, context: any): string {
    let processedMessage = message

    // Substituir variáveis do contato
    processedMessage = processedMessage.replace(/\{\{contact\.name\}\}/g, contact.name || "")
    processedMessage = processedMessage.replace(/\{\{contact\.phone\}\}/g, contact.phoneNumber || "")

    // Substituir variáveis do contexto
    Object.keys(context).forEach((key) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g")
      processedMessage = processedMessage.replace(regex, String(context[key] || ""))
    })

    return processedMessage
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
