import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"

import type { AutomationService } from "./automation.service"
import type { CreateAutomationFlowDto } from "./dto/create-automation-flow.dto"
import type { UpdateAutomationFlowDto } from "./dto/update-automation-flow.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@ApiTags("Automation")
@Controller("automation")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Post("flows")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Criar novo fluxo de automação" })
  @ApiResponse({ status: 201, description: "Fluxo criado com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  create(@Body() createAutomationFlowDto: CreateAutomationFlowDto, @Request() req) {
    // Se for admin da empresa, só pode criar para sua empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      createAutomationFlowDto.companyId = req.user.companyId
    }

    return this.automationService.create(createAutomationFlowDto)
  }

  @Get("flows")
  @ApiOperation({ summary: "Listar fluxos de automação" })
  @ApiResponse({ status: 200, description: "Lista de fluxos" })
  findAll(@Request() req, @Query("companyId") companyId?: string) {
    // Se for admin da empresa, só pode ver fluxos da própria empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    return this.automationService.findAll(companyId)
  }

  @Get("flows/:id")
  @ApiOperation({ summary: "Buscar fluxo por ID" })
  @ApiResponse({ status: 200, description: "Fluxo encontrado" })
  @ApiResponse({ status: 404, description: "Fluxo não encontrado" })
  findOne(@Param("id") id: string) {
    return this.automationService.findOne(id)
  }

  @Get("flows/:id/stats")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Estatísticas do fluxo" })
  @ApiResponse({ status: 200, description: "Estatísticas do fluxo" })
  getStats(@Param("id") id: string) {
    return this.automationService.getFlowExecutionStats(id)
  }

  @Patch("flows/:id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Atualizar fluxo" })
  @ApiResponse({ status: 200, description: "Fluxo atualizado com sucesso" })
  @ApiResponse({ status: 404, description: "Fluxo não encontrado" })
  update(@Param("id") id: string, @Body() updateAutomationFlowDto: UpdateAutomationFlowDto) {
    return this.automationService.update(id, updateAutomationFlowDto)
  }

  @Post("flows/:id/activate")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Ativar fluxo" })
  @ApiResponse({ status: 200, description: "Fluxo ativado com sucesso" })
  activate(@Param("id") id: string) {
    return this.automationService.activate(id)
  }

  @Post("flows/:id/deactivate")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Desativar fluxo" })
  @ApiResponse({ status: 200, description: "Fluxo desativado com sucesso" })
  deactivate(@Param("id") id: string) {
    return this.automationService.deactivate(id)
  }

  @Post("flows/:id/execute")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Executar fluxo manualmente" })
  @ApiResponse({ status: 200, description: "Fluxo executado com sucesso" })
  executeFlow(@Param("id") id: string, @Body() body: { contactId: string; triggerData?: any }) {
    return this.automationService.executeFlow(id, body.contactId, body.triggerData)
  }

  @Delete("flows/:id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Deletar fluxo" })
  @ApiResponse({ status: 200, description: "Fluxo deletado com sucesso" })
  @ApiResponse({ status: 404, description: "Fluxo não encontrado" })
  remove(@Param("id") id: string) {
    return this.automationService.remove(id)
  }
}
