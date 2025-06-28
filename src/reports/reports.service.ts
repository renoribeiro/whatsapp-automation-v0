import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectQueue } from "@nestjs/bull"
import type { Queue } from "bull"

import type { PrismaService } from "../prisma/prisma.service"
import type { CreateReportDto } from "./dto/create-report.dto"
import type { UpdateReportDto } from "./dto/update-report.dto"
import type { GenerateReportDto } from "./dto/generate-report.dto"
import type { ReportGeneratorService } from "./services/report-generator.service"

@Injectable()
export class ReportsService {
  private reportsQueue: Queue

  constructor(
    private prisma: PrismaService,
    private reportGeneratorService: ReportGeneratorService,
  ) {
    this.reportsQueue = InjectQueue("reports")
  }

  async create(createReportDto: CreateReportDto) {
    return this.prisma.report.create({
      data: createReportDto,
    })
  }

  async findAll(companyId: string) {
    return this.prisma.report.findMany({
      where: { companyId },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async findOne(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
    })

    if (!report) {
      throw new NotFoundException("Relatório não encontrado")
    }

    return report
  }

  async update(id: string, updateReportDto: UpdateReportDto) {
    await this.findOne(id)

    return this.prisma.report.update({
      where: { id },
      data: updateReportDto,
    })
  }

  async remove(id: string) {
    await this.findOne(id)

    return this.prisma.report.delete({
      where: { id },
    })
  }

  async generateReport(generateReportDto: GenerateReportDto) {
    const { type, companyId, filters, format = "json" } = generateReportDto

    // Gerar relatório imediatamente para formatos simples
    if (format === "json") {
      return this.reportGeneratorService.generateReport(type, companyId, filters)
    }

    // Para formatos complexos, usar fila
    const job = await this.reportsQueue.add(
      "generate-report",
      {
        type,
        companyId,
        filters,
        format,
      },
      {
        attempts: 3,
      },
    )

    return {
      jobId: job.id,
      status: "processing",
      message: "Relatório sendo gerado. Você será notificado quando estiver pronto.",
    }
  }

  async getDashboardStats(companyId: string) {
    const [
      totalContacts,
      totalConversations,
      totalMessages,
      activeConnections,
      messagesThisMonth,
      conversationsThisMonth,
      contactsThisMonth,
    ] = await Promise.all([
      this.prisma.contact.count({ where: { companyId } }),
      this.prisma.conversation.count({ where: { companyId } }),
      this.prisma.message.count({
        where: { conversation: { companyId } },
      }),
      this.prisma.whatsAppConnection.count({
        where: { companyId, status: "CONNECTED" },
      }),
      this.prisma.message.count({
        where: {
          conversation: { companyId },
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      this.prisma.conversation.count({
        where: {
          companyId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      this.prisma.contact.count({
        where: {
          companyId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ])

    return {
      overview: {
        totalContacts,
        totalConversations,
        totalMessages,
        activeConnections,
      },
      thisMonth: {
        messages: messagesThisMonth,
        conversations: conversationsThisMonth,
        contacts: contactsThisMonth,
      },
    }
  }

  async getPerformanceReport(companyId: string, filters: any = {}) {
    const startDate = filters.startDate ? new Date(filters.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = filters.endDate ? new Date(filters.endDate) : new Date()

    const where = {
      conversation: { companyId },
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    }

    const [messageStats, responseTime, userPerformance] = await Promise.all([
      // Estatísticas de mensagens
      this.prisma.message.groupBy({
        by: ["direction"],
        where,
        _count: true,
      }),

      // Tempo médio de resposta (simulado)
      this.getAverageResponseTime(companyId, startDate, endDate),

      // Performance por usuário
      this.getUserPerformance(companyId, startDate, endDate),
    ])

    return {
      period: {
        startDate,
        endDate,
      },
      messageStats,
      responseTime,
      userPerformance,
    }
  }

  async getLeadsReport(companyId: string, filters: any = {}) {
    const startDate = filters.startDate ? new Date(filters.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = filters.endDate ? new Date(filters.endDate) : new Date()

    const where = {
      companyId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    }

    const [leadsBySource, leadsByTag, conversionFunnel] = await Promise.all([
      // Leads por fonte
      this.prisma.contact.groupBy({
        by: ["leadSource"],
        where,
        _count: true,
      }),

      // Leads por tag
      this.prisma.contactTag.groupBy({
        by: ["tagId"],
        where: {
          contact: where,
        },
        _count: true,
        _avg: {
          createdAt: true,
        },
      }),

      // Funil de conversão (simulado)
      this.getConversionFunnel(companyId, startDate, endDate),
    ])

    return {
      period: {
        startDate,
        endDate,
      },
      leadsBySource,
      leadsByTag,
      conversionFunnel,
    }
  }

  private async getAverageResponseTime(companyId: string, startDate: Date, endDate: Date) {
    // Implementação simplificada - calcular tempo médio entre mensagem recebida e resposta
    const conversations = await this.prisma.conversation.findMany({
      where: {
        companyId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 10,
        },
      },
    })

    let totalResponseTime = 0
    let responseCount = 0

    for (const conversation of conversations) {
      const messages = conversation.messages
      for (let i = 0; i < messages.length - 1; i++) {
        const currentMessage = messages[i]
        const nextMessage = messages[i + 1]

        if (currentMessage.direction === "INBOUND" && nextMessage.direction === "OUTBOUND") {
          const responseTime = nextMessage.createdAt.getTime() - currentMessage.createdAt.getTime()
          totalResponseTime += responseTime
          responseCount++
        }
      }
    }

    return {
      averageResponseTimeMs: responseCount > 0 ? totalResponseTime / responseCount : 0,
      averageResponseTimeMinutes: responseCount > 0 ? totalResponseTime / responseCount / (1000 * 60) : 0,
      totalResponses: responseCount,
    }
  }

  private async getUserPerformance(companyId: string, startDate: Date, endDate: Date) {
    const users = await this.prisma.user.findMany({
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
    })

    return users.map((user) => ({
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      messagesSent: user.sentMessages.length,
      conversationsHandled: user.conversations.length,
    }))
  }

  private async getConversionFunnel(companyId: string, startDate: Date, endDate: Date) {
    const totalContacts = await this.prisma.contact.count({
      where: {
        companyId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    const contactsWithConversations = await this.prisma.contact.count({
      where: {
        companyId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        conversations: {
          some: {},
        },
      },
    })

    const contactsWithMessages = await this.prisma.contact.count({
      where: {
        companyId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
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
    })

    return {
      totalContacts,
      contactsWithConversations,
      contactsWithMessages,
      conversionRate: totalContacts > 0 ? (contactsWithMessages / totalContacts) * 100 : 0,
    }
  }
}
