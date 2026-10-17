import { Module } from '@nestjs/common';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthModule } from '../auth/auth.module';
import { SavedSearchesModule } from '../saved-searches/saved-searches.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [AuthModule, SavedSearchesModule, SubscriptionsModule],
  controllers: [ListingsController],
  providers: [ListingsService, RolesGuard],
})
export class ListingsModule {}
