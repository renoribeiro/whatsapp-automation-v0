import { Injectable, Logger } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import { ConnectionStatus } from "@prisma/client"
import axios from "axios"

@Injectable()
export class EvolutionApiService {
  private readonly logger = new Logger(EvolutionApiService.name)
  private readonly baseUrl: string
  private readonly apiKey: string

  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get("EVOLUTION_API_URL", "http://localhost:8080")
    this.apiKey = this.configService.get("EVOLUTION_API_KEY", "")
  }

  async createInstance(phoneNumber: string) {
    try {
      const instanceName = `instance_${phoneNumber.replace(/\D/g, "")}`

      const response = await axios.post(
        `${this.baseUrl}/instance/create`,
        {
          instanceName,
          token: this.apiKey,
          qrcode: true,
          integration: "WHATSAPP-BAILEYS",
        },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: this.apiKey,
          },
        },
      )

      this.logger.log(`Instance created: ${instanceName}`)

      return {
        instanceId: instanceName,
        qrCode: response.data.qrcode?.code || null,
      }
    } catch (error) {
      this.logger.error(`Error creating instance: ${error.message}`)
      throw new Error(`Erro ao criar instância: ${error.message}`)
    }
  }

  async getQrCode(instanceId: string): Promise<string> {
    try {
      const response = await axios.get(`${this.baseUrl}/instance/connect/${instanceId}`, {
        headers: {
          apikey: this.apiKey,
        },
      })

      return response.data.qrcode?.code || null
    } catch (error) {
      this.logger.error(`Error getting QR code: ${error.message}`)
      throw new Error(`Erro ao obter QR Code: ${error.message}`)
    }
  }

  async getInstanceStatus(instanceId: string): Promise<ConnectionStatus> {
    try {
      const response = await axios.get(`${this.baseUrl}/instance/connectionState/${instanceId}`, {
        headers: {
          apikey: this.apiKey,
        },
      })

      const state = response.data.instance?.state

      switch (state) {
        case "open":
          return ConnectionStatus.CONNECTED
        case "connecting":
          return ConnectionStatus.CONNECTING
        case "close":
          return ConnectionStatus.DISCONNECTED
        default:
          return ConnectionStatus.ERROR
      }
    } catch (error) {
      this.logger.error(`Error getting instance status: ${error.message}`)
      return ConnectionStatus.ERROR
    }
  }

  async deleteInstance(instanceId: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/instance/delete/${instanceId}`, {
        headers: {
          apikey: this.apiKey,
        },
      })

      this.logger.log(`Instance deleted: ${instanceId}`)
    } catch (error) {
      this.logger.error(`Error deleting instance: ${error.message}`)
      throw new Error(`Erro ao deletar instância: ${error.message}`)
    }
  }

  async sendMessage(instanceId: string, phoneNumber: string, message: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/message/sendText/${instanceId}`,
        {
          number: phoneNumber,
          text: message,
        },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: this.apiKey,
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
