import { IsString, IsOptional, IsBoolean, IsObject } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateAutomationFlowDto {
  @ApiProperty({ example: "Boas-vindas para novos contatos" })
  @IsString({ message: "Nome deve ser uma string" })
  name: string

  @ApiProperty({ example: "Fluxo automático de boas-vindas", required: false })
  @IsOptional()
  @IsString({ message: "Descrição deve ser uma string" })
  description?: string

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: "isActive deve ser um boolean" })
  isActive?: boolean

  @ApiProperty({
    example: {
      trigger: {
        type: "keyword",
        data: {
          keywords: ["oi", "olá", "começar"],
        },
      },
      actions: [
        {
          id: "1",
          type: "send_message",
          data: {
            message: "Olá {{contact.name}}! Bem-vindo!",
            messageType: "TEXT",
            delay: 0,
          },
          nextAction: "2",
        },
        {
          id: "2",
          type: "add_tag",
          data: {
            tagId: "uuid-tag-id",
          },
        },
      ],
    },
  })
  @IsObject({ message: "Flow data deve ser um objeto" })
  flowData: any

  @ApiProperty({ example: "uuid-company-id" })
  @IsString({ message: "Company ID deve ser uma string" })
  companyId: string
}
