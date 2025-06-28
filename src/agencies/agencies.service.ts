import { Injectable, NotFoundException } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"
import type { CreateAgencyDto } from "./dto/create-agency.dto"
import type { UpdateAgencyDto } from "./dto/update-agency.dto"

@Injectable()
export class AgenciesService {
  constructor(private prisma: PrismaService) {}

  async create(createAgencyDto: CreateAgencyDto) {
    return this.prisma.agency.create({
      data: createAgencyDto,
    })
  }

  async findAll() {
    return this.prisma.agency.findMany({
      include: {
        _count: {
          select: {
            users: true,
            companies: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async findOne(id: string) {
    const agency = await this.prisma.agency.findUnique({
      where: { id },
      include: {
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
        companies: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
            createdAt: true,
          },
        },
        commissions: {
          include: {
            invoice: {
              select: {
                amount: true,
                status: true,
                paidAt: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
      },
    })

    if (!agency) {
      throw new NotFoundException("Agência não encontrada")
    }

    return agency
  }

  async update(id: string, updateAgencyDto: UpdateAgencyDto) {
    await this.findOne(id)

    return this.prisma.agency.update({
      where: { id },
      data: updateAgencyDto,
    })
  }

  async remove(id: string) {
    await this.findOne(id)

    return this.prisma.agency.update({
      where: { id },
      data: { isActive: false },
    })
  }

  async getCommissionStats(agencyId: string) {
    const [totalCommissions, paidCommissions, pendingCommissions] = await Promise.all([
      this.prisma.commission.aggregate({
        where: { agencyId },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.commission.aggregate({
        where: { agencyId, status: "PAID" },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.commission.aggregate({
        where: { agencyId, status: "PENDING" },
        _sum: { amount: true },
        _count: true,
      }),
    ])

    return {
      total: {
        amount: totalCommissions._sum.amount || 0,
        count: totalCommissions._count,
      },
      paid: {
        amount: paidCommissions._sum.amount || 0,
        count: paidCommissions._count,
      },
      pending: {
        amount: pendingCommissions._sum.amount || 0,
        count: pendingCommissions._count,
      },
    }
  }

  async getDashboardStats(agencyId: string) {
    const [totalCompanies, activeCompanies, totalUsers, commissionStats] = await Promise.all([
      this.prisma.company.count({
        where: { agencyId },
      }),
      this.prisma.company.count({
        where: { agencyId, isActive: true },
      }),
      this.prisma.user.count({
        where: { agencyId },
      }),
      this.getCommissionStats(agencyId),
    ])

    return {
      companies: {
        total: totalCompanies,
        active: activeCompanies,
      },
      users: totalUsers,
      commissions: commissionStats,
    }
  }
}
