import { IsString, IsOptional, IsBoolean, IsObject, IsArray } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateReportDto {
  @ApiProperty({ example: "Relatório de Performance Mensal" })
  @IsString({ message: "Nome deve ser uma string" })
  name: string

  @ApiProperty({ example: "performance", enum: ["contacts", "conversations", "messages", "performance", "leads"] })
  @IsString({ message: "Tipo deve ser uma string" })
  type: string

  @ApiProperty({
    example: {
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      leadSource: "META_ADS",
    },
  })
  @IsObject({ message: "Filtros devem ser um objeto" })
  filters: any

  @ApiProperty({
    example: {
      summary: {},
      data: [],
    },
  })
  @IsObject({ message: "Dados devem ser um objeto" })
  data: any

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean({ message: "isScheduled deve ser um boolean" })
  isScheduled?: boolean

  @ApiProperty({ example: "0 0 1 * *", required: false })
  @IsOptional()
  @IsString({ message: "Schedule deve ser uma string" })
  schedule?: string

  @ApiProperty({ example: ["admin@empresa.com"], required: false })
  @IsOptional()
  @IsArray({ message: "Email list deve ser um array" })
  emailList?: string[]

  @ApiProperty({ example: "uuid-company-id" })
  @IsString({ message: "Company ID deve ser uma string" })
  companyId: string
}
