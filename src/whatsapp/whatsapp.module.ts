import { Module } from "@nestjs/common"
import { BullModule } from "@nestjs/bull"
import { WhatsappService } from "./whatsapp.service"
import { WhatsappController } from "./whatsapp.controller"
import { EvolutionApiService } from "./services/evolution-api.service"
import { OfficialApiService } from "./services/official-api.service"
import { WhatsappProcessor } from "./processors/whatsapp.processor"

@Module({
  imports: [
    BullModule.registerQueue({
      name: "whatsapp",
    }),
  ],
  providers: [WhatsappService, EvolutionApiService, OfficialApiService, WhatsappProcessor],
  controllers: [WhatsappController],
  exports: [WhatsappService],
})
export class WhatsappModule {}
