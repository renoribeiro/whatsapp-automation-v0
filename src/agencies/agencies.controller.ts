import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"

import type { AgenciesService } from "./agencies.service"
import type { CreateAgencyDto } from "./dto/create-agency.dto"
import type { UpdateAgencyDto } from "./dto/update-agency.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"

@ApiTags("Agencies")
@Controller("agencies")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Post()
  create(createAgencyDto: CreateAgencyDto) {
    return this.agenciesService.create(createAgencyDto)
  }

  @Get()
  findAll(@Request() req) {
    // Se for admin da agência, só pode ver a própria agência
    if (req.user.role === UserRole.AGENCY_ADMIN) {
      return this.agenciesService.findOne(req.user.agencyId);
    }

    return this.agenciesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agenciesService.findOne(id);
  }

  @Get(':id/dashboard')
  getDashboard(@Param('id') id: string) {
    return this.agenciesService.getDashboardStats(id);
  }

  @Get(':id/commissions')
  getCommissions(@Param('id') id: string) {
    return this.agenciesService.getCommissionStats(id);
  }

  @Patch(":id")
  update(@Param('id') id: string, @Body() updateAgencyDto: UpdateAgencyDto) {
    return this.agenciesService.update(id, updateAgencyDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agenciesService.remove(id);
  }
}
