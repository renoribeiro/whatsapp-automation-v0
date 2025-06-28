import { IsString, IsEmail, IsOptional, IsUUID, IsBoolean } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateCompanyDto {
  @ApiProperty({
    description: "Nome da empresa",
    example: "Empresa Exemplo Ltda",
  })
  @IsString()
  name: string

  @ApiProperty({
    description: "Email da empresa",
    example: "contato@empresa.com",
  })
  @IsEmail({}, { message: "Email deve ter um formato válido" })
  email: string

  @ApiProperty({
    description: "Telefone da empresa",
    example: "+5511999999999",
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({
    description: "CNPJ da empresa",
    example: "12.345.678/0001-90",
    required: false,
  })
  @IsOptional()
  @IsString()
  document?: string

  @ApiProperty({
    description: "Endereço da empresa",
    example: "Rua Exemplo, 123 - São Paulo/SP",
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string

  @ApiProperty({
    description: "Se a empresa está ativa",
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @ApiProperty({
    description: "ID da agência responsável",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  agencyId?: string
}
