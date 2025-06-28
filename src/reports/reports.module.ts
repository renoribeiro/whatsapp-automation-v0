import { Module } from "@nestjs/common"
import { BullModule } from "@nestjs/bull"
import { ReportsService } from "./reports.service"
import { ReportsController } from "./reports.controller"
import { ReportGeneratorService } from "./services/report-generator.service"
import { ReportProcessor } from "./processors/report.processor"

@Module({
  imports: [
    BullModule.registerQueue({
      name: "reports",
    }),
  ],
  providers: [ReportsService, ReportGeneratorService, ReportProcessor],
  controllers: [ReportsController],
  exports: [ReportsService],
})
export class ReportsModule {}
