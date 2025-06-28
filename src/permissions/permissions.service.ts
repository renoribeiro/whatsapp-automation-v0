import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"
import type { CreatePermissionDto } from "./dto/create-permission.dto"
import type { UpdatePermissionDto } from "./dto/update-permission.dto"
import type { AssignPermissionDto } from "./dto/assign-permission.dto"

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const { name, category } = createPermissionDto

    // Verificar se já existe uma permissão com este nome
    const existingPermission = await this.prisma.permission.findUnique({
      where: { name },
    })

    if (existingPermission) {
      throw new BadRequestException("Já existe uma permissão com este nome")
    }

    return this.prisma.permission.create({
      data: createPermissionDto,
    })
  }

  async findAll() {
    return this.prisma.permission.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    })
  }

  async findByCategory(category: string) {
    return this.prisma.permission.findMany({
      where: { category },
      orderBy: { name: "asc" },
    })
  }

  async findOne(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    })

    if (!permission) {
      throw new NotFoundException("Permissão não encontrada")
    }

    return permission
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    await this.findOne(id)

    if (updatePermissionDto.name) {
      const existingPermission = await this.prisma.permission.findFirst({
        where: {
          name: updatePermissionDto.name,
          id: { not: id },
        },
      })

      if (existingPermission) {
        throw new BadRequestException("Já existe uma permissão com este nome")
      }
    }

    return this.prisma.permission.update({
      where: { id },
      data: updatePermissionDto,
    })
  }

  async remove(id: string) {
    await this.findOne(id)

    // Remover todas as associações primeiro
    await this.prisma.userPermission.deleteMany({
      where: { permissionId: id },
    })

    await this.prisma.rolePermission.deleteMany({
      where: { permissionId: id },
    })

    return this.prisma.permission.delete({
      where: { id },
    })
  }

  async assignToUser(assignPermissionDto: AssignPermissionDto) {
    const { userId, permissionId, granted } = assignPermissionDto

    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException("Usuário não encontrado")
    }

    // Verificar se a permissão existe
    await this.findOne(permissionId)

    // Verificar se já existe uma associação
    const existingAssignment = await this.prisma.userPermission.findUnique({
      where: {
        userId_permissionId: {
          userId,
          permissionId,
        },
      },
    })

    if (existingAssignment) {
      return this.prisma.userPermission.update({
        where: {
          userId_permissionId: {
            userId,
            permissionId,
          },
        },
        data: { granted },
      })
    }

    return this.prisma.userPermission.create({
      data: assignPermissionDto,
    })
  }

  async removeFromUser(userId: string, permissionId: string) {
    const assignment = await this.prisma.userPermission.findUnique({
      where: {
        userId_permissionId: {
          userId,
          permissionId,
        },
      },
    })

    if (!assignment) {
      throw new NotFoundException("Associação não encontrada")
    }

    return this.prisma.userPermission.delete({
      where: {
        userId_permissionId: {
          userId,
          permissionId,
        },
      },
    })
  }

  async getUserPermissions(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    })

    if (!user) {
      throw new NotFoundException("Usuário não encontrado")
    }

    // Buscar permissões do papel do usuário
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { role: user.role },
      include: {
        permission: true,
      },
    })

    // Combinar permissões do papel com permissões específicas do usuário
    const allPermissions = await this.prisma.permission.findMany()
    const userPermissionsMap = new Map(user.permissions.map((up) => [up.permissionId, up.granted]))
    const rolePermissionsMap = new Map(rolePermissions.map((rp) => [rp.permissionId, rp.granted]))

    return allPermissions.map((permission) => {
      const userPermission = userPermissionsMap.get(permission.id)
      const rolePermission = rolePermissionsMap.get(permission.id)

      return {
        ...permission,
        granted: userPermission !== undefined ? userPermission : rolePermission || false,
        source: userPermission !== undefined ? "user" : rolePermission ? "role" : "none",
      }
    })
  }

  async checkUserPermission(userId: string, permissionName: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    })

    if (!user) {
      return false
    }

    // Super admin tem todas as permissões
    if (user.role === "SUPER_ADMIN") {
      return true
    }

    // Verificar permissão específica do usuário primeiro
    const userPermission = user.permissions.find((up) => up.permission.name === permissionName)

    if (userPermission) {
      return userPermission.granted
    }

    // Verificar permissão do papel
    const rolePermission = await this.prisma.rolePermission.findFirst({
      where: {
        role: user.role,
        permission: {
          name: permissionName,
        },
      },
    })

    return rolePermission?.granted || false
  }

  async seedDefaultPermissions() {
    const defaultPermissions = [
      // Dashboard
      { name: "dashboard.view", description: "Visualizar dashboard", category: "dashboard" },
      { name: "dashboard.analytics", description: "Ver análises avançadas", category: "dashboard" },

      // Usuários
      { name: "users.view", description: "Visualizar usuários", category: "users" },
      { name: "users.create", description: "Criar usuários", category: "users" },
      { name: "users.edit", description: "Editar usuários", category: "users" },
      { name: "users.delete", description: "Deletar usuários", category: "users" },
      { name: "users.permissions", description: "Gerenciar permissões", category: "users" },

      // Conversas
      { name: "conversations.view", description: "Visualizar conversas", category: "conversations" },
      { name: "conversations.assign", description: "Atribuir conversas", category: "conversations" },
      { name: "conversations.close", description: "Fechar conversas", category: "conversations" },

      // Mensagens
      { name: "messages.send", description: "Enviar mensagens", category: "messages" },
      { name: "messages.schedule", description: "Agendar mensagens", category: "messages" },
      { name: "messages.bulk", description: "Envio em massa", category: "messages" },

      // Contatos
      { name: "contacts.view", description: "Visualizar contatos", category: "contacts" },
      { name: "contacts.create", description: "Criar contatos", category: "contacts" },
      { name: "contacts.edit", description: "Editar contatos", category: "contacts" },
      { name: "contacts.delete", description: "Deletar contatos", category: "contacts" },
      { name: "contacts.import", description: "Importar contatos", category: "contacts" },

      // Automação
      { name: "automation.view", description: "Visualizar automações", category: "automation" },
      { name: "automation.create", description: "Criar automações", category: "automation" },
      { name: "automation.edit", description: "Editar automações", category: "automation" },
      { name: "automation.delete", description: "Deletar automações", category: "automation" },

      // Relatórios
      { name: "reports.view", description: "Visualizar relatórios", category: "reports" },
      { name: "reports.create", description: "Criar relatórios", category: "reports" },
      { name: "reports.export", description: "Exportar relatórios", category: "reports" },

      // Configurações
      { name: "settings.view", description: "Visualizar configurações", category: "settings" },
      { name: "settings.edit", description: "Editar configurações", category: "settings" },
      { name: "settings.billing", description: "Gerenciar cobrança", category: "settings" },

      // WhatsApp
      { name: "whatsapp.connect", description: "Conectar WhatsApp", category: "whatsapp" },
      { name: "whatsapp.manage", description: "Gerenciar conexões", category: "whatsapp" },
    ]

    const results = []

    for (const permission of defaultPermissions) {
      try {
        const existing = await this.prisma.permission.findUnique({
          where: { name: permission.name },
        })

        if (!existing) {
          const created = await this.prisma.permission.create({
            data: permission,
          })
          results.push(created)
        }
      } catch (error) {
        console.error(`Erro ao criar permissão ${permission.name}:`, error)
      }
    }

    return {
      created: results.length,
      total: defaultPermissions.length,
      permissions: results,
    }
  }
}
