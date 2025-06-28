import { Injectable, NotFoundException } from "@nestjs/common"
import { PaymentStatus } from "@prisma/client"

import type { PrismaService } from "../../prisma/prisma.service"

@Injectable()
export class CommissionService {
  constructor(private prisma: PrismaService) {}

  async calculate(invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        subscription: {
          include: {
            company: {
              include: {
                agency: true,
              },
            },
          },
        },
      },
    })

    if (!invoice) {
      throw new NotFoundException("Fatura não encontrada")
    }

    if (!invoice.subscription.company.agency) {
      return { message: "Empresa não possui agência associada" }
    }

    const agency = invoice.subscription.company.agency
    const commissionAmount = invoice.amount * agency.commission

    // Verificar se já existe comissão para esta fatura
    const existingCommission = await this.prisma.commission.findFirst({
      where: { invoiceId },
    })

    if (existingCommission) {
      return existingCommission
    }

    const commission = await this.prisma.commission.create({
      data: {
        agencyId: agency.id,
        invoiceId,
        amount: commissionAmount,
        percentage: agency.commission,
        status: PaymentStatus.PENDING,
      },
    })

    return commission
  }

  async pay(commissionId: string, paymentData: any) {
    const commission = await this.prisma.commission.findUnique({
      where: { id: commissionId },
    })

    if (!commission) {
      throw new NotFoundException("Comissão não encontrada")
    }

    return this.prisma.commission.update({
      where: { id: commissionId },
      data: {
        status: PaymentStatus.PAID,
        paidAt: new Date(),
      },
    })
  }

  async getByAgency(agencyId: string) {
    return this.prisma.commission.findMany({
      where: { agencyId },
      include: {
        invoice: {
          include: {
            subscription: {
              include: {
                company: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async getStats(agencyId?: string) {
    const where: any = {}

    if (agencyId) {
      where.agencyId = agencyId
    }

    const [total, paid, pending, totalAmount, paidAmount] = await Promise.all([
      this.prisma.commission.count({ where }),
      this.prisma.commission.count({
        where: { ...where, status: PaymentStatus.PAID },
      }),
      this.prisma.commission.count({
        where: { ...where, status: PaymentStatus.PENDING },
      }),
      this.prisma.commission.aggregate({
        where,
        _sum: {
          amount: true,
        },
      }),
      this.prisma.commission.aggregate({
        where: { ...where, status: PaymentStatus.PAID },
        _sum: {
          amount: true,
        },
      }),
    ])

    return {
      total,
      paid,
      pending,
      totalAmount: totalAmount._sum.amount || 0,
      paidAmount: paidAmount._sum.amount || 0,
      pendingAmount: (totalAmount._sum.amount || 0) - (paidAmount._sum.amount || 0),
    }
  }
}
