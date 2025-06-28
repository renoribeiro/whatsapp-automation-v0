import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
} from "@nestjs/websockets"
import { Logger } from "@nestjs/common"
import type { Server, Socket } from "socket.io"
import type { JwtService } from "@nestjs/jwt"
import type { ConfigService } from "@nestjs/config"

import type { PrismaService } from "../prisma/prisma.service"

interface AuthenticatedSocket extends Socket {
  userId?: string
  companyId?: string
  role?: string
}

@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
  namespace: "/chat",
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private readonly logger = new Logger(WebsocketGateway.name)
  private connectedUsers = new Map<string, string>() // userId -> socketId

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(" ")[1]

      if (!token) {
        client.disconnect()
        return
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get("JWT_SECRET"),
      })

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          role: true,
          companyId: true,
          isActive: true,
        },
      })

      if (!user || !user.isActive) {
        client.disconnect()
        return
      }

      client.userId = user.id
      client.companyId = user.companyId
      client.role = user.role

      this.connectedUsers.set(user.id, client.id)

      // Entrar na sala da empresa
      if (user.companyId) {
        client.join(`company:${user.companyId}`)
      }

      // Entrar na sala do usuário
      client.join(`user:${user.id}`)

      this.logger.log(`User ${user.id} connected to chat`)

      // Notificar outros usuários da empresa que o usuário está online
      if (user.companyId) {
        client.to(`company:${user.companyId}`).emit("user:online", {
          userId: user.id,
          timestamp: new Date(),
        })
      }
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`)
      client.disconnect()
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId)

      // Notificar outros usuários da empresa que o usuário está offline
      if (client.companyId) {
        client.to(`company:${client.companyId}`).emit("user:offline", {
          userId: client.userId,
          timestamp: new Date(),
        })
      }

      this.logger.log(`User ${client.userId} disconnected from chat`)
    }
  }

  @SubscribeMessage("conversation:join")
  async handleJoinConversation(client: AuthenticatedSocket, data: { conversationId: string }) {
    try {
      const { conversationId } = data

      // Verificar se o usuário tem acesso à conversa
      const conversation = await this.prisma.conversation.findFirst({
        where: {
          id: conversationId,
          OR: [{ companyId: client.companyId }, { assignedUserId: client.userId }],
        },
      })

      if (!conversation) {
        client.emit("error", { message: "Conversa não encontrada ou sem permissão" })
        return
      }

      client.join(`conversation:${conversationId}`)
      client.emit("conversation:joined", { conversationId })

      this.logger.log(`User ${client.userId} joined conversation ${conversationId}`)
    } catch (error) {
      this.logger.error(`Error joining conversation: ${error.message}`)
      client.emit("error", { message: "Erro ao entrar na conversa" })
    }
  }

  @SubscribeMessage("conversation:leave")
  handleLeaveConversation(client: AuthenticatedSocket, data: { conversationId: string }) {
    const { conversationId } = data
    client.leave(`conversation:${conversationId}`)
    client.emit("conversation:left", { conversationId })

    this.logger.log(`User ${client.userId} left conversation ${conversationId}`)
  }

  @SubscribeMessage("message:typing")
  handleTyping(client: AuthenticatedSocket, data: { conversationId: string; isTyping: boolean }) {
    const { conversationId, isTyping } = data

    client.to(`conversation:${conversationId}`).emit("message:typing", {
      userId: client.userId,
      conversationId,
      isTyping,
      timestamp: new Date(),
    })
  }

  @SubscribeMessage("message:read")
  async handleMessageRead(client: AuthenticatedSocket, data: { messageId: string; conversationId: string }) {
    try {
      const { messageId, conversationId } = data

      // Marcar mensagem como lida no banco
      await this.prisma.message.update({
        where: { id: messageId },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      })

      // Notificar outros participantes da conversa
      client.to(`conversation:${conversationId}`).emit("message:read", {
        messageId,
        conversationId,
        readBy: client.userId,
        timestamp: new Date(),
      })
    } catch (error) {
      this.logger.error(`Error marking message as read: ${error.message}`)
    }
  }

  // Métodos para emitir eventos do servidor
  emitNewMessage(conversationId: string, message: any) {
    this.server.to(`conversation:${conversationId}`).emit("message:new", message)
  }

  emitMessageUpdate(conversationId: string, message: any) {
    this.server.to(`conversation:${conversationId}`).emit("message:updated", message)
  }

  emitConversationUpdate(companyId: string, conversation: any) {
    this.server.to(`company:${companyId}`).emit("conversation:updated", conversation)
  }

  emitUserAssigned(conversationId: string, assignment: any) {
    this.server.to(`conversation:${conversationId}`).emit("conversation:assigned", assignment)
  }

  notifyUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data)
  }

  notifyCompany(companyId: string, event: string, data: any) {
    this.server.to(`company:${companyId}`).emit(event, data)
  }

  getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers.keys())
  }

  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId)
  }
}
