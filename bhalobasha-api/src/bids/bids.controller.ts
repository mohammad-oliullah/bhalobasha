import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { BidsService } from "./bids.service";
import { CreateBidDto } from "./dto/create-bid.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Public } from "../common/decorators/public.decorator";
import {
  CurrentUser,
  JwtPayload,
} from "../common/decorators/current-user.decorator";

@ApiTags("Bids")
@Controller()
@UseGuards(JwtAuthGuard)
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post("listings/:listingId/bids")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Place a bid on a listing (seeker)" })
  placeBid(
    @Param("listingId") listingId: string,
    @Body() dto: CreateBidDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.bidsService.placeBid(listingId, user.sub, dto);
  }

  @Get("listings/:listingId/bids")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all bids for a listing (owner only)" })
  getBidsForListing(
    @Param("listingId") listingId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.bidsService.getBidsForListing(listingId, user.sub);
  }

  @Public()
  @Get("listings/:listingId/bids/public")
  @ApiOperation({
    summary: "Get public bid list for a listing (no contact info)",
  })
  getPublicBids(@Param("listingId") listingId: string) {
    return this.bidsService.getPublicBidsForListing(listingId);
  }

  @Public()
  @Get("listings/:listingId/bids/summary")
  @ApiOperation({ summary: "Get public bid summary for a listing" })
  getBidSummary(@Param("listingId") listingId: string) {
    return this.bidsService.getBidSummaryForListing(listingId);
  }

  @Patch("bids/:bidId/accept")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Accept a bid (owner only)" })
  acceptBid(@Param("bidId") bidId: string, @CurrentUser() user: JwtPayload) {
    return this.bidsService.acceptBid(bidId, user.sub);
  }

  @Patch("bids/:bidId/reject")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Reject a bid (owner only)" })
  rejectBid(@Param("bidId") bidId: string, @CurrentUser() user: JwtPayload) {
    return this.bidsService.rejectBid(bidId, user.sub);
  }

  @Delete("bids/:bidId")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Withdraw your own bid (seeker)" })
  withdrawBid(@Param("bidId") bidId: string, @CurrentUser() user: JwtPayload) {
    return this.bidsService.withdrawBid(bidId, user.sub);
  }

  @Get("users/me/bids")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all my bids (seeker)" })
  getMyBids(@CurrentUser() user: JwtPayload) {
    return this.bidsService.getMyBids(user.sub);
  }

  // Seeker reactivates their own withdrawn bid
  @Patch("bids/:bidId/reactivate")
  @ApiOperation({ summary: "Reactivate a withdrawn bid (seeker)" })
  reactivateBid(
    @Param("bidId") bidId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.bidsService.reactivateBid(bidId, user.sub);
  }
}
