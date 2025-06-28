import { Module } from "@nestjs/common"
import { IntegrationsService } from "./integrations.service"
import { IntegrationsController } from "./integrations.controller"
import { GoogleSheetsService } from "./services/google-sheets.service"
import { WebhookService } from "./services/webhook.service"
import { OpenAIService } from "./services/openai.service"

@Module({
  providers: [IntegrationsService, GoogleSheetsService, WebhookService, OpenAIService],
  controllers: [IntegrationsController],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
