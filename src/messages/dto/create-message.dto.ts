import { IsString, IsEnum, IsOptional, IsBoolean, IsDateString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { MessageType, MessageDirection } from "@prisma/client"

export class CreateMessageDto {
  @ApiProperty({ example: "uuid-conversation-id" })
  @IsString({ message: "Conversation ID deve ser uma string" })
  conversationId: string

  @ApiProperty({ example: "uuid-whatsapp-connection-id" })
  @IsString({ message: "WhatsApp Connection ID deve ser uma string" })
  whatsappConnectionId: string

  @ApiProperty({ example: "Olá! Como posso ajudar?" })
  @IsString({ message: "Conteúdo deve ser uma string" })
  content: string

  @ApiProperty({ enum: MessageType, example: MessageType.TEXT })
  @IsEnum(MessageType, { message: "Tipo de mensagem deve ser um valor válido" })
  messageType: MessageType

  @ApiProperty({ enum: MessageDirection, example: MessageDirection.OUTBOUND })
  @IsEnum(MessageDirection, { message: "Direção da mensagem deve ser um valor válido" })
  direction: MessageDirection

  @ApiProperty({ example: "https://example.com/media.jpg", required: false })
  @IsOptional()
  @IsString({ message: "URL da mídia deve ser uma string" })
  mediaUrl?: string

  @ApiProperty({ example: "image.jpg", required: false })
  @IsOptional()
  @IsString({ message: "Nome do arquivo deve ser uma string" })
  fileName?: string

  @ApiProperty({ example: 1024, required: false })
  @IsOptional()
  fileSize?: number

  @ApiProperty({ example: "uuid-user-id", required: false })
  @IsOptional()
  @IsString({ message: "User ID deve ser uma string" })
  sentByUserId?: string

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean({ message: "isScheduled deve ser um boolean" })
  isScheduled?: boolean

  @ApiProperty({ example: "2024-01-01T10:00:00Z", required: false })
  @IsOptional()
  @IsDateString({}, { message: "Data de agendamento deve ser uma data válida" })
  scheduledFor?: string
}
