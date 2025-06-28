import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsUUID, IsBoolean } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"

export class CreateUserDto {
  @ApiProperty({
    description: "Email do usuário",
    example: "usuario@exemplo.com",
  })
  @IsEmail({}, { message: "Email deve ter um formato válido" })
  email: string

  @ApiProperty({
    description: "Senha do usuário",
    example: "minhasenha123",
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: "Senha deve ter pelo menos 6 caracteres" })
  password: string

  @ApiProperty({
    description: "Primeiro nome",
    example: "João",
  })
  @IsString()
  firstName: string

  @ApiProperty({
    description: "Último nome",
    example: "Silva",
  })
  @IsString()
  lastName: string

  @ApiProperty({
    description: "Telefone do usuário",
    example: "+5511999999999",
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({
    description: "Papel do usuário",
    enum: UserRole,
    example: UserRole.SELLER,
  })
  @IsEnum(UserRole)
  role: UserRole

  @ApiProperty({
    description: "Se o usuário está ativo",
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @ApiProperty({
    description: "ID da empresa",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  companyId?: string

  @ApiProperty({
    description: "ID da agência",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  agencyId?: string
}
