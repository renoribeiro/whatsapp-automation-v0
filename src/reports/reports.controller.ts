import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"

import type { ReportsService } from "./reports.service"
import type { CreateReportDto } from "./dto/create-report.dto"
import type { UpdateReportDto } from "./dto/update-report.dto"
import type { GenerateReportDto } from "./dto/generate-report.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@ApiTags("Reports")
@Controller("reports")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Criar novo relatório" })
  @ApiResponse({ status: 201, description: "Relatório criado com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  create(@Body() createReportDto: CreateReportDto, @Request() req) {
    // Se for admin da empresa, só pode criar para sua empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      createReportDto.companyId = req.user.companyId
    }

    return this.reportsService.create(createReportDto)
  }

  @Post("generate")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Gerar relatório" })
  @ApiResponse({ status: 200, description: "Relatório gerado com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  generateReport(@Body() generateReportDto: GenerateReportDto, @Request() req) {
    // Se for admin da empresa, só pode gerar para sua empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      generateReportDto.companyId = req.user.companyId
    }

    return this.reportsService.generateReport(generateReportDto)
  }

  @Get("dashboard")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Estatísticas do dashboard" })
  @ApiResponse({ status: 200, description: "Estatísticas do dashboard" })
  getDashboard(@Request() req, @Query("companyId") companyId?: string) {
    // Se for admin da empresa, só pode ver dashboard da própria empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    return this.reportsService.getDashboardStats(companyId)
  }

  @Get("performance")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Relatório de performance" })
  @ApiResponse({ status: 200, description: "Relatório de performance" })
  getPerformance(@Request() req, @Query() filters: any) {
    let companyId = filters.companyId

    // Se for admin da empresa, só pode ver performance da própria empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    return this.reportsService.getPerformanceReport(companyId, filters)
  }

  @Get("leads")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Relatório de leads" })
  @ApiResponse({ status: 200, description: "Relatório de leads" })
  getLeads(@Request() req, @Query() filters: any) {
    let companyId = filters.companyId

    // Se for admin da empresa, só pode ver leads da própria empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    return this.reportsService.getLeadsReport(companyId, filters)
  }

  @Get()
  @ApiOperation({ summary: "Listar relatórios salvos" })
  @ApiResponse({ status: 200, description: "Lista de relatórios" })
  findAll(@Request() req, @Query("companyId") companyId?: string) {
    // Se for admin da empresa, só pode ver relatórios da própria empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    return this.reportsService.findAll(companyId)
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar relatório por ID" })
  @ApiResponse({ status: 200, description: "Relatório encontrado" })
  @ApiResponse({ status: 404, description: "Relatório não encontrado" })
  findOne(@Param("id") id: string) {
    return this.reportsService.findOne(id)
  }

  @Patch(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Atualizar relatório" })
  @ApiResponse({ status: 200, description: "Relatório atualizado com sucesso" })
  @ApiResponse({ status: 404, description: "Relatório não encontrado" })
  update(@Param("id") id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(id, updateReportDto)
  }

  @Delete(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Deletar relatório" })
  @ApiResponse({ status: 200, description: "Relatório deletado com sucesso" })
  @ApiResponse({ status: 404, description: "Relatório não encontrado" })
  remove(@Param("id") id: string) {
    return this.reportsService.remove(id)
  }
}
