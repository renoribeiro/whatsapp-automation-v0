import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"

import type { PermissionsService } from "./permissions.service"
import type { CreatePermissionDto } from "./dto/create-permission.dto"
import type { UpdatePermissionDto } from "./dto/update-permission.dto"
import type { AssignPermissionDto } from "./dto/assign-permission.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@ApiTags("Permissions")
@Controller("permissions")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Criar nova permissão" })
  @ApiResponse({ status: 201, description: "Permissão criada com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto)
  }

  @Post("seed")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Criar permissões padrão" })
  @ApiResponse({ status: 201, description: "Permissões criadas com sucesso" })
  seedDefaultPermissions() {
    return this.permissionsService.seedDefaultPermissions()
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Listar todas as permissões" })
  @ApiResponse({ status: 200, description: "Lista de permissões" })
  findAll(@Query("category") category?: string) {
    if (category) {
      return this.permissionsService.findByCategory(category)
    }
    return this.permissionsService.findAll()
  }

  @Get("user/:userId")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Buscar permissões de um usuário" })
  @ApiResponse({ status: 200, description: "Permissões do usuário" })
  @ApiResponse({ status: 404, description: "Usuário não encontrado" })
  getUserPermissions(@Param("userId") userId: string) {
    return this.permissionsService.getUserPermissions(userId)
  }

  @Get(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Buscar permissão por ID" })
  @ApiResponse({ status: 200, description: "Permissão encontrada" })
  @ApiResponse({ status: 404, description: "Permissão não encontrada" })
  findOne(@Param("id") id: string) {
    return this.permissionsService.findOne(id)
  }

  @Patch(":id")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Atualizar permissão" })
  @ApiResponse({ status: 200, description: "Permissão atualizada com sucesso" })
  @ApiResponse({ status: 404, description: "Permissão não encontrada" })
  update(@Param("id") id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(id, updatePermissionDto)
  }

  @Post("assign")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Atribuir permissão a usuário" })
  @ApiResponse({ status: 201, description: "Permissão atribuída com sucesso" })
  @ApiResponse({ status: 404, description: "Usuário ou permissão não encontrado" })
  assignToUser(@Body() assignPermissionDto: AssignPermissionDto) {
    return this.permissionsService.assignToUser(assignPermissionDto)
  }

  @Delete("user/:userId/permission/:permissionId")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Remover permissão de usuário" })
  @ApiResponse({ status: 200, description: "Permissão removida com sucesso" })
  @ApiResponse({ status: 404, description: "Associação não encontrada" })
  removeFromUser(@Param("userId") userId: string, @Param("permissionId") permissionId: string) {
    return this.permissionsService.removeFromUser(userId, permissionId)
  }

  @Delete(":id")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Deletar permissão" })
  @ApiResponse({ status: 200, description: "Permissão deletada com sucesso" })
  @ApiResponse({ status: 404, description: "Permissão não encontrada" })
  remove(@Param("id") id: string) {
    return this.permissionsService.remove(id)
  }
}
