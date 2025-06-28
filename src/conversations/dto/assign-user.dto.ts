import { IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class AssignUserDto {
  @ApiProperty({ example: "uuid-user-id" })
  @IsString({ message: "User ID deve ser uma string" })
  userId: string
}
