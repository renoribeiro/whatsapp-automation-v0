import { IsString, IsNotEmpty, IsOptional, MaxLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreatePermissionDto {
  @ApiProperty({
    description: "Nome único da permissão",
    example: "users.create",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string

  @ApiProperty({
    description: "Descrição da permissão",
    example: "Criar novos usuários",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string

  @ApiProperty({
    description: "Categoria da permissão",
    example: "users",
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  category: string

  @ApiProperty({
    description: "Informações adicionais sobre a permissão",
    example: "Permite criar usuários com qualquer papel",
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  metadata?: string
}
