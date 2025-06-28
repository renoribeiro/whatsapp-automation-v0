import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Request, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"

import type { MessagesService } from "./messages.service"
import type { CreateMessageDto } from "./dto/create-message.dto"
import type { SendMessageDto } from "./dto/send-message.dto"
import type { ScheduleMessageDto } from "./dto/schedule-message.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@ApiTags("Messages")
@Controller("messages")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Criar nova mensagem" })
  @ApiResponse({ status: 201, description: "Mensagem criada com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  create(createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto)
  }

  @Post("send")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Enviar mensagem" })
  @ApiResponse({ status: 201, description: "Mensagem enviada com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  sendMessage(sendMessageDto: SendMessageDto, @Request() req) {
    return this.messagesService.sendMessage(sendMessageDto, req.user.id)
  }

  @Post("schedule")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Agendar mensagem" })
  @ApiResponse({ status: 201, description: "Mensagem agendada com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  scheduleMessage(scheduleMessageDto: ScheduleMessageDto, @Request() req) {
    return this.messagesService.scheduleMessage(scheduleMessageDto, req.user.id)
  }

  @Get("conversation/:conversationId")
  @ApiOperation({ summary: "Listar mensagens de uma conversa" })
  @ApiResponse({ status: 200, description: "Lista de mensagens" })
  findByConversation(@Param("conversationId") conversationId: string, @Query() filters: any) {
    return this.messagesService.findByConversation(conversationId, filters)
  }

  @Get("scheduled")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Listar mensagens agendadas" })
  @ApiResponse({ status: 200, description: "Lista de mensagens agendadas" })
  getScheduledMessages(@Request() req, @Query("companyId") companyId?: string) {
    // Se for admin da empresa, só pode ver mensagens da própria empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    return this.messagesService.getScheduledMessages(companyId)
  }

  @Get("stats")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Estatísticas de mensagens" })
  @ApiResponse({ status: 200, description: "Estatísticas de mensagens" })
  getStats(@Request() req, @Query() filters: any) {
    let companyId = filters.companyId

    // Se for admin da empresa, só pode ver stats da própria empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    return this.messagesService.getMessageStats(companyId, filters)
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar mensagem por ID" })
  @ApiResponse({ status: 200, description: "Mensagem encontrada" })
  @ApiResponse({ status: 404, description: "Mensagem não encontrada" })
  findOne(@Param("id") id: string) {
    return this.messagesService.findOne(id)
  }

  @Patch(":id/mark-as-read")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Marcar mensagem como lida" })
  @ApiResponse({ status: 200, description: "Mensagem marcada como lida" })
  markAsRead(@Param("id") id: string) {
    return this.messagesService.markAsRead(id)
  }

  @Patch(":id/mark-as-delivered")
  @ApiOperation({ summary: "Marcar mensagem como entregue" })
  @ApiResponse({ status: 200, description: "Mensagem marcada como entregue" })
  markAsDelivered(@Param("id") id: string) {
    return this.messagesService.markAsDelivered(id)
  }

  @Delete("scheduled/:id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Cancelar mensagem agendada" })
  @ApiResponse({ status: 200, description: "Mensagem agendada cancelada" })
  @ApiResponse({ status: 400, description: "Mensagem não pode ser cancelada" })
  cancelScheduledMessage(@Param("id") id: string) {
    return this.messagesService.cancelScheduledMessage(id)
  }
}
