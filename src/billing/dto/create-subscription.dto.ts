import { IsString, IsOptional, IsNumber, IsEnum } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateSubscriptionDto {
  @ApiProperty({ example: "uuid-company-id" })
  @IsString({ message: "Company ID deve ser uma string" })
  companyId: string

  @ApiProperty({ example: "Standard", required: false })
  @IsOptional()
  @IsString({ message: "Nome do plano deve ser uma string" })
  planName?: string

  @ApiProperty({ example: "monthly", enum: ["monthly", "yearly"], required: false })
  @IsOptional()
  @IsEnum(["monthly", "yearly"], { message: "Ciclo de cobrança deve ser monthly ou yearly" })
  billingCycle?: string

  @ApiProperty({ example: 150.0, required: false })
  @IsOptional()
  @IsNumber({}, { message: "Preço base deve ser um número" })
  basePrice?: number

  @ApiProperty({ example: 100.0, required: false })
  @IsOptional()
  @IsNumber({}, { message: "Preço por usuário deve ser um número" })
  pricePerUser?: number
}
