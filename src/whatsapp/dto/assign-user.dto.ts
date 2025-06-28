import { IsUUID } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class AssignUserDto {
  @ApiProperty({
    description: "ID do usuário",
    example: "uuid-do-usuario",
  })
  @IsUUID()
  userId: string
}
