import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectQueue } from "@nestjs/bull"
import type { Queue } from "bull"
import { SubscriptionStatus } from "@prisma/client"

import type { PrismaService } from "../../prisma/prisma.service"
import type { UsersService } from "../../users/users.service"

@Injectable()
export class SubscriptionService {
  private billingQueue: Queue

  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {
    this.billingQueue = InjectQueue("billing")
  }

  async create(companyId: string, planData: any) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    })

    if (!company) {
      throw new NotFoundException("Empresa não encontrada")
    }

    // Verificar se já existe uma assinatura ativa
    const existingSubscription = await this.prisma.subscription.findFirst({
      where: {
        companyId,
        status: {
          in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL],
        },
      },
    })

    if (existingSubscription) {
      throw new BadRequestException("Empresa já possui uma assinatura ativa")
    }

    // Contar usuários ativos
    const activeUsers = await this.usersService.getActiveSellersByCompany(companyId)

    // Calcular valores
    const basePrice = 150.0 // R$ 150 base
    const pricePerUser = 100.0 // R$ 100 por vendedor
    const totalAmount = basePrice + activeUsers * pricePerUser

    // Período de trial de 7 dias
    const now = new Date()
    const trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const currentPeriodStart = now
    const currentPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())

    const subscription = await this.prisma.subscription.create({
      data: {
        companyId,
        status: SubscriptionStatus.TRIAL,
        planName: planData.planName || "Standard",
        basePrice,
        pricePerUser,
        activeUsers,
        totalAmount,
        billingCycle: planData.billingCycle || "monthly",
        currentPeriodStart,
        currentPeriodEnd,
        trialEndsAt,
      },
    })

    // Agendar cobrança para o final do trial
    await this.billingQueue.add(
      "process-trial-end",
      {
        subscriptionId: subscription.id,
      },
      {
        delay: trialEndsAt.getTime() - now.getTime(),
      },
    )

    return subscription
  }

  async update(subscriptionId: string, updateData: any) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    })

    if (!subscription) {
      throw new NotFoundException("Assinatura não encontrada")
    }

    // Se está mudando o número de usuários, recalcular valor
    if (updateData.activeUsers !== undefined) {
      const totalAmount = subscription.basePrice + updateData.activeUsers * subscription.pricePerUser
      updateData.totalAmount = totalAmount
    }

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: updateData,
    })
  }

  async cancel(subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    })

    if (!subscription) {
      throw new NotFoundException("Assinatura não encontrada")
    }

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: SubscriptionStatus.CANCELLED,
        cancelledAt: new Date(),
      },
    })
  }

  async suspend(subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    })

    if (!subscription) {
      throw new NotFoundException("Assinatura não encontrada")
    }

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: SubscriptionStatus.SUSPENDED,
      },
    })
  }

  async reactivate(subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    })

    if (!subscription) {
      throw new NotFoundException("Assinatura não encontrada")
    }

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: SubscriptionStatus.ACTIVE,
      },
    })
  }

  async updateUserCount(companyId: string) {
    const activeUsers = await this.usersService.getActiveSellersByCompany(companyId)

    const subscription = await this.prisma.subscription.findFirst({
      where: {
        companyId,
        status: {
          in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL],
        },
      },
    })

    if (subscription) {
      const totalAmount = subscription.basePrice + activeUsers * subscription.pricePerUser

      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          activeUsers,
          totalAmount,
        },
      })
    }

    return { activeUsers, updated: !!subscription }
  }

  async getByCompany(companyId: string) {
    return this.prisma.subscription.findMany({
      where: { companyId },
      include: {
        company: {
          select: {
            name: true,
            email: true,
          },
        },
        invoices: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async getStats(companyId?: string, agencyId?: string) {
    const where: any = {}

    if (companyId) {
      where.companyId = companyId
    } else if (agencyId) {
      where.company = {
        agencyId,
      }
    }

    const [total, active, trial, cancelled, suspended, revenue] = await Promise.all([
      this.prisma.subscription.count({ where }),
      this.prisma.subscription.count({
        where: { ...where, status: SubscriptionStatus.ACTIVE },
      }),
      this.prisma.subscription.count({
        where: { ...where, status: SubscriptionStatus.TRIAL },
      }),
      this.prisma.subscription.count({
        where: { ...where, status: SubscriptionStatus.CANCELLED },
      }),
      this.prisma.subscription.count({
        where: { ...where, status: SubscriptionStatus.SUSPENDED },
      }),
      this.prisma.subscription.aggregate({
        where: {
          ...where,
          status: {
            in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL],
          },
        },
        _sum: {
          totalAmount: true,
        },
      }),
    ])

    return {
      total,
      active,
      trial,
      cancelled,
      suspended,
      monthlyRevenue: revenue._sum.totalAmount || 0,
    }
  }
}
