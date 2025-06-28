import { Injectable, NotFoundException } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"
import type { CreateCompanyDto } from "./dto/create-company.dto"
import type { UpdateCompanyDto } from "./dto/update-company.dto"

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: createCompanyDto,
      include: {
        agency: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  }

  async findAll(agencyId?: string) {
    const where: any = {}

    if (agencyId) {
      where.agencyId = agencyId
    }

    return this.prisma.company.findMany({
      where,
      include: {
        agency: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            users: true,
            whatsappConnections: true,
            contacts: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        agency: {
          select: {
            id: true,
            name: true,
          },
        },
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
        whatsappConnections: {
          select: {
            id: true,
            phoneNumber: true,
            displayName: true,
            status: true,
            connectionType: true,
          },
        },
        subscriptions: {
          where: {
            status: "ACTIVE",
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    })

    if (!company) {
      throw new NotFoundException("Empresa não encontrada")
    }

    return company
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(id)

    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
      include: {
        agency: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
  }

  async remove(id: string) {
    await this.findOne(id)

    return this.prisma.company.update({
      where: { id },
      data: { isActive: false },
    })
  }

  async getStats(companyId: string) {
    const [totalUsers, activeUsers, totalConnections, activeConnections, totalContacts, totalConversations] =
      await Promise.all([
        this.prisma.user.count({
          where: { companyId },
        }),
        this.prisma.user.count({
          where: { companyId, isActive: true },
        }),
        this.prisma.whatsAppConnection.count({
          where: { companyId },
        }),
        this.prisma.whatsAppConnection.count({
          where: { companyId, status: "CONNECTED" },
        }),
        this.prisma.contact.count({
          where: { companyId },
        }),
        this.prisma.conversation.count({
          where: { companyId },
        }),
      ])

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      connections: {
        total: totalConnections,
        active: activeConnections,
      },
      contacts: totalContacts,
      conversations: totalConversations,
    }
  }
}
