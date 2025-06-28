import { IsString, IsOptional, IsBoolean } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateConversationDto {
  @ApiProperty({ example: "uuid-contact-id" })
  @IsString({ message: "Contact ID deve ser uma string" })
  contactId: string

  @ApiProperty({ example: "uuid-company-id" })
  @IsString({ message: "Company ID deve ser uma string" })
  companyId: string

  @ApiProperty({ example: "uuid-whatsapp-connection-id" })
  @IsString({ message: "WhatsApp Connection ID deve ser uma string" })
  whatsappConnectionId: string

  @ApiProperty({ example: "uuid-user-id", required: false })
  @IsOptional()
  @IsString({ message: "Assigned User ID deve ser uma string" })
  assignedUserId?: string

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: "isActive deve ser um boolean" })
  isActive?: boolean
}
