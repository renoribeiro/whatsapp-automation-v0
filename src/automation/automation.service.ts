import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectQueue } from "@nestjs/bull"
import type { Queue } from "bull"

import type { PrismaService } from "../prisma/prisma.service"
import type { CreateAutomationFlowDto } from "./dto/create-automation-flow.dto"
import type { UpdateAutomationFlowDto } from "./dto/update-automation-flow.dto"
import type { FlowExecutorService } from "./services/flow-executor.service"

@Injectable()
export class AutomationService {
  private automationQueue: Queue

  constructor(
    private prisma: PrismaService,
    private flowExecutorService: FlowExecutorService,
  ) {
    this.automationQueue = InjectQueue("automation")
  }

  async create(createAutomationFlowDto: CreateAutomationFlowDto) {
    const { flowData } = createAutomationFlowDto

    // Validar estrutura do fluxo
    this.validateFlowStructure(flowData)

    return this.prisma.automationFlow.create({
      data: createAutomationFlowDto,
    })
  }

  async findAll(companyId: string) {
    return this.prisma.automationFlow.findMany({
      where: { companyId },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async findOne(id: string) {
    const flow = await this.prisma.automationFlow.findUnique({
      where: { id },
    })

    if (!flow) {
      throw new NotFoundException("Fluxo de automação não encontrado")
    }

    return flow
  }

  async update(id: string, updateAutomationFlowDto: UpdateAutomationFlowDto) {
    await this.findOne(id)

    if (updateAutomationFlowDto.flowData) {
      this.validateFlowStructure(updateAutomationFlowDto.flowData)
    }

    return this.prisma.automationFlow.update({
      where: { id },
      data: updateAutomationFlowDto,
    })
  }

  async remove(id: string) {
    await this.findOne(id)

    return this.prisma.automationFlow.delete({
      where: { id },
    })
  }

  async activate(id: string) {
    await this.findOne(id)

    return this.prisma.automationFlow.update({
      where: { id },
      data: { isActive: true },
    })
  }

  async deactivate(id: string) {
    await this.findOne(id)

    return this.prisma.automationFlow.update({
      where: { id },
      data: { isActive: false },
    })
  }

  async executeFlow(flowId: string, contactId: string, triggerData?: any) {
    const flow = await this.findOne(flowId)

    if (!flow.isActive) {
      throw new BadRequestException("Fluxo de automação está inativo")
    }

    // Adicionar job para execução do fluxo
    await this.automationQueue.add(
      "execute-flow",
      {
        flowId,
        contactId,
        triggerData,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      },
    )

    return { success: true, message: "Fluxo adicionado à fila de execução" }
  }

  async getActiveFlowsByTrigger(companyId: string, triggerType: string) {
    return this.prisma.automationFlow.findMany({
      where: {
        companyId,
        isActive: true,
        flowData: {
          path: ["trigger", "type"],
          equals: triggerType,
        },
      },
    })
  }

  async getFlowExecutionStats(flowId: string) {
    // Implementar estatísticas de execução
    // Por enquanto retorna dados mockados
    return {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      averageExecutionTime: 0,
      lastExecution: null,
    }
  }

  private validateFlowStructure(flowData: any) {
    if (!flowData || typeof flowData !== "object") {
      throw new BadRequestException("Estrutura do fluxo inválida")
    }

    // Validar se tem trigger
    if (!flowData.trigger || !flowData.trigger.type) {
      throw new BadRequestException("Fluxo deve ter um trigger definido")
    }

    // Validar se tem pelo menos uma ação
    if (!flowData.actions || !Array.isArray(flowData.actions) || flowData.actions.length === 0) {
      throw new BadRequestException("Fluxo deve ter pelo menos uma ação")
    }

    // Validar cada ação
    for (const action of flowData.actions) {
      if (!action.type) {
        throw new BadRequestException("Todas as ações devem ter um tipo definido")
      }
    }

    return true
  }
}
