import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { ListingsService } from "./listings.service";
import { CreateListingDto } from "./dto/create-listing.dto";
import { UpdateListingDto } from "./dto/update-listing.dto";
import { FilterListingDto } from "./dto/filter-listing.dto";
import { AddPhotosDto } from "./dto/add-photos.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import {
  CurrentUser,
  JwtPayload,
} from "../common/decorators/current-user.decorator";

@ApiTags("Listings")
@Controller("listings")
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @ApiOperation({ summary: "List listings with optional filters" })
  findAll(@Query() filters: FilterListingDto) {
    return this.listingsService.findAll(filters);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single listing by ID" })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.listingsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @UseGuards(JwtAuthGuard)
  // @Roles(UserRole.SEEKER, UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: "Create a new listing" })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateListingDto) {
    return this.listingsService.create(user.sub, user.role as UserRole, dto);
  }

  @Patch(":id/photos/:photoId/primary")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Set a photo as the primary listing image" })
  setPrimaryPhoto(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("photoId", ParseUUIDPipe) photoId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.listingsService.setPrimaryPhoto(
      id,
      photoId,
      user.sub,
      user.role as UserRole,
    );
  }

  @Patch(":id/photos")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Add more photos to an existing listing" })
  addPhotos(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: AddPhotosDto,
  ) {
    return this.listingsService.addPhotosToListing(
      id,
      user.sub,
      user.role as UserRole,
      dto.urls,
    );
  }

  @Patch(":id/mark-filled")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Mark listing as filled" })
  markFilled(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.listingsService.markFilled(id, user.sub, user.role as UserRole);
  }

  @Patch(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Update own listing" })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateListingDto,
  ) {
    return this.listingsService.update(
      id,
      user.sub,
      user.role as UserRole,
      dto,
    );
  }

  @Delete(":id")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Soft delete listing (set status to EXPIRED)" })
  remove(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.listingsService.softDelete(id, user.sub, user.role as UserRole);
  }
}
