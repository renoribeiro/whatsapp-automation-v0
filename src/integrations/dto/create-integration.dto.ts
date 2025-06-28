import { IsString, IsOptional, IsBoolean, IsObject } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateIntegrationDto {
  @ApiProperty({ example: "Google Sheets - Contatos" })
  @IsString({ message: "Nome deve ser uma string" })
  name: string

  @ApiProperty({ example: "google_sheets", enum: ["google_sheets", "webhook", "openai", "crm_webhook"] })
  @IsString({ message: "Tipo deve ser uma string" })
  type: string

  @ApiProperty({
    example: {
      spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      sheetName: "Contatos",
    },
  })
  @IsObject({ message: "Configuração deve ser um objeto" })
  config: any

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: "isActive deve ser um boolean" })
  isActive?: boolean

  @ApiProperty({ example: "uuid-company-id" })
  @IsString({ message: "Company ID deve ser uma string" })
  companyId: string
}
