import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUser, JwtPayload } from "../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {
  CreateSavedSearchDto,
  UpdateSavedSearchDto,
} from "./dto/create-saved-search.dto";
import { SavedSearchesService } from "./saved-searches.service";

@ApiTags("Saved searches")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("saved-searches")
export class SavedSearchesController {
  constructor(private readonly savedSearchesService: SavedSearchesService) {}

  @Get()
  @ApiOperation({ summary: "List the current user's saved searches" })
  findMine(@CurrentUser() user: JwtPayload) {
    return this.savedSearchesService.findMine(user.sub);
  }

  @Post()
  @ApiOperation({ summary: "Save a search and enable email alerts" })
  create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateSavedSearchDto,
  ) {
    return this.savedSearchesService.create(user.sub, dto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Enable or disable email alerts for a search" })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateSavedSearchDto,
  ) {
    return this.savedSearchesService.updateAlerts(id, user.sub, dto.alertsEnabled);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a saved search" })
  remove(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.savedSearchesService.remove(id, user.sub);
  }
}
