import { Module } from "@nestjs/common"
import { BullModule } from "@nestjs/bull"
import { MessagesService } from "./messages.service"
import { MessagesController } from "./messages.controller"
import { MessageProcessor } from "./processors/message.processor"

@Module({
  imports: [
    BullModule.registerQueue({
      name: "messages",
    }),
  ],
  providers: [MessagesService, MessageProcessor],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
