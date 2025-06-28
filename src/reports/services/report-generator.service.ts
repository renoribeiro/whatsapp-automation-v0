import { Injectable } from "@nestjs/common"
import type { PrismaService } from "../../prisma/prisma.service"

@Injectable()
export class ReportGeneratorService {
  constructor(private prisma: PrismaService) {}

  async generateReport(type: string, companyId: string, filters: any = {}) {
    switch (type) {
      case "contacts":
        return this.generateContactsReport(companyId, filters)
      case "conversations":
        return this.generateConversationsReport(companyId, filters)
      case "messages":
        return this.generateMessagesReport(companyId, filters)
      case "performance":
        return this.generatePerformanceReport(companyId, filters)
      case "leads":
        return this.generateLeadsReport(companyId, filters)
      default:
        throw new Error(`Tipo de relatório não suportado: ${type}`)
    }
  }

  private async generateContactsReport(companyId: string, filters: any) {
    const where: any = { companyId }

    if (filters.startDate && filters.endDate) {
      where.createdAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      }
    }

    if (filters.leadSource) {
      where.leadSource = filters.leadSource
    }

    if (filters.tagIds && filters.tagIds.length > 0) {
      where.tags = {
        some: {
          tagId: {
            in: filters.tagIds,
          },
        },
      }
    }

