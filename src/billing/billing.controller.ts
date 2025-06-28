import { Controller, Get, Post, Patch, Param, UseGuards, Request, Query } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"

import type { BillingService } from "./billing.service"
import type { CreateSubscriptionDto } from "./dto/create-subscription.dto"
import type { ProcessPaymentDto } from "./dto/process-payment.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"

@ApiTags("Billing")
@Controller("billing")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post("subscriptions")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN)
  @ApiOperation({ summary: "Criar nova assinatura" })
  @ApiResponse({ status: 201, description: "Assinatura criada com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    return this.billingService.createSubscription(createSubscriptionDto.companyId, createSubscriptionDto)
  }

  @Post("invoices/:id/pay")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Processar pagamento de fatura" })
  @ApiResponse({ status: 200, description: "Pagamento processado com sucesso" })
  @ApiResponse({ status: 404, description: "Fatura não encontrada" })
  processPayment(@Param("id") invoiceId: string, processPaymentDto: ProcessPaymentDto) {
    return this.billingService.processPayment(invoiceId, processPaymentDto)
  }

  @Get("dashboard")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Dashboard de faturamento" })
  @ApiResponse({ status: 200, description: "Dashboard de faturamento" })
  getDashboard(@Request() req, @Query("companyId") companyId?: string, @Query("agencyId") agencyId?: string) {
    // Se for admin da empresa, só pode ver dashboard da própria empresa
    if (req.user.role === UserRole.COMPANY_ADMIN) {
      companyId = req.user.companyId
    }

    // Se for admin da agência, só pode ver dashboard da própria agência
    if (req.user.role === UserRole.AGENCY_ADMIN) {
      agencyId = req.user.agencyId
    }

    return this.billingService.getBillingDashboard(companyId, agencyId)
  }

  @Patch("subscriptions/:id/cancel")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN, UserRole.COMPANY_ADMIN)
  @ApiOperation({ summary: "Cancelar assinatura" })
  @ApiResponse({ status: 200, description: "Assinatura cancelada com sucesso" })
  cancelSubscription(@Param("id") subscriptionId: string) {
    return this.billingService.cancelSubscription(subscriptionId)
  }

  @Post("invoices/generate/:subscriptionId")
  @Roles(UserRole.SUPER_ADMIN, UserRole.AGENCY_ADMIN)
  @ApiOperation({ summary: "Gerar fatura manualmente" })
  @ApiResponse({ status: 201, description: "Fatura gerada com sucesso" })
  generateInvoice(@Param("subscriptionId") subscriptionId: string) {
    return this.billingService.generateInvoice(subscriptionId)
  }

  @Post("commissions/calculate/:invoiceId")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: "Calcular comissões" })
  @ApiResponse({ status: 200, description: "Comissões calculadas com sucesso" })
  calculateCommissions(@Param("invoiceId") invoiceId: string) {
    return this.billingService.calculateCommissions(invoiceId)
  }
}
