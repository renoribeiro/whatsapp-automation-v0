import { IsEmail, IsString, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class LoginDto {
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
}
