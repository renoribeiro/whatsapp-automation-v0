import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"

import type { IntegrationsService } from "./integrations.service"
import type { CreateIntegrationDto } from "./dto/create-integration.dto"
import type { UpdateIntegrationDto } from "./dto/update-integration.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@ApiTags("Integrations")
@Controller("integrations")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Criar nova integração" })
  @ApiResponse({ status: 201, description: "Integração criada com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  create(@Body() createIntegrationDto: CreateIntegrationDto, @Request() req) {
    // Se for admin da empresa, só pode criar para sua empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      createIntegrationDto.companyId = req.user.companyId
    }

    return this.integrationsService.create(createIntegrationDto)
  }

  @Get()
  @ApiOperation({ summary: "Listar integrações" })
  @ApiResponse({ status: 200, description: "Lista de integrações" })
  findAll(@Request() req, @Query("companyId") companyId?: string) {
    // Se for admin da empresa, só pode ver integrações da própria empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    return this.integrationsService.findAll(companyId)
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar integração por ID" })
  @ApiResponse({ status: 200, description: "Integração encontrada" })
  @ApiResponse({ status: 404, description: "Integração não encontrada" })
  findOne(@Param("id") id: string) {
    return this.integrationsService.findOne(id)
  }

  @Post(":id/test")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Testar integração" })
  @ApiResponse({ status: 200, description: "Teste realizado com sucesso" })
  @ApiResponse({ status: 400, description: "Erro no teste da integração" })
  testIntegration(@Param("id") id: string) {
    return this.integrationsService.testIntegration(id)
  }

  @Post(":id/execute")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Executar integração" })
  @ApiResponse({ status: 200, description: "Integração executada com sucesso" })
  @ApiResponse({ status: 400, description: "Erro na execução da integração" })
  executeIntegration(@Param("id") id: string, @Body() data: any) {
    return this.integrationsService.executeIntegration(id, data)
  }

  @Post(":id/sync-contacts")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Sincronizar contatos" })
  @ApiResponse({ status: 200, description: "Contatos sincronizados com sucesso" })
  @ApiResponse({ status: 400, description: "Erro na sincronização" })
  syncContacts(@Param("id") id: string) {
    return this.integrationsService.syncContacts(id)
  }

  @Patch(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Atualizar integração" })
  @ApiResponse({ status: 200, description: "Integração atualizada com sucesso" })
  @ApiResponse({ status: 404, description: "Integração não encontrada" })
  update(@Param("id") id: string, @Body() updateIntegrationDto: UpdateIntegrationDto) {
    return this.integrationsService.update(id, updateIntegrationDto)
  }

  @Delete(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Deletar integração" })
  @ApiResponse({ status: 200, description: "Integração deletada com sucesso" })
  @ApiResponse({ status: 404, description: "Integração não encontrada" })
  remove(@Param("id") id: string) {
    return this.integrationsService.remove(id)
  }
}
