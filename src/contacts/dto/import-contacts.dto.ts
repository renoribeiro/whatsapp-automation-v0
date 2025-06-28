import { IsArray, ValidateNested } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger"
import { CreateContactDto } from "./create-contact.dto"

export class ImportContactsDto {
  @ApiProperty({ type: [CreateContactDto] })
  @IsArray({ message: "Contatos deve ser um array" })
  @ValidateNested({ each: true })
  @Type(() => CreateContactDto)
  contacts: Omit<CreateContactDto, "companyId">[]
}
