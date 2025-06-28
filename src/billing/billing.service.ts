import { Injectable } from "@nestjs/common"
import type { SubscriptionService } from "./services/subscription.service"
import type { InvoiceService } from "./services/invoice.service"
import type { CommissionService } from "./services/commission.service"

@Injectable()
export class BillingService {
  constructor(
    private subscriptionService: SubscriptionService,
    private invoiceService: InvoiceService,
    private commissionService: CommissionService,
  ) {}

  // Delegação para os serviços específicos
  async createSubscription(companyId: string, planData: any) {
    return this.subscriptionService.create(companyId, planData)
  }

  async updateSubscription(subscriptionId: string, updateData: any) {
    return this.subscriptionService.update(subscriptionId, updateData)
  }

  async cancelSubscription(subscriptionId: string) {
    return this.subscriptionService.cancel(subscriptionId)
  }

  async generateInvoice(subscriptionId: string) {
    return this.invoiceService.generate(subscriptionId)
  }

  async processPayment(invoiceId: string, paymentData: any) {
    return this.invoiceService.processPayment(invoiceId, paymentData)
  }

  async calculateCommissions(invoiceId: string) {
    return this.commissionService.calculate(invoiceId)
  }

  async getBillingDashboard(companyId?: string, agencyId?: string) {
    const [subscriptions, invoices, commissions] = await Promise.all([
      this.subscriptionService.getStats(companyId, agencyId),
      this.invoiceService.getStats(companyId, agencyId),
      this.commissionService.getStats(agencyId),
    ])

    return {
      subscriptions,
      invoices,
      commissions,
    }
  }
}
