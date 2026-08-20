import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ListingsModule } from "./listings/listings.module";
import { LocationsModule } from "./locations/locations.module";
import { MediaModule } from "./media/media.module";
import { BidsService } from "./bids/bids.service";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { BidsModule } from "./bids/bids.module";
import { HealthController } from "./health/health.controller";
import { FavoritesModule } from "./favorites/favorites.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests/minute per IP
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ListingsModule,
    LocationsModule,
    MediaModule,
    BidsModule,
    FavoritesModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    BidsService,
  ],
})
export class AppModule {}
