import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectQueue } from "@nestjs/bull"
import type { Queue } from "bull"
import { ConnectionType, ConnectionStatus } from "@prisma/client"

import type { PrismaService } from "../prisma/prisma.service"
import type { EvolutionApiService } from "./services/evolution-api.service"
import type { OfficialApiService } from "./services/official-api.service"
import type { CreateConnectionDto } from "./dto/create-connection.dto"
import type { UpdateConnectionDto } from "./dto/update-connection.dto"

@Injectable()
export class WhatsappService {
  private whatsappQueue: Queue

  constructor(
    private prisma: PrismaService,
    private evolutionApiService: EvolutionApiService,
    private officialApiService: OfficialApiService,
  ) {
    this.whatsappQueue = InjectQueue("whatsapp")
  }

  async createConnection(createConnectionDto: CreateConnectionDto) {
    const { connectionType, companyId, phoneNumber } = createConnectionDto

    // Verificar se o número já está conectado para esta empresa
    const existingConnection = await this.prisma.whatsAppConnection.findUnique({
      where: {
        phoneNumber_companyId: {
          phoneNumber,
          companyId,
        },
      },
    })

    if (existingConnection) {
      throw new BadRequestException("Este número já está conectado para esta empresa")
    }

    let connectionData: any = {
      ...createConnectionDto,
      status: ConnectionStatus.CONNECTING,
    }

    try {
      if (connectionType === ConnectionType.EVOLUTION_API) {
        const evolutionData = await this.evolutionApiService.createInstance(phoneNumber)
        connectionData = {
          ...connectionData,
          instanceId: evolutionData.instanceId,
          qrCode: evolutionData.qrCode,
        }
      } else if (connectionType === ConnectionType.OFFICIAL_API) {
        const officialData = await this.officialApiService.setupConnection(phoneNumber)
        connectionData = {
          ...connectionData,
          accessToken: officialData.accessToken,
          webhookUrl: officialData.webhookUrl,
        }
      }

      const connection = await this.prisma.whatsAppConnection.create({
        data: connectionData,
      })

      // Adicionar job para monitorar status da conexão
      await this.whatsappQueue.add(
        "monitor-connection",
        {
          connectionId: connection.id,
        },
        {
          delay: 5000, // 5 segundos
          attempts: 3,
        },
      )

      return connection
    } catch (error) {
      throw new BadRequestException(`Erro ao criar conexão: ${error.message}`)
    }
  }

  async findAllByCompany(companyId: string) {
    return this.prisma.whatsAppConnection.findMany({
      where: { companyId },
      include: {
        assignedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async findOne(id: string) {
    const connection = await this.prisma.whatsAppConnection.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    if (!connection) {
      throw new NotFoundException("Conexão não encontrada")
    }

    return connection
  }

  async updateConnection(id: string, updateConnectionDto: UpdateConnectionDto) {
    await this.findOne(id)

    return this.prisma.whatsAppConnection.update({
      where: { id },
      data: updateConnectionDto,
    })
  }

  async deleteConnection(id: string) {
    const connection = await this.findOne(id)

    try {
      if (connection.connectionType === ConnectionType.EVOLUTION_API && connection.instanceId) {
        await this.evolutionApiService.deleteInstance(connection.instanceId)
      }

      return this.prisma.whatsAppConnection.delete({
        where: { id },
      })
    } catch (error) {
      throw new BadRequestException(`Erro ao deletar conexão: ${error.message}`)
    }
  }

  async getQrCode(id: string) {
    const connection = await this.findOne(id)

    if (connection.connectionType !== ConnectionType.EVOLUTION_API) {
      throw new BadRequestException("QR Code disponível apenas para conexões Evolution API")
    }

    if (!connection.instanceId) {
      throw new BadRequestException("Instance ID não encontrado")
    }

    try {
      const qrCode = await this.evolutionApiService.getQrCode(connection.instanceId)

      // Atualizar QR Code no banco
      await this.prisma.whatsAppConnection.update({
        where: { id },
        data: { qrCode },
      })

      return { qrCode }
    } catch (error) {
      throw new BadRequestException(`Erro ao obter QR Code: ${error.message}`)
    }
  }

  async checkConnectionStatus(id: string) {
    const connection = await this.findOne(id)

    try {
      let status: ConnectionStatus

      if (connection.connectionType === ConnectionType.EVOLUTION_API) {
        status = await this.evolutionApiService.getInstanceStatus(connection.instanceId)
      } else {
        status = await this.officialApiService.getConnectionStatus(connection.accessToken)
      }

      // Atualizar status no banco
      await this.prisma.whatsAppConnection.update({
        where: { id },
        data: { status },
      })

      return { status }
    } catch (error) {
      await this.prisma.whatsAppConnection.update({
        where: { id },
        data: { status: ConnectionStatus.ERROR },
      })

      throw new BadRequestException(`Erro ao verificar status: ${error.message}`)
    }
  }

  async assignUserToConnection(connectionId: string, userId: string) {
    const connection = await this.findOne(connectionId)

    // Verificar se o usuário existe e pertence à mesma empresa
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        companyId: connection.companyId,
        isActive: true,
      },
    })

    if (!user) {
      throw new NotFoundException("Usuário não encontrado ou não pertence a esta empresa")
    }

    return this.prisma.whatsAppConnection.update({
      where: { id: connectionId },
      data: { assignedUserId: userId },
      include: {
        assignedUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })
  }

  async getConnectionsByUser(userId: string) {
    return this.prisma.whatsAppConnection.findMany({
      where: {
        assignedUserId: userId,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }
}
