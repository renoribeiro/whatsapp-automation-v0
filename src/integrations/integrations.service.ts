import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"
import type { CreateIntegrationDto } from "./dto/create-integration.dto"
import type { UpdateIntegrationDto } from "./dto/update-integration.dto"
import type { GoogleSheetsService } from "./services/google-sheets.service"
import type { WebhookService } from "./services/webhook.service"
import type { OpenAIService } from "./services/openai.service"

@Injectable()
export class IntegrationsService {
  constructor(
    private prisma: PrismaService,
    private googleSheetsService: GoogleSheetsService,
    private webhookService: WebhookService,
    private openAIService: OpenAIService,
  ) {}

  async create(createIntegrationDto: CreateIntegrationDto) {
    const { name, type, config } = createIntegrationDto

    // Validar configuração baseada no tipo
    await this.validateIntegrationConfig(type, config)

    return this.prisma.integration.create({
      data: createIntegrationDto,
    })
  }

  async findAll(companyId: string) {
    return this.prisma.integration.findMany({
      where: { companyId },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async findOne(id: string) {
    const integration = await this.prisma.integration.findUnique({
      where: { id },
    })

    if (!integration) {
      throw new NotFoundException("Integração não encontrada")
    }

    return integration
  }

  async update(id: string, updateIntegrationDto: UpdateIntegrationDto) {
    await this.findOne(id)

    if (updateIntegrationDto.config) {
      await this.validateIntegrationConfig(updateIntegrationDto.type, updateIntegrationDto.config)
    }

    return this.prisma.integration.update({
      where: { id },
      data: updateIntegrationDto,
    })
  }

  async remove(id: string) {
    await this.findOne(id)

    return this.prisma.integration.delete({
      where: { id },
    })
  }

  async testIntegration(id: string) {
    const integration = await this.findOne(id)

    try {
      switch (integration.type) {
        case "google_sheets":
          return this.googleSheetsService.testConnection(integration.config)
        case "webhook":
          return this.webhookService.testWebhook(integration.config)
        case "openai":
          return this.openAIService.testConnection(integration.config)
        default:
          throw new BadRequestException(`Tipo de integração não suportado: ${integration.type}`)
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }

  async executeIntegration(id: string, data: any) {
    const integration = await this.findOne(id)

    if (!integration.isActive) {
      throw new BadRequestException("Integração está inativa")
    }

    switch (integration.type) {
      case "google_sheets":
        return this.googleSheetsService.addRow(integration.config, data)
      case "webhook":
        return this.webhookService.sendWebhook(integration.config, data)
      case "openai":
        return this.openAIService.generateResponse(integration.config, data)
      default:
        throw new BadRequestException(`Tipo de integração não suportado: ${integration.type}`)
    }
  }

  async syncContacts(integrationId: string) {
    const integration = await this.findOne(integrationId)

    if (integration.type !== "google_sheets") {
      throw new BadRequestException("Sincronização disponível apenas para Google Sheets")
    }

    // Buscar contatos da empresa
    const contacts = await this.prisma.contact.findMany({
      where: { companyId: integration.companyId },
      include: {
        tags: {
          include: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    // Sincronizar com Google Sheets
    return this.googleSheetsService.syncContacts(integration.config, contacts)
  }

  private async validateIntegrationConfig(type: string, config: any) {
    switch (type) {
      case "google_sheets":
        if (!config.spreadsheetId || !config.sheetName) {
          throw new BadRequestException("Google Sheets requer spreadsheetId e sheetName")
        }
        break
      case "webhook":
        if (!config.url || !config.method) {
          throw new BadRequestException("Webhook requer url e method")
        }
        break
      case "openai":
        if (!config.apiKey || !config.model) {
          throw new BadRequestException("OpenAI requer apiKey e model")
        }
        break
      default:
        throw new BadRequestException(`Tipo de integração não suportado: ${type}`)
    }
  }
}
