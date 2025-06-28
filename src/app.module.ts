import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ThrottlerModule } from "@nestjs/throttler"
import { ScheduleModule } from "@nestjs/schedule"
import { BullModule } from "@nestjs/bull"

import { PrismaModule } from "./prisma/prisma.module"
import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"
import { CompaniesModule } from "./companies/companies.module"
import { AgenciesModule } from "./agencies/agencies.module"
import { WhatsappModule } from "./whatsapp/whatsapp.module"
import { ContactsModule } from "./contacts/contacts.module"
import { ConversationsModule } from "./conversations/conversations.module"
import { MessagesModule } from "./messages/messages.module"
import { TagsModule } from "./tags/tags.module"
import { AutomationModule } from "./automation/automation.module"
import { ReportsModule } from "./reports/reports.module"
import { BillingModule } from "./billing/billing.module"
import { IntegrationsModule } from "./integrations/integrations.module"
import { WebsocketModule } from "./websocket/websocket.module"

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Task scheduling
    ScheduleModule.forRoot(),

    // Queue management
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number.parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),

    // Core modules
    PrismaModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    AgenciesModule,
    WhatsappModule,
    ContactsModule,
    ConversationsModule,
    MessagesModule,
    TagsModule,
    AutomationModule,
    ReportsModule,
    BillingModule,
    IntegrationsModule,
    WebsocketModule,
  ],
})
export class AppModule {}
