import { IsString, IsEnum, IsOptional, IsDateString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { MessageType } from "@prisma/client"

export class ScheduleMessageDto {
  @ApiProperty({ example: "uuid-conversation-id" })
  @IsString({ message: "Conversation ID deve ser uma string" })
  conversationId: string

  @ApiProperty({ example: "Olá! Como posso ajudar?" })
  @IsString({ message: "Conteúdo deve ser uma string" })
  content: string

  @ApiProperty({ example: "2024-01-01T10:00:00Z" })
  @IsDateString({}, { message: "Data de agendamento deve ser uma data válida" })
  scheduledFor: string

  @ApiProperty({ enum: MessageType, example: MessageType.TEXT, required: false })
  @IsOptional()
  @IsEnum(MessageType, { message: "Tipo de mensagem deve ser um valor válido" })
  messageType?: MessageType

  @ApiProperty({ example: "https://example.com/media.jpg", required: false })
  @IsOptional()
  @IsString({ message: "URL da mídia deve ser uma string" })
  mediaUrl?: string
}
