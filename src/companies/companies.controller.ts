import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Query, Request } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"

import type { CompaniesService } from "./companies.service"
import type { CreateCompanyDto } from "./dto/create-company.dto"
import type { UpdateCompanyDto } from "./dto/update-company.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@ApiTags("Companies")
@Controller("companies")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN)
  @ApiOperation({ summary: "Criar nova empresa" })
  @ApiResponse({ status: 201, description: "Empresa criada com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  create(createCompanyDto: CreateCompanyDto, @Request() req) {
    // Se for admin da agência, automaticamente vincula à agência
    if (req.user.role === UserRole.AGENCY_ADMIN) {
      createCompanyDto.agencyId = req.user.agencyId
    }

    return this.companiesService.create(createCompanyDto)
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Listar empresas" })
  @ApiResponse({ status: 200, description: "Lista de empresas" })
  findAll(@Request() req, @Query('agencyId') agencyId?: string) {
    // Se for admin da agência, só pode ver empresas da própria agência
    if (req.user.role === UserRole.AGENCY_ADMIN) {
      agencyId = req.user.agencyId
    }

    // Se for admin da empresa, só pode ver a própria empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      return [this.companiesService.findOne(req.user.companyId)]
    }

    return this.companiesService.findAll(agencyId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar empresa por ID' })
  @ApiResponse({ status: 200, description: 'Empresa encontrada' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Get(':id/stats')
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: 'Estatísticas da empresa' })
  @ApiResponse({ status: 200, description: 'Estatísticas da empresa' })
  getStats(@Param('id') id: string) {
    return this.companiesService.getStats(id);
  }

  @Patch(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Atualizar empresa" })
  @ApiResponse({ status: 200, description: "Empresa atualizada com sucesso" })
  @ApiResponse({ status: 404, description: "Empresa não encontrada" })
  update(@Param('id') id: string, updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto)
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN)
  @ApiOperation({ summary: 'Desativar empresa' })
  @ApiResponse({ status: 200, description: 'Empresa desativada com sucesso' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
