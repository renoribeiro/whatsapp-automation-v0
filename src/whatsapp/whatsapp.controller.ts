import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"

import type { WhatsappService } from "./whatsapp.service"
import type { CreateConnectionDto } from "./dto/create-connection.dto"
import type { UpdateConnectionDto } from "./dto/update-connection.dto"
import type { AssignUserDto } from "./dto/assign-user.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@ApiTags("WhatsApp Connections")
@Controller("whatsapp")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post("connections")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Criar nova conexão WhatsApp" })
  @ApiResponse({ status: 201, description: "Conexão criada com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  createConnection(@Body() createConnectionDto: CreateConnectionDto, @Request() req) {
    // Se for admin da empresa, só pode criar para sua empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      createConnectionDto.companyId = req.user.companyId
    }

    return this.whatsappService.createConnection(createConnectionDto)
  }

  @Get("connections")
  @ApiOperation({ summary: "Listar conexões WhatsApp" })
  @ApiResponse({ status: 200, description: "Lista de conexões" })
  findAllConnections(@Request() req, @Query('companyId') companyId?: string) {
    // Se for vendedor, só pode ver suas próprias conexões
    if (req.user.role === UserRole.SELLER) {
      return this.whatsappService.getConnectionsByUser(req.user.id)
    }

    // Se for admin da empresa, só pode ver conexões da própria empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    return this.whatsappService.findAllByCompany(companyId)
  }

  @Get('connections/:id')
  @ApiOperation({ summary: 'Buscar conexão por ID' })
  @ApiResponse({ status: 200, description: 'Conexão encontrada' })
  @ApiResponse({ status: 404, description: 'Conexão não encontrada' })
  findOneConnection(@Param('id') id: string) {
    return this.whatsappService.findOne(id);
  }

  @Get('connections/:id/qrcode')
  @ApiOperation({ summary: 'Obter QR Code da conexão' })
  @ApiResponse({ status: 200, description: 'QR Code obtido com sucesso' })
  @ApiResponse({ status: 400, description: 'QR Code não disponível para este tipo de conexão' })
  getQrCode(@Param('id') id: string) {
    return this.whatsappService.getQrCode(id);
  }

  @Get('connections/:id/status')
  @ApiOperation({ summary: 'Verificar status da conexão' })
  @ApiResponse({ status: 200, description: 'Status verificado com sucesso' })
  checkStatus(@Param('id') id: string) {
    return this.whatsappService.checkConnectionStatus(id);
  }

  @Patch("connections/:id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Atualizar conexão" })
  @ApiResponse({ status: 200, description: "Conexão atualizada com sucesso" })
  @ApiResponse({ status: 404, description: "Conexão não encontrada" })
  updateConnection(@Param('id') id: string, @Body() updateConnectionDto: UpdateConnectionDto) {
    return this.whatsappService.updateConnection(id, updateConnectionDto)
  }

  @Post("connections/:id/assign-user")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Atribuir usuário à conexão" })
  @ApiResponse({ status: 200, description: "Usuário atribuído com sucesso" })
  @ApiResponse({ status: 404, description: "Conexão ou usuário não encontrado" })
  assignUser(@Param('id') id: string, @Body() assignUserDto: AssignUserDto) {
    return this.whatsappService.assignUserToConnection(id, assignUserDto.userId)
  }

  @Delete('connections/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: 'Deletar conexão' })
  @ApiResponse({ status: 200, description: 'Conexão deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conexão não encontrada' })
  deleteConnection(@Param('id') id: string) {
    return this.whatsappService.deleteConnection(id);
  }
}
