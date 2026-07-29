import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBidDto } from "./dto/create-bid.dto";
import { BidStatus, ListingStatus } from "@prisma/client";

@Injectable()
export class BidsService {
  constructor(private prisma: PrismaService) {}

  // Seeker places a bid on a listing
  async placeBid(listingId: string, seekerId: string, dto: CreateBidDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) throw new NotFoundException("Listing not found");

    // Cannot bid on your own listing
    if (listing.ownerId === seekerId)
      throw new BadRequestException("You cannot bid on your own listing");

    // Listing must be active and bidding enabled
    if (listing.status !== ListingStatus.ACTIVE)
      throw new BadRequestException("This listing is no longer active");

    if (!listing.isBiddingEnabled)
      throw new BadRequestException("This listing does not accept bids");

    // Check bidding deadline
    if (listing.biddingDeadline && new Date() > listing.biddingDeadline)
      throw new BadRequestException(
        "Bidding deadline has passed for this listing",
      );

    // Minimum bid check
    if (listing.minimumBid && dto.amount < listing.minimumBid)
      throw new BadRequestException(
        `Bid must be at least ৳${listing.minimumBid}`,
      );

    // Check if seeker already has an active bid on this listing
    const existingBid = await this.prisma.bid.findUnique({
      where: {
        listingId_seekerId: { listingId, seekerId },
      },
    });

    if (existingBid) {
      if (existingBid.status === BidStatus.PENDING) {
        throw new BadRequestException(
          "You already have an active bid on this listing. Withdraw it first to place a new one.",
        );
      }
    }

    // If previously rejected/withdrawn, allow a new bid by updating
    if (
      existingBid?.status === BidStatus.REJECTED ||
      existingBid?.status === BidStatus.WITHDRAWN
    ) {
      return this.prisma.bid.update({
        where: { id: existingBid.id },
        data: {
          amount: dto.amount,
          message: dto.message,
          status: BidStatus.PENDING,
          expiresAt: listing.biddingDeadline ?? null,
          updatedAt: new Date(),
        },
        include: { seeker: { select: { id: true, name: true, phone: true } } },
      });
    }
  }
}
