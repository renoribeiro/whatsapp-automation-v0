import { Module } from "@nestjs/common"
import { BullModule } from "@nestjs/bull"
import { BillingService } from "./billing.service"
import { BillingController } from "./billing.controller"
import { SubscriptionService } from "./services/subscription.service"
import { InvoiceService } from "./services/invoice.service"
import { CommissionService } from "./services/commission.service"
import { BillingProcessor } from "./processors/billing.processor"

@Module({
  imports: [
    BullModule.registerQueue({
      name: "billing",
    }),
  ],
  providers: [BillingService, SubscriptionService, InvoiceService, CommissionService, BillingProcessor],
  controllers: [BillingController],
  exports: [BillingService, SubscriptionService],
})
export class BillingModule {}
