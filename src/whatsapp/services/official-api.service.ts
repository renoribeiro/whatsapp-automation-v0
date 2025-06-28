import { Injectable, Logger } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import { ConnectionStatus } from "@prisma/client"
import axios from "axios"

@Injectable()
export class OfficialApiService {
  private readonly logger = new Logger(OfficialApiService.name)
  private readonly baseUrl = "https://graph.facebook.com/v18.0"

  constructor(private configService: ConfigService) {}

  async setupConnection(phoneNumber: string) {
    // Para API oficial, normalmente você já tem o token configurado
    const accessToken = this.configService.get("META_ACCESS_TOKEN")
    const webhookUrl = this.configService.get("WEBHOOK_URL")

    if (!accessToken) {
      throw new Error("Meta Access Token não configurado")
    }

    return {
      accessToken,
      webhookUrl,
    }
  }

  async getConnectionStatus(accessToken: string): Promise<ConnectionStatus> {
    try {
      const phoneNumberId = this.configService.get("META_PHONE_NUMBER_ID")

      const response = await axios.get(`${this.baseUrl}/${phoneNumberId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.status === 200) {
        return ConnectionStatus.CONNECTED
      }

      return ConnectionStatus.ERROR
    } catch (error) {
      this.logger.error(`Error checking connection status: ${error.message}`)
      return ConnectionStatus.ERROR
    }
  }

  async sendMessage(accessToken: string, phoneNumber: string, message: string) {
    try {
      const phoneNumberId = this.configService.get("META_PHONE_NUMBER_ID")

      const response = await axios.post(
        `${this.baseUrl}/${phoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          to: phoneNumber,
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      return response.data
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`)
      throw new Error(`Erro ao enviar mensagem: ${error.message}`)
    }
  }
}
