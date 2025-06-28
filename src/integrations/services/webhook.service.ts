import { Injectable, Logger } from "@nestjs/common"
import axios, { type AxiosInstance } from "axios"

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name)
  private readonly httpClient: AxiosInstance

  constructor() {
    this.httpClient = axios.create({
      timeout: 10000,
    })
  }

  async testWebhook(config: any) {
    try {
      const testData = {
        test: true,
        timestamp: new Date().toISOString(),
        message: "Teste de integração webhook",
      }

      const response = await this.httpClient.request({
        method: config.method || "POST",
        url: config.url,
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
        },
        data: testData,
      })

      return {
        success: true,
        status: response.status,
        statusText: response.statusText,
      }
    } catch (error) {
      this.logger.error(`Webhook test error: ${error.message}`)
      throw error
    }
  }

  async sendWebhook(config: any, data: any) {
    try {
      const payload = {
        ...data,
        timestamp: new Date().toISOString(),
        source: "whatsapp-platform",
      }

      const response = await this.httpClient.request({
        method: config.method || "POST",
        url: config.url,
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
        },
        data: payload,
      })

      this.logger.log(`Webhook sent successfully to ${config.url}`)

      return {
        success: true,
        status: response.status,
        response: response.data,
      }
    } catch (error) {
      this.logger.error(`Webhook send error: ${error.message}`)
      throw error
    }
  }
}
