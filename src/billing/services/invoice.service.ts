import { Injectable, NotFoundException } from "@nestjs/common"
import { PaymentStatus } from "@prisma/client"

import type { PrismaService } from "../../prisma/prisma.service"

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async generate(subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        company: true,
      },
    })

    if (!subscription) {
      throw new NotFoundException("Assinatura não encontrada")
    }

    // Gerar número da fatura
    const invoiceNumber = await this.generateInvoiceNumber()

    // Data de vencimento (30 dias)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 30)

    const invoice = await this.prisma.invoice.create({
      data: {
        subscriptionId,
        invoiceNumber,
        amount: subscription.totalAmount,
        status: PaymentStatus.PENDING,
        dueDate,
      },
    })

    return invoice
  }

  async processPayment(invoiceId: string, paymentData: any) {
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

    // Atualizar fatura como paga
    const updatedInvoice = await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: PaymentStatus.PAID,
        paidAt: new Date(),
        paymentMethod: paymentData.method || "stripe",
        stripeInvoiceId: paymentData.stripeInvoiceId,
      },
    })

    // Atualizar assinatura para ativa
    await this.prisma.subscription.update({
      where: { id: invoice.subscriptionId },
      data: {
        status: "ACTIVE",
      },
    })

    // Calcular comissões se houver agência
    if (invoice.subscription.company.agency) {
      await this.calculateCommission(invoice.id, invoice.subscription.company.agency.id)
    }

    return updatedInvoice
  }

  async markAsFailed(invoiceId: string, reason?: string) {
    return this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: PaymentStatus.FAILED,
      },
    })
  }

  async refund(invoiceId: string, refundData: any) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    })

    if (!invoice) {
      throw new NotFoundException("Fatura não encontrada")
    }

    return this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: PaymentStatus.REFUNDED,
      },
    })
  }

  async getBySubscription(subscriptionId: string) {
    return this.prisma.invoice.findMany({
      where: { subscriptionId },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async getStats(companyId?: string, agencyId?: string) {
    const where: any = {}

    if (companyId) {
      where.subscription = {
        companyId,
      }
    } else if (agencyId) {
      where.subscription = {
        company: {
          agencyId,
        },
      }
    }

    const [total, paid, pending, failed, revenue] = await Promise.all([
      this.prisma.invoice.count({ where }),
      this.prisma.invoice.count({
        where: { ...where, status: PaymentStatus.PAID },
      }),
      this.prisma.invoice.count({
        where: { ...where, status: PaymentStatus.PENDING },
      }),
      this.prisma.invoice.count({
        where: { ...where, status: PaymentStatus.FAILED },
      }),
      this.prisma.invoice.aggregate({
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
      failed,
      totalRevenue: revenue._sum.amount || 0,
    }
  }

  private async generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, "0")

    // Contar faturas do mês atual
    const count = await this.prisma.invoice.count({
      where: {
        createdAt: {
          gte: new Date(year, new Date().getMonth(), 1),
          lt: new Date(year, new Date().getMonth() + 1, 1),
        },
      },
    })

    const sequence = String(count + 1).padStart(4, "0")
    return `INV-${year}${month}-${sequence}`
  }

  private async calculateCommission(invoiceId: string, agencyId: string) {
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

    if (!invoice || !invoice.subscription.company.agency) {
      return
    }

    const commissionPercentage = invoice.subscription.company.agency.commission
    const commissionAmount = invoice.amount * commissionPercentage

    await this.prisma.commission.create({
      data: {
        agencyId,
        invoiceId,
        amount: commissionAmount,
        percentage: commissionPercentage,
        status: PaymentStatus.PENDING,
      },
    })
  }
}
