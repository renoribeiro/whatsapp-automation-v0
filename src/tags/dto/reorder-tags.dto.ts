import { IsArray, ValidateNested, IsString, IsInt, Min } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"

class TagOrderDto {
  @ApiProperty({ example: "uuid-tag-id" })
  @IsString({ message: "ID deve ser uma string" })
  id: string

  @ApiProperty({ example: 0 })
  @IsInt({ message: "Ordem deve ser um número inteiro" })
  @Min(0, { message: "Ordem deve ser maior ou igual a 0" })
  order: number
}

export class ReorderTagsDto {
  @ApiProperty({ type: [TagOrderDto] })
  @IsArray({ message: "Tags deve ser um array" })
  @ValidateNested({ each: true })
  @Type(() => TagOrderDto)
  tags: TagOrderDto[]
}
