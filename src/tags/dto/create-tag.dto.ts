import { IsString, IsOptional, IsBoolean, IsInt, Min, Matches } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateTagDto {
  @ApiProperty({ example: "Cliente VIP" })
  @IsString({ message: "Nome deve ser uma string" })
  name: string

  @ApiProperty({ example: "#FF5733", required: false })
  @IsOptional()
  @IsString({ message: "Cor deve ser uma string" })
  @Matches(/^#[0-9A-F]{6}$/i, { message: "Cor deve estar no formato hexadecimal (#RRGGBB)" })
  color?: string

  @ApiProperty({ example: "Tag para clientes VIP", required: false })
  @IsOptional()
  @IsString({ message: "Descrição deve ser uma string" })
  description?: string

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt({ message: "Ordem deve ser um número inteiro" })
  @Min(0, { message: "Ordem deve ser maior ou igual a 0" })
  order?: number

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: "isActive deve ser um boolean" })
  isActive?: boolean

  @ApiProperty({ example: "uuid-company-id" })
  @IsString({ message: "Company ID deve ser uma string" })
  companyId: string
}
