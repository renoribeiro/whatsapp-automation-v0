import { PartialType } from "@nestjs/swagger"
import { CreateAutomationFlowDto } from "./create-automation-flow.dto"

export class UpdateAutomationFlowDto extends PartialType(CreateAutomationFlowDto) {}
