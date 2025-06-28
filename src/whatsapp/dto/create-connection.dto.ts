import { IsString, IsEnum, IsOptional, IsUUID } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { ConnectionType } from "@prisma/client"

export class CreateConnectionDto {
  @ApiProperty({
    description: "Número do WhatsApp",
    example: "+5511999999999",
  })
  @IsString()
  phoneNumber: string

  @ApiProperty({
    description: "Nome de exibição",
    example: "Empresa Exemplo",
    required: false,
  })
  @IsOptional()
  @IsString()
  displayName?: string

  @ApiProperty({
    description: "Tipo de conexão",
    enum: ConnectionType,
    example: ConnectionType.EVOLUTION_API,
  })
  @IsEnum(ConnectionType)
  connectionType: ConnectionType

  @ApiProperty({
    description: "ID da empresa",
    example: "uuid-da-empresa",
  })
  @IsUUID()
  companyId: string

  @ApiProperty({
    description: "Token de acesso (para API oficial)",
    required: false,
  })
  @IsOptional()
  @IsString()
  accessToken?: string

  @ApiProperty({
    description: "URL do webhook",
    required: false,
  })
  @IsOptional()
  @IsString()
  webhookUrl?: string
}
