import { Processor, Process } from "@nestjs/bull"
import { Logger } from "@nestjs/common"
import type { Job } from "bull"
import type { PrismaService } from "../../prisma/prisma.service"
import type { EvolutionApiService } from "../services/evolution-api.service"
import type { OfficialApiService } from "../services/official-api.service"
import { ConnectionType } from "@prisma/client"

@Processor("whatsapp")
export class WhatsappProcessor {
  private readonly logger = new Logger(WhatsappProcessor.name)

  constructor(
    private prisma: PrismaService,
    private evolutionApiService: EvolutionApiService,
    private officialApiService: OfficialApiService,
  ) {}

  @Process("monitor-connection")
  async handleMonitorConnection(job: Job) {
    const { connectionId } = job.data

    try {
      const connection = await this.prisma.whatsAppConnection.findUnique({
        where: { id: connectionId },
      })

      if (!connection) {
        this.logger.error(`Connection not found: ${connectionId}`)
        return
      }

      let status
      if (connection.connectionType === ConnectionType.EVOLUTION_API) {
        status = await this.evolutionApiService.getInstanceStatus(connection.instanceId)
      } else {
        status = await this.officialApiService.getConnectionStatus(connection.accessToken)
      }

      await this.prisma.whatsAppConnection.update({
        where: { id: connectionId },
        data: { status },
      })

      this.logger.log(`Connection ${connectionId} status updated to ${status}`)
    } catch (error) {
      this.logger.error(`Error monitoring connection ${connectionId}: ${error.message}`)
    }
  }

  @Process("send-message")
  async handleSendMessage(job: Job) {
    const { connectionId, phoneNumber, message } = job.data

    try {
      const connection = await this.prisma.whatsAppConnection.findUnique({
        where: { id: connectionId },
      })

      if (!connection) {
        this.logger.error(`Connection not found: ${connectionId}`)
        return
      }

      let result
      if (connection.connectionType === ConnectionType.EVOLUTION_API) {
        result = await this.evolutionApiService.sendMessage(connection.instanceId, phoneNumber, message)
      } else {
        result = await this.officialApiService.sendMessage(connection.accessToken, phoneNumber, message)
      }

      this.logger.log(`Message sent successfully to ${phoneNumber}`)
      return result
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`)
      throw error
    }
  }
}
