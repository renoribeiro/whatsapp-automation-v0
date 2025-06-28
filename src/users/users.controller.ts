import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from "@nestjs/common"
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"

import type { UsersService } from "./users.service"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"

@ApiTags("Users")
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Request() req, @Query('companyId') companyId?: string) {
    // Se for admin da empresa, só pode ver usuários da própria empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    // Se for admin da agência, pode ver usuários das empresas da agência
    if (req.user.role === UserRole.AGENCY_ADMIN) {
      return this.usersService.findAll(companyId, req.user.agencyId)
    }

    return this.usersService.findAll(companyId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch(":id")
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
