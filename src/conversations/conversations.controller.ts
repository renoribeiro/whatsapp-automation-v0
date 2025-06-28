import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"

import type { ConversationsService } from "./conversations.service"
import type { CreateConversationDto } from "./dto/create-conversation.dto"
import type { UpdateConversationDto } from "./dto/update-conversation.dto"
import type { AssignUserDto } from "./dto/assign-user.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@ApiTags("Conversations")
@Controller("conversations")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Criar nova conversa" })
  @ApiResponse({ status: 201, description: "Conversa criada com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  create(createConversationDto: CreateConversationDto, @Request() req) {
    // Se for vendedor ou admin da empresa, só pode criar para sua empresa
    if (req.user.role === UserRole.SELLER || req.user.role === UserRole.COMPANY_ADMIN) {
      createConversationDto.companyId = req.user.companyId
    }

    return this.conversationsService.create(createConversationDto)
  }

  @Get()
  @ApiOperation({ summary: "Listar conversas" })
  @ApiResponse({ status: 200, description: "Lista de conversas" })
  findAll(@Request() req, @Query() filters: any) {
    let companyId = filters.companyId

    // Se for vendedor, só pode ver suas próprias conversas
    if (req.user.role === UserRole.SELLER) {
      return this.conversationsService.getConversationsByUser(req.user.id)
    }

    // Se for admin da empresa, só pode ver conversas da própria empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    return this.conversationsService.findAll(companyId, filters)
  }

  @Get("my-conversations")
  @Roles(UserRole.SELLER)
  @ApiOperation({ summary: "Minhas conversas atribuídas" })
  @ApiResponse({ status: 200, description: "Lista de conversas do usuário" })
  getMyConversations(@Request() req) {
    return this.conversationsService.getConversationsByUser(req.user.id)
  }

  @Get("stats")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Estatísticas de conversas" })
  @ApiResponse({ status: 200, description: "Estatísticas de conversas" })
  getStats(@Request() req, @Query("companyId") companyId?: string) {
    // Se for admin da empresa, só pode ver stats da própria empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    return this.conversationsService.getConversationStats(companyId)
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar conversa por ID" })
  @ApiResponse({ status: 200, description: "Conversa encontrada" })
  @ApiResponse({ status: 404, description: "Conversa não encontrada" })
  findOne(@Param("id") id: string) {
    return this.conversationsService.findOne(id)
  }

  @Patch(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Atualizar conversa" })
  @ApiResponse({ status: 200, description: "Conversa atualizada com sucesso" })
  @ApiResponse({ status: 404, description: "Conversa não encontrada" })
  update(@Param("id") id: string, updateConversationDto: UpdateConversationDto) {
    return this.conversationsService.update(id, updateConversationDto)
  }

  @Post(":id/assign")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Atribuir usuário à conversa" })
  @ApiResponse({ status: 200, description: "Usuário atribuído com sucesso" })
  @ApiResponse({ status: 404, description: "Conversa ou usuário não encontrado" })
  assignUser(@Param("id") id: string, @Body() assignUserDto: AssignUserDto) {
    return this.conversationsService.assignUser(id, assignUserDto.userId)
  }

  @Post(":id/mark-as-read")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Marcar conversa como lida" })
  @ApiResponse({ status: 200, description: "Conversa marcada como lida" })
  markAsRead(@Param("id") id: string) {
    return this.conversationsService.markAsRead(id)
  }

  @Post(":id/archive")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Arquivar conversa" })
  @ApiResponse({ status: 200, description: "Conversa arquivada com sucesso" })
  archive(@Param("id") id: string) {
    return this.conversationsService.archive(id)
  }

  @Post(":id/unarchive")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Desarquivar conversa" })
  @ApiResponse({ status: 200, description: "Conversa desarquivada com sucesso" })
  unarchive(@Param("id") id: string) {
    return this.conversationsService.unarchive(id)
  }
}
