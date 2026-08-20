import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { FavoritesService } from "./favorites.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {
  CurrentUser,
  JwtPayload,
} from "../common/decorators/current-user.decorator";

@ApiTags("Favorites")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post("listings/:listingId/favorite")
  @ApiOperation({ summary: "Add listing to favorites" })
  addFavorite(
    @Param("listingId", ParseUUIDPipe) listingId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.favoritesService.addFavorite(user.sub, listingId);
  }

  @Delete("listings/:listingId/favorite")
  @ApiOperation({ summary: "Remove listing from favorites" })
  removeFavorite(
    @Param("listingId", ParseUUIDPipe) listingId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.favoritesService.removeFavorite(user.sub, listingId);
  }

  @Get("users/me/favorites")
  @ApiOperation({ summary: "Get my favorite listings" })
  getMyFavorites(@CurrentUser() user: JwtPayload) {
    return this.favoritesService.getMyFavorites(user.sub);
  }

  @Get("users/me/favorites/ids")
  @ApiOperation({ summary: "Get my favorite listing IDs" })
  getFavoriteIds(@CurrentUser() user: JwtPayload) {
    return this.favoritesService.getFavoriteIds(user.sub);
  }
}
