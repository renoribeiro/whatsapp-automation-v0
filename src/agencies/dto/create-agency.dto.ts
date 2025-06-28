import { IsString, IsEmail, IsOptional, IsBoolean, IsNumber, Min, Max } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateAgencyDto {
  @ApiProperty({
    description: "Nome da agência",
    example: "Agência Digital Exemplo",
  })
  @IsString()
  name: string

  @ApiProperty({
    description: "Email da agência",
    example: "contato@agencia.com",
  })
  @IsEmail({}, { message: "Email deve ter um formato válido" })
  email: string

  @ApiProperty({
    description: "Telefone da agência",
    example: "+5511999999999",
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({
    description: "CNPJ da agência",
    example: "12.345.678/0001-90",
    required: false,
  })
  @IsOptional()
  @IsString()
  document?: string

  @ApiProperty({
    description: "Endereço da agência",
    example: "Rua Exemplo, 123 - São Paulo/SP",
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string

  @ApiProperty({
    description: "Se a agência está ativa",
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @ApiProperty({
    description: "Percentual de comissão (0.0 a 1.0)",
    example: 0.25,
    minimum: 0,
    maximum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  commission?: number
}
