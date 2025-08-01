import { Injectable, type OnModuleInit, type OnModuleDestroy, Logger } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name)

  constructor() {
    super({
      log: ["query", "info", "warn", "error"],
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
    this.logger.log("Disconnected from database")
  }

  async enableShutdownHooks(app: any) {
    this.$on("beforeExit", async () => {
      await app.close()
    })
  }
}
