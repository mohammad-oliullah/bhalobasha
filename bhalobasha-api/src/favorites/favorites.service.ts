import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { listingInclude } from "../listings/listings.service";

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async addFavorite(userId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true },
    });

    if (!listing) {
      throw new NotFoundException("Listing not found");
    }

    try {
      return await this.prisma.favoriteListing.create({
        data: {
          userId,
          listingId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("Already in favorites");
      }

      throw error;
    }
  }

  async removeFavorite(userId: string, listingId: string) {
    const favorite = await this.prisma.favoriteListing.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException("Favorite not found");
    }

    return this.prisma.favoriteListing.delete({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });
  }

  async getMyFavorites(userId: string) {
    const favorites = await this.prisma.favoriteListing.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        listing: {
          include: listingInclude,
        },
      },
    });

    return favorites.map(({ listing }) => listing);
  }

  async getFavoriteIds(userId: string): Promise<string[]> {
    const favorites = await this.prisma.favoriteListing.findMany({
      where: { userId },
      select: { listingId: true },
    });

    return favorites.map(({ listingId }) => listingId);
  }

  async isFavorited(userId: string, listingId: string): Promise<boolean> {
    const favorite = await this.prisma.favoriteListing.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
      select: { id: true },
    });

    return !!favorite;
  }
}
