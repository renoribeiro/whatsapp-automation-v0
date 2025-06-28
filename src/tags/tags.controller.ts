import { Controller, Get, Post, Patch, Param, Delete, UseGuards, Request, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"

import type { TagsService } from "./tags.service"
import type { CreateTagDto } from "./dto/create-tag.dto"
import type { UpdateTagDto } from "./dto/update-tag.dto"
import type { ReorderTagsDto } from "./dto/reorder-tags.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@ApiTags("Tags")
@Controller("tags")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Criar nova tag" })
  @ApiResponse({ status: 201, description: "Tag criada com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  create(createTagDto: CreateTagDto, @Request() req) {
    // Se for vendedor ou admin da empresa, só pode criar para sua empresa
    if (req.user.role === UserRole.SELLER || req.user.role === UserRole.COMPANY_ADMIN) {
      createTagDto.companyId = req.user.companyId
    }

    return this.tagsService.create(createTagDto)
  }

  @Post("reorder")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Reordenar tags" })
  @ApiResponse({ status: 200, description: "Tags reordenadas com sucesso" })
  reorderTags(reorderTagsDto: ReorderTagsDto, @Request() req, @Query("companyId") companyId?: string) {
    // Se for admin da empresa, só pode reordenar tags da própria empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    return this.tagsService.reorderTags(companyId, reorderTagsDto.tags)
  }

  @Get()
  @ApiOperation({ summary: "Listar tags" })
  @ApiResponse({ status: 200, description: "Lista de tags" })
  findAll(@Request() req, @Query("companyId") companyId?: string) {
    // Se for vendedor ou admin da empresa, só pode ver tags da própria empresa
    if (req.user.role === UserRole.SELLER || req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    return this.tagsService.findAll(companyId)
  }

  @Get("stats")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Estatísticas de tags" })
  @ApiResponse({ status: 200, description: "Estatísticas de tags" })
  getStats(@Request() req, @Query("companyId") companyId?: string) {
    // Se for admin da empresa, só pode ver stats da própria empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    return this.tagsService.getTagStats(companyId)
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar tag por ID" })
  @ApiResponse({ status: 200, description: "Tag encontrada" })
  @ApiResponse({ status: 404, description: "Tag não encontrada" })
  findOne(@Param("id") id: string) {
    return this.tagsService.findOne(id)
  }

  @Patch(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN, UserRole.SELLER)
  @ApiOperation({ summary: "Atualizar tag" })
  @ApiResponse({ status: 200, description: "Tag atualizada com sucesso" })
  @ApiResponse({ status: 404, description: "Tag não encontrada" })
  update(@Param("id") id: string, updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto)
  }

  @Delete(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Deletar tag" })
  @ApiResponse({ status: 200, description: "Tag deletada com sucesso" })
  @ApiResponse({ status: 404, description: "Tag não encontrada" })
  remove(@Param("id") id: string) {
    return this.tagsService.remove(id)
  }
}
