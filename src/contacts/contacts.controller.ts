import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Request, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"

import type { ContactsService } from "./contacts.service"
import type { CreateContactDto } from "./dto/create-contact.dto"
import type { UpdateContactDto } from "./dto/update-contact.dto"
import type { ImportContactsDto } from "./dto/import-contacts.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@ApiTags("Contacts")
@Controller("contacts")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Criar novo contato" })
  @ApiResponse({ status: 201, description: "Contato criado com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  create(createContactDto: CreateContactDto, @Request() req) {
    // Se for vendedor ou admin da empresa, só pode criar para sua empresa
    if (req.user.role === UserRole.SELLER || req.user.role === UserRole.COMPANY_ADMIN) {
      createContactDto.companyId = req.user.companyId
    }

    return this.contactsService.create(createContactDto)
  }

  @Post("import")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Importar contatos em massa" })
  @ApiResponse({ status: 201, description: "Contatos importados com sucesso" })
  importContacts(importContactsDto: ImportContactsDto, @Request() req, @Query('companyId') companyId?: string) {
    // Se for admin da empresa, só pode importar para sua empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    return this.contactsService.importContacts(companyId, importContactsDto)
  }

  @Get()
  @ApiOperation({ summary: "Listar contatos" })
  @ApiResponse({ status: 200, description: "Lista de contatos" })
  findAll(@Request() req, @Query() filters: any) {
    let companyId = filters.companyId

    // Se for vendedor ou admin da empresa, só pode ver contatos da própria empresa
    if (req.user.role === UserRole.SELLER || req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    return this.contactsService.findAll(companyId, filters)
  }

  @Get("stats")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Estatísticas de contatos" })
  @ApiResponse({ status: 200, description: "Estatísticas de contatos" })
  getStats(@Request() req, @Query("companyId") companyId?: string) {
    // Se for admin da empresa, só pode ver stats da própria empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    return this.contactsService.getContactStats(companyId)
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar contato por ID" })
  @ApiResponse({ status: 200, description: "Contato encontrado" })
  @ApiResponse({ status: 404, description: "Contato não encontrado" })
  findOne(@Param("id") id: string) {
    return this.contactsService.findOne(id)
  }

  @Patch(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Atualizar contato" })
  @ApiResponse({ status: 200, description: "Contato atualizado com sucesso" })
  @ApiResponse({ status: 404, description: "Contato não encontrado" })
  update(@Param("id") id: string, updateContactDto: UpdateContactDto) {
    return this.contactsService.update(id, updateContactDto)
  }

  @Post(":id/tags/:tagId")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Adicionar tag ao contato" })
  @ApiResponse({ status: 200, description: "Tag adicionada com sucesso" })
  addTag(@Param("id") id: string, @Param("tagId") tagId: string) {
    return this.contactsService.addTag(id, tagId)
  }

  @Delete(":id/tags/:tagId")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Remover tag do contato" })
  @ApiResponse({ status: 200, description: "Tag removida com sucesso" })
  removeTag(@Param("id") id: string, @Param("tagId") tagId: string) {
    return this.contactsService.removeTag(id, tagId)
  }

  @Post(":id/block")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Bloquear contato" })
  @ApiResponse({ status: 200, description: "Contato bloqueado com sucesso" })
  blockContact(@Param("id") id: string) {
    return this.contactsService.blockContact(id)
  }

  @Post(":id/unblock")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Desbloquear contato" })
  @ApiResponse({ status: 200, description: "Contato desbloqueado com sucesso" })
  unblockContact(@Param("id") id: string) {
    return this.contactsService.unblockContact(id)
  }

  @Delete(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Deletar contato" })
  @ApiResponse({ status: 200, description: "Contato deletado com sucesso" })
  @ApiResponse({ status: 404, description: "Contato não encontrado" })
  remove(@Param("id") id: string) {
    return this.contactsService.remove(id)
  }
}
