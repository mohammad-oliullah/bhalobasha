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
import {
  CurrentUser,
  JwtPayload,
} from "../common/decorators/current-user.decorator";

@ApiTags("Bids")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("bids")
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  // Seeker places a bid on a listing
  @Post("listings/:listingId/bids")
  @ApiOperation({ summary: "Place a bid on a listing (seeker)" })
  placeBid(
    @Param("listingId") listingId: string,
    @Body() dto: CreateBidDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.bidsService.placeBid(listingId, user.sub, dto);
  }

  // Owner views all bids on their listing
  @Get("listings/:listingId/bids")
  @ApiOperation({ summary: "Get all bids for a listing (owner only)" })
  getBidsForListing(
    @Param("listingId") listingId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.bidsService.getBidsForListing(listingId, user.sub);
  }

  // Public summary (total bids + highest bid, no seeker details)
  @Get("listings/:listingId/bids/summary")
  @ApiOperation({ summary: "Get public bid summary for a listing" })
  getBidSummary(@Param("listingId") listingId: string) {
    return this.bidsService.getBidSummaryForListing(listingId);
  }

  // Owner accepts a bid
  @Patch("bids/:bidId/accept")
  @ApiOperation({ summary: "Accept a bid (owner only)" })
  acceptBid(@Param("bidId") bidId: string, @CurrentUser() user: JwtPayload) {
    return this.bidsService.acceptBid(bidId, user.sub);
  }

  // Owner rejects a bid
  @Patch("bids/:bidId/reject")
  @ApiOperation({ summary: "Reject a bid (owner only)" })
  rejectBid(@Param("bidId") bidId: string, @CurrentUser() user: JwtPayload) {
    return this.bidsService.rejectBid(bidId, user.sub);
  }

  // Seeker withdraws their own bid
  @Delete("bids/:bidId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Withdraw your own bid (seeker)" })
  withdrawBid(@Param("bidId") bidId: string, @CurrentUser() user: JwtPayload) {
    return this.bidsService.withdrawBid(bidId, user.sub);
  }

  // Seeker views all their bids
  @Get("users/me/bids")
  @ApiOperation({ summary: "Get all my bids (seeker)" })
  getMyBids(@CurrentUser() user: JwtPayload) {
    return this.bidsService.getMyBids(user.sub);
  }
}
