import { IsString, IsOptional, IsNumber } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class ProcessPaymentDto {
  @ApiProperty({ example: "stripe" })
  @IsString({ message: "Método de pagamento deve ser uma string" })
  method: string

  @ApiProperty({ example: "in_1234567890", required: false })
  @IsOptional()
  @IsString({ message: "Stripe Invoice ID deve ser uma string" })
  stripeInvoiceId?: string

  @ApiProperty({ example: 250.0 })
  @IsNumber({}, { message: "Valor deve ser um número" })
  amount: number

  @ApiProperty({ example: "4242", required: false })
  @IsOptional()
  @IsString({ message: "Últimos 4 dígitos devem ser uma string" })
  last4?: string
}
