import { Processor, Process } from "@nestjs/bull"
import { Logger } from "@nestjs/common"
import type { Job } from "bull"

import type { FlowExecutorService } from "../services/flow-executor.service"

@Processor("automation")
export class AutomationProcessor {
  private readonly logger = new Logger(AutomationProcessor.name)

  constructor(private flowExecutorService: FlowExecutorService) {}

  @Process("execute-flow")
  async handleExecuteFlow(job: Job) {
    const { flowId, contactId, triggerData } = job.data

    try {
      await this.flowExecutorService.executeFlow(flowId, contactId, triggerData)
      this.logger.log(`Flow ${flowId} executed successfully for contact ${contactId}`)
    } catch (error) {
      this.logger.error(`Error executing flow ${flowId} for contact ${contactId}: ${error.message}`)
      throw error
    }
  }
}
