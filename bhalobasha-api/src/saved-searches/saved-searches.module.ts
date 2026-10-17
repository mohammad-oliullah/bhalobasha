import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { EmailService } from "../common/services/email.service";
import { SavedSearchesController } from "./saved-searches.controller";
import { SavedSearchesService } from "./saved-searches.service";

@Module({
  imports: [AuthModule],
  controllers: [SavedSearchesController],
  providers: [SavedSearchesService, EmailService],
  exports: [SavedSearchesService],
})
export class SavedSearchesModule {}
