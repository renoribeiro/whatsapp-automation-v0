import { IsString, IsEmail, IsOptional, IsBoolean } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateContactDto {
  @ApiProperty({ example: "+5511999999999" })
  @IsString({ message: "Número de telefone deve ser uma string" })
  phoneNumber: string

  @ApiProperty({ example: "João Silva", required: false })
  @IsOptional()
  @IsString({ message: "Nome deve ser uma string" })
  name?: string

  @ApiProperty({ example: "joao@email.com", required: false })
  @IsOptional()
  @IsEmail({}, { message: "Email deve ter um formato válido" })
  email?: string

  @ApiProperty({ example: "https://avatar.url", required: false })
  @IsOptional()
  @IsString({ message: "Avatar deve ser uma string" })
  avatar?: string

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean({ message: "isBlocked deve ser um boolean" })
  isBlocked?: boolean

  @ApiProperty({ example: "Contato interessado em produto X", required: false })
  @IsOptional()
  @IsString({ message: "Notas devem ser uma string" })
  notes?: string

  @ApiProperty({ example: "META_ADS", required: false })
  @IsOptional()
  @IsString({ message: "Lead source deve ser uma string" })
  leadSource?: string

  @ApiProperty({ example: "google", required: false })
  @IsOptional()
  @IsString({ message: "UTM source deve ser uma string" })
  utmSource?: string

  @ApiProperty({ example: "cpc", required: false })
  @IsOptional()
  @IsString({ message: "UTM medium deve ser uma string" })
  utmMedium?: string

  @ApiProperty({ example: "campanha-verao", required: false })
  @IsOptional()
  @IsString({ message: "UTM campaign deve ser uma string" })
  utmCampaign?: string

  @ApiProperty({ example: "whatsapp", required: false })
  @IsOptional()
  @IsString({ message: "UTM term deve ser uma string" })
  utmTerm?: string

  @ApiProperty({ example: "botao-cta", required: false })
  @IsOptional()
  @IsString({ message: "UTM content deve ser uma string" })
  utmContent?: string

  @ApiProperty({ example: "uuid-company-id" })
  @IsString({ message: "Company ID deve ser uma string" })
  companyId: string
}
