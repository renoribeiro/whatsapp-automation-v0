import { Processor, Process } from "@nestjs/bull"
import { Logger } from "@nestjs/common"
import type { Job } from "bull"

import type { SubscriptionService } from "../services/subscription.service"
import type { InvoiceService } from "../services/invoice.service"

@Processor("billing")
export class BillingProcessor {
  private readonly logger = new Logger(BillingProcessor.name)

  constructor(
    private subscriptionService: SubscriptionService,
    private invoiceService: InvoiceService,
  ) {}

  @Process("process-trial-end")
  async handleTrialEnd(job: Job) {
    const { subscriptionId } = job.data

    try {
      // Gerar primeira fatura
      const invoice = await this.invoiceService.generate(subscriptionId)

      // Atualizar status da assinatura
      await this.subscriptionService.update(subscriptionId, {
        status: "ACTIVE",
      })

      this.logger.log(`Trial ended and invoice generated for subscription ${subscriptionId}`)

      return { invoiceId: invoice.id }
    } catch (error) {
      this.logger.error(`Error processing trial end for subscription ${subscriptionId}: ${error.message}`)
      throw error
    }
  }

  @Process("generate-monthly-invoices")
  async handleMonthlyInvoices(job: Job) {
    try {
      // Buscar todas as assinaturas ativas que precisam de fatura
      // Implementar lógica de geração mensal
      this.logger.log("Monthly invoices generation started")
    } catch (error) {
      this.logger.error(`Error generating monthly invoices: ${error.message}`)
      throw error
    }
  }
}
