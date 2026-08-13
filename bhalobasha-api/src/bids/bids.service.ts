import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
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

    if (!listing) {
      throw new NotFoundException("Listing not found");
    }

    // Cannot bid on your own listing
    if (listing.ownerId === seekerId) {
      throw new BadRequestException("You cannot bid on your own listing");
    }

    // Listing must be active and bidding enabled
    if (listing.status !== ListingStatus.ACTIVE) {
      throw new BadRequestException("This listing is no longer active");
    }

    if (!listing.isBiddingEnabled) {
      throw new BadRequestException("This listing does not accept bids");
    }

    // Check bidding deadline
    if (listing.biddingDeadline && new Date() > listing.biddingDeadline) {
      throw new BadRequestException(
        "Bidding deadline has passed for this listing",
      );
    }

    // Minimum bid check
    if (listing.minimumBid && dto.amount < listing.minimumBid) {
      throw new BadRequestException(
        `Bid must be at least ৳${listing.minimumBid}`,
      );
    }

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

      // If previously rejected/withdrawn, allow a new bid by updating
      if (
        existingBid.status === BidStatus.REJECTED ||
        existingBid.status === BidStatus.WITHDRAWN
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
          include: {
            seeker: { select: { id: true, name: true, phone: true } },
          },
        });
      }
    }

    // Create new bid
    return this.prisma.bid.create({
      data: {
        amount: dto.amount,
        message: dto.message ?? null,
        listingId,
        seekerId,
        expiresAt: listing.biddingDeadline ?? null,
      },
      include: {
        seeker: { select: { id: true, name: true, phone: true } },
      },
    });
  }

  // Owner gets all bids on their listing
  async getBidsForListing(listingId: string, ownerId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) throw new NotFoundException("Listing not found");

    if (listing.ownerId !== ownerId) {
      throw new ForbiddenException("You do not own this listing");
    }

    const bids = await this.prisma.bid.findMany({
      where: { listingId },
      orderBy: { amount: "desc" }, // highest bid first
      include: {
        seeker: {
          select: { id: true, name: true, phone: true, profilePhoto: true },
        },
      },
    });

    // Attach highest bid amount as meta
    const highestBid = bids.find((b) => b.status === BidStatus.PENDING);

    return {
      bids,
      totalBids: bids.length,
      highestBid: highestBid?.amount ?? null,
    };
  }

  // Public: pending bids without contact info (for listing detail page)
  async getPublicBidsForListing(listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) throw new NotFoundException("Listing not found");
    if (!listing.isBiddingEnabled) {
      return { bids: [], totalBids: 0, highestBid: null };
    }

    const bids = await this.prisma.bid.findMany({
      where: { listingId, status: BidStatus.PENDING },
      orderBy: { amount: "desc" },
      select: {
        id: true,
        amount: true,
        message: true,
        createdAt: true,
        seeker: { select: { name: true } },
      },
    });

    return {
      bids,
      totalBids: bids.length,
      highestBid: bids[0]?.amount ?? null,
    };
  }

  // Public: get bid summary for a listing (no seeker details exposed)
  async getBidSummaryForListing(listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) throw new NotFoundException("Listing not found");
    if (!listing.isBiddingEnabled) {
      return { isBiddingEnabled: false };
    }

    const bids = await this.prisma.bid.findMany({
      where: { listingId, status: BidStatus.PENDING },
      orderBy: { amount: "desc" },
    });

    return {
      isBiddingEnabled: true,
      minimumBid: listing.minimumBid,
      biddingDeadline: listing.biddingDeadline,
      totalBids: bids.length,
      highestBid: bids[0]?.amount ?? null,
    };
  }

  // Owner accepts a bid → auto-reject all others → mark listing FILLED
  async acceptBid(bidId: string, ownerId: string) {
    const bid = await this.prisma.bid.findUnique({
      where: { id: bidId },
      include: { listing: true },
    });

    if (!bid) throw new NotFoundException("Bid not found");

    if (bid.listing.ownerId !== ownerId) {
      throw new ForbiddenException("You do not own this listing");
    }

    if (bid.status !== BidStatus.PENDING) {
      throw new BadRequestException("Only pending bids can be accepted");
    }

    // Run in a transaction: accept this bid, reject others, fill listing
    return this.prisma.$transaction(async (tx) => {
      // Accept the selected bid
      const acceptedBid = await tx.bid.update({
        where: { id: bidId },
        data: { status: BidStatus.ACCEPTED },
        include: {
          seeker: { select: { id: true, name: true, phone: true } },
        },
      });

      // Reject all other PENDING bids on this listing
      await tx.bid.updateMany({
        where: {
          listingId: bid.listingId,
          id: { not: bidId },
          status: BidStatus.PENDING,
        },
        data: { status: BidStatus.REJECTED },
      });

      // Mark listing as FILLED
      await tx.listing.update({
        where: { id: bid.listingId },
        data: { status: ListingStatus.FILLED },
      });

      return acceptedBid;
    });
  }

  // Owner rejects a single bid
  async rejectBid(bidId: string, ownerId: string) {
    const bid = await this.prisma.bid.findUnique({
      where: { id: bidId },
      include: { listing: true },
    });

    if (!bid) throw new NotFoundException("Bid not found");

    if (bid.listing.ownerId !== ownerId) {
      throw new ForbiddenException("You do not own this listing");
    }

    if (bid.status !== BidStatus.PENDING) {
      throw new BadRequestException("Only pending bids can be rejected");
    }

    return this.prisma.bid.update({
      where: { id: bidId },
      data: { status: BidStatus.REJECTED },
    });
  }

  // Seeker withdraws their own bid
  async withdrawBid(bidId: string, seekerId: string) {
    const bid = await this.prisma.bid.findUnique({
      where: { id: bidId },
    });

    if (!bid) throw new NotFoundException("Bid not found");

    if (bid.seekerId !== seekerId) {
      throw new ForbiddenException("This is not your bid");
    }

    if (bid.status !== BidStatus.PENDING) {
      throw new BadRequestException("Only pending bids can be withdrawn");
    }

    return this.prisma.bid.update({
      where: { id: bidId },
      data: { status: BidStatus.WITHDRAWN },
    });
  }

  // Seeker sees all their own bids across all listings
  async getMyBids(seekerId: string) {
    return this.prisma.bid.findMany({
      where: { seekerId },
      orderBy: { createdAt: "desc" },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            type: true,
            rent: true,
            status: true,
            isBiddingEnabled: true,
            biddingDeadline: true,
            area: {
              select: {
                name: true,
                thana: { select: { name: true } },
              },
            },
            photos: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
    });
  }

  // Expire bids past their deadline (call this from a cron job later)
  async expireOverdueBids() {
    const result = await this.prisma.bid.updateMany({
      where: {
        status: BidStatus.PENDING,
        expiresAt: { lt: new Date() },
      },
      data: { status: BidStatus.EXPIRED },
    });

    return { expired: result.count };
  }

  // Seeker reactivates their own withdrawn bid
  async reactivateBid(bidId: string, seekerId: string) {
    const bid = await this.prisma.bid.findUnique({
      where: { id: bidId },
      include: { listing: true },
    });

    if (!bid) throw new NotFoundException("Bid not found");

    if (bid.seekerId !== seekerId) {
      throw new ForbiddenException("This is not your bid");
    }

    if (bid.status !== BidStatus.WITHDRAWN) {
      throw new BadRequestException("Only withdrawn bids can be reactivated");
    }

    // Check listing is still active and bidding still open
    if (bid.listing.status !== ListingStatus.ACTIVE) {
      throw new BadRequestException("This listing is no longer active");
    }

    if (!bid.listing.isBiddingEnabled) {
      throw new BadRequestException(
        "Bidding is no longer enabled on this listing",
      );
    }

    if (
      bid.listing.biddingDeadline &&
      new Date() > bid.listing.biddingDeadline
    ) {
      throw new BadRequestException("Bidding deadline has passed");
    }

    return this.prisma.bid.update({
      where: { id: bidId },
      data: { status: BidStatus.PENDING },
      include: {
        seeker: { select: { id: true, name: true, phone: true } },
      },
    });
  }
}
