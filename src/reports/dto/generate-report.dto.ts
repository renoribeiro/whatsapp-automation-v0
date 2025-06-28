import { IsString, IsOptional, IsObject, IsEnum } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class GenerateReportDto {
  @ApiProperty({ example: "performance", enum: ["contacts", "conversations", "messages", "performance", "leads"] })
  @IsString({ message: "Tipo deve ser uma string" })
  type: string

  @ApiProperty({ example: "uuid-company-id" })
  @IsString({ message: "Company ID deve ser uma string" })
  companyId: string

  @ApiProperty({
    example: {
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      leadSource: "META_ADS",
    },
    required: false,
  })
  @IsOptional()
  @IsObject({ message: "Filtros devem ser um objeto" })
  filters?: any

  @ApiProperty({ example: "json", enum: ["json", "csv", "excel", "pdf"], required: false })
  @IsOptional()
  @IsEnum(["json", "csv", "excel", "pdf"], { message: "Formato deve ser um valor válido" })
  format?: string
}
