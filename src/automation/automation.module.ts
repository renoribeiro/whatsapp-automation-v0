import { Module } from "@nestjs/common"
import { BullModule } from "@nestjs/bull"
import { AutomationService } from "./automation.service"
import { AutomationController } from "./automation.controller"
import { FlowExecutorService } from "./services/flow-executor.service"
import { TriggerService } from "./services/trigger.service"
import { AutomationProcessor } from "./processors/automation.processor"

@Module({
  imports: [
    BullModule.registerQueue({
      name: "automation",
    }),
  ],
  providers: [AutomationService, FlowExecutorService, TriggerService, AutomationProcessor],
  controllers: [AutomationController],
  exports: [AutomationService, FlowExecutorService, TriggerService],
})
export class AutomationModule {}