    const [contacts, totalCount, byLeadSource, byTag] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        include: {
          tags: {
            include: {
              tag: {
                select: {
                  name: true,
                  color: true,
                },
              },
            },
          },
          _count: {
            select: {
              conversations: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: filters.limit || 1000,
      }),
      this.prisma.contact.count({ where }),
      this.prisma.contact.groupBy({
        by: ["leadSource"],
        where,
        _count: true,
      }),
      this.prisma.contactTag.groupBy({
        by: ["tagId"],
        where: {
          contact: where,
        },
        _count: true,
      }),
    ])

    return {
      summary: {
        totalContacts: totalCount,
        exportedContacts: contacts.length,
        byLeadSource,
        byTag,
      },
      data: contacts,
      generatedAt: new Date(),
    }
  }

  private async generateConversationsReport(companyId: string, filters: any) {
    const where: any = { companyId }

    if (filters.startDate && filters.endDate) {
      where.createdAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      }
    }

    if (filters.assignedUserId) {
      where.assignedUserId = filters.assignedUserId
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive
    }

    const [conversations, totalCount, byUser, byStatus] = await Promise.all([
      this.prisma.conversation.findMany({
        where,
        include: {
          contact: {
            select: {
              name: true,
              phoneNumber: true,
              leadSource: true,
            },
          },
          assignedUser: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          whatsappConnection: {
            select: {
              phoneNumber: true,
              displayName: true,
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
        take: filters.limit || 1000,
      }),
      this.prisma.conversation.count({ where }),
      this.prisma.conversation.groupBy({
        by: ["assignedUserId"],
        where,
        _count: true,
      }),
      this.prisma.conversation.groupBy({
        by: ["isActive"],
        where,
        _count: true,
      }),
    ])

    return {
      summary: {
        totalConversations: totalCount,
        exportedConversations: conversations.length,
        byUser,
        byStatus,
      },
      data: conversations,
      generatedAt: new Date(),
    }
  }

  private async generateMessagesReport(companyId: string, filters: any) {
    const where: any = {
      conversation: { companyId },
    }

    if (filters.startDate && filters.endDate) {
      where.createdAt = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      }
    }

    if (filters.direction) {
      where.direction = filters.direction
    }

    if (filters.messageType) {
      where.messageType = filters.messageType
    }

    const [messages, totalCount, byDirection, byType, byHour] = await Promise.all([
      this.prisma.message.findMany({
        where,
        include: {
          conversation: {
            select: {
              contact: {
                select: {
                  name: true,
                  phoneNumber: true,
                },
              },
            },
          },
          sentByUser: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: filters.limit || 1000,
      }),
      this.prisma.message.count({ where }),
      this.prisma.message.groupBy({
        by: ["direction"],
        where,
        _count: true,
      }),
      this.prisma.message.groupBy({
        by: ["messageType"],
        where,
        _count: true,
      }),
      // Mensagens por hora do dia
      this.prisma.$queryRaw`
        SELECT EXTRACT(HOUR FROM "createdAt") as hour, COUNT(*) as count
        FROM "messages" m
        JOIN "conversations" c ON m."conversationId" = c.id
        WHERE c."companyId" = ${companyId}
        ${filters.startDate ? `AND m."createdAt" >= ${new Date(filters.startDate)}` : ""}
        ${filters.endDate ? `AND m."createdAt" <= ${new Date(filters.endDate)}` : ""}
        GROUP BY EXTRACT(HOUR FROM "createdAt")
        ORDER BY hour
      `,
    ])

    return {
      summary: {
        totalMessages: totalCount,
        exportedMessages: messages.length,
        byDirection,
        byType,
        byHour,
      },
      data: messages,
      generatedAt: new Date(),
    }
  }

  private async generatePerformanceReport(companyId: string, filters: any) {
    const startDate = filters.startDate ? new Date(filters.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = filters.endDate ? new Date(filters.endDate) : new Date()

    const [userStats, connectionStats, responseTimeStats] = await Promise.all([
      // Estatísticas por usuário
      this.prisma.user.findMany({
        where: { companyId },
        include: {
          sentMessages: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          conversations: {
            where: {
              lastActivity: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        },
      }),

      // Estatísticas por conexão
      this.prisma.whatsAppConnection.findMany({
        where: { companyId },
        include: {
          messages: {
            where: {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          conversations: {
            where: {
              lastActivity: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        },
      }),

      // Estatísticas de tempo de resposta
      this.calculateResponseTimeStats(companyId, startDate, endDate),
    ])

    return {
      period: { startDate, endDate },
      userPerformance: userStats.map((user) => ({
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        messagesSent: user.sentMessages.length,
        conversationsHandled: user.conversations.length,
      })),
      connectionPerformance: connectionStats.map((conn) => ({
        connectionId: conn.id,
        phoneNumber: conn.phoneNumber,
        displayName: conn.displayName,
        messagesSent: conn.messages.length,
        activeConversations: conn.conversations.length,
      })),
      responseTimeStats,
      generatedAt: new Date(),
    }
  }

  private async generateLeadsReport(companyId: string, filters: any) {
    const startDate = filters.startDate ? new Date(filters.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = filters.endDate ? new Date(filters.endDate) : new Date()

    const where = {
      companyId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    }

    const [leadsBySource, leadsByUTM, conversionFunnel, leadsByDay] = await Promise.all([
      // Leads por fonte
      this.prisma.contact.groupBy({
        by: ["leadSource"],
        where,
        _count: true,
      }),

      // Leads por UTM
      this.prisma.contact.groupBy({
        by: ["utmSource", "utmMedium", "utmCampaign"],
        where: {
          ...where,
          utmSource: { not: null },
        },
        _count: true,
      }),

      // Funil de conversão
      this.calculateConversionFunnel(companyId, startDate, endDate),

      // Leads por dia
      this.prisma.$queryRaw`
        SELECT DATE("createdAt") as date, COUNT(*) as count
        FROM "contacts"
        WHERE "companyId" = ${companyId}
        AND "createdAt" >= ${startDate}
        AND "createdAt" <= ${endDate}
        GROUP BY DATE("createdAt")
        ORDER BY date
      `,
    ])

    return {
      period: { startDate, endDate },
      leadsBySource,
      leadsByUTM,
      conversionFunnel,
      leadsByDay,
      generatedAt: new Date(),
    }
  }

  private async calculateResponseTimeStats(companyId: string, startDate: Date, endDate: Date) {
    // Implementação simplificada para calcular estatísticas de tempo de resposta
    const conversations = await this.prisma.conversation.findMany({
      where: {
        companyId,
        lastActivity: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
    })

    const responseTimes: number[] = []

    for (const conversation of conversations) {
      const messages = conversation.messages
      for (let i = 0; i < messages.length - 1; i++) {
        const currentMessage = messages[i]
        const nextMessage = messages[i + 1]

        if (currentMessage.direction === "INBOUND" && nextMessage.direction === "OUTBOUND") {
          const responseTime = nextMessage.createdAt.getTime() - currentMessage.createdAt.getTime()
          responseTimes.push(responseTime)
        }
      }
    }

    if (responseTimes.length === 0) {
      return {
        averageResponseTime: 0,
        medianResponseTime: 0,
        totalResponses: 0,
      }
    }

    const sortedTimes = responseTimes.sort((a, b) => a - b)
    const average = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    const median = sortedTimes[Math.floor(sortedTimes.length / 2)]

    return {
      averageResponseTime: Math.round(average / (1000 * 60)), // em minutos
      medianResponseTime: Math.round(median / (1000 * 60)), // em minutos
      totalResponses: responseTimes.length,
    }
  }

  private async calculateConversionFunnel(companyId: string, startDate: Date, endDate: Date) {
    const where = {
      companyId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    }

    const [totalLeads, leadsWithConversations, leadsWithResponses, leadsWithTags] = await Promise.all([
      this.prisma.contact.count({ where }),
      this.prisma.contact.count({
        where: {
          ...where,
          conversations: {
            some: {},
          },
        },
      }),
      this.prisma.contact.count({
        where: {
          ...where,
          conversations: {
            some: {
              messages: {
                some: {
                  direction: "OUTBOUND",
                },
              },
            },
          },
        },
      }),
      this.prisma.contact.count({
        where: {
          ...where,
          tags: {
            some: {},
          },
        },
      }),
    ])

    return {
      totalLeads,
      leadsWithConversations,
      leadsWithResponses,
      leadsWithTags,
      conversionRates: {
        conversationRate: totalLeads > 0 ? (leadsWithConversations / totalLeads) * 100 : 0,
        responseRate: totalLeads > 0 ? (leadsWithResponses / totalLeads) * 100 : 0,
        taggedRate: totalLeads > 0 ? (leadsWithTags / totalLeads) * 100 : 0,
      },
    }
  }
}
