import { Injectable, Logger } from "@nestjs/common"
import { google } from "googleapis"
import type { ConfigService } from "@nestjs/config"

@Injectable()
export class GoogleSheetsService {
  private readonly logger = new Logger(GoogleSheetsService.name)

  constructor(private configService: ConfigService) {}

  async testConnection(config: any) {
    try {
      const auth = await this.getAuth()
      const sheets = google.sheets({ version: "v4", auth })

      const response = await sheets.spreadsheets.get({
        spreadsheetId: config.spreadsheetId,
      })

      return {
        success: true,
        spreadsheetTitle: response.data.properties?.title,
      }
    } catch (error) {
      this.logger.error(`Google Sheets test connection error: ${error.message}`)
      throw error
    }
  }

  async addRow(config: any, data: any) {
    try {
      const auth = await this.getAuth()
      const sheets = google.sheets({ version: "v4", auth })

      const values = this.formatDataForSheet(data)

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: config.spreadsheetId,
        range: `${config.sheetName}!A:Z`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [values],
        },
      })

      return {
        success: true,
        updatedRows: response.data.updates?.updatedRows || 0,
      }
    } catch (error) {
      this.logger.error(`Google Sheets add row error: ${error.message}`)
      throw error
    }
  }

  async syncContacts(config: any, contacts: any[]) {
    try {
      const auth = await this.getAuth()
      const sheets = google.sheets({ version: "v4", auth })

      // Limpar planilha primeiro
      await sheets.spreadsheets.values.clear({
        spreadsheetId: config.spreadsheetId,
        range: `${config.sheetName}!A:Z`,
      })

      // Adicionar cabeçalhos
      const headers = ["Nome", "Telefone", "Email", "Fonte", "Tags", "Data de Criação"]

      // Preparar dados dos contatos
      const values = [
        headers,
        ...contacts.map((contact) => [
          contact.name || "",
          contact.phoneNumber || "",
          contact.email || "",
          contact.leadSource || "",
          contact.tags.map((t: any) => t.tag.name).join(", "),
          contact.createdAt.toISOString().split("T")[0],
        ]),
      ]

      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: config.spreadsheetId,
        range: `${config.sheetName}!A:Z`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values,
        },
      })

      return {
        success: true,
        syncedContacts: contacts.length,
        updatedRows: response.data.updatedRows || 0,
      }
    } catch (error) {
      this.logger.error(`Google Sheets sync contacts error: ${error.message}`)
      throw error
    }
  }

  private async getAuth() {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: this.configService.get("GOOGLE_CLIENT_EMAIL"),
        private_key: this.configService.get("GOOGLE_PRIVATE_KEY")?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    return auth
  }

  private formatDataForSheet(data: any): string[] {
    // Converter objeto em array de valores para planilha
    return [
      data.name || "",
      data.phoneNumber || "",
      data.email || "",
      data.leadSource || "",
      data.tags?.join(", ") || "",
      new Date().toISOString().split("T")[0],
    ]
  }
}
