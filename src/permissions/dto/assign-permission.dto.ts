import { IsString, IsNotEmpty, IsBoolean } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class AssignPermissionDto {
  @ApiProperty({
    description: "ID do usuário",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsString()
  @IsNotEmpty()
  userId: string

  @ApiProperty({
    description: "ID da permissão",
    example: "123e4567-e89b-12d3-a456-426614174001",
  })
  @IsString()
  @IsNotEmpty()
  permissionId: string

  @ApiProperty({
    description: "Se a permissão está concedida ou negada",
    example: true,
  })
  @IsBoolean()
  granted: boolean
}
