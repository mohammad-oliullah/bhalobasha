import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ListingStatus, Prisma, UserRole } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateListingDto, MAX_LISTING_PHOTOS } from "./dto/create-listing.dto";
import { UpdateListingDto } from "./dto/update-listing.dto";
import { FilterListingDto } from "./dto/filter-listing.dto";

export const listingInclude = {
  photos: true,
  village: {
    include: {
      area: {
        include: {
          upazila: {
            include: {
              district: {
                include: {
                  division: true,
                },
              },
            },
          },
        },
      },
    },
  },

  owner: {
    select: {
      id: true,
      name: true,
      phone: true,
      profilePhoto: true,
    },
  },
} satisfies Prisma.ListingInclude;

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: FilterListingDto) {
    if (filters.status && filters.status !== ListingStatus.ACTIVE) {
      throw new ForbiddenException("Only active listings are publicly available");
    }

    const where: Prisma.ListingWhereInput = {
      status: ListingStatus.ACTIVE,
    };

    if (filters.type) where.type = filters.type;
    if (filters.tenantPolicy) where.tenantPolicy = filters.tenantPolicy;
    if (filters.genderPreference)
      where.genderPreference = filters.genderPreference;
    if (filters.minRent !== undefined || filters.maxRent !== undefined) {
      where.rent = {};
      if (filters.minRent !== undefined) where.rent.gte = filters.minRent;
      if (filters.maxRent !== undefined) where.rent.lte = filters.maxRent;
    }

    if (filters.areaId) {
      where.areaId = filters.areaId;
    } else if (filters.upazilaId) {
      where.area = { upazilaId: filters.upazilaId };
    } else if (filters.districtId) {
      where.area = { upazila: { districtId: filters.districtId } };
    } else if (filters.divisionId) {
      where.area = {
        upazila: { district: { divisionId: filters.divisionId } },
      };
    }

    return this.prisma.listing.findMany({
      where,
      include: listingInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const listing = await this.loadListing(id);

    if (
      listing.status === ListingStatus.DRAFT ||
      listing.status === ListingStatus.PENDING ||
      listing.status === ListingStatus.REJECTED
    ) {
      throw new NotFoundException("Listing not found");
    }

    return listing;
  }

  async findMyListings(userId: string) {
    return this.prisma.listing.findMany({
      where: { ownerId: userId },
      include: listingInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async findMyListing(id: string, userId: string, userRole: UserRole) {
    const listing = await this.loadListing(id);
    this.assertOwner(listing.ownerId, userId, userRole);
    return listing;
  }

  async findPendingListings() {
    return this.prisma.listing.findMany({
      where: { status: ListingStatus.PENDING },
      include: listingInclude,
      orderBy: { createdAt: "asc" },
    });
  }

  async approveListing(id: string) {
    return this.moderatePendingListing(id, ListingStatus.ACTIVE);
  }

  async rejectListing(id: string) {
    return this.moderatePendingListing(id, ListingStatus.REJECTED);
  }

  async create(userId: string, userRole: UserRole, dto: CreateListingDto) {
    // if (userRole !== UserRole.OWNER && userRole !== UserRole.ADMIN) {
    //   throw new ForbiddenException('Only owners and admins can create listings');
    // }

    // console.log(JSON.stringify(dto, null, 4));

    // const area = await this.prisma.area.findUnique({
    //   where: { id: dto.areaId },
    // });

    // if (!area) {
    //   throw new NotFoundException("Area not found");
    // }

    if (dto.photos && dto.photos.length > MAX_LISTING_PHOTOS) {
      throw new BadRequestException("A listing can have a maximum of 8 photos");
    }

    const { photos, availableFrom, status, ...rest } = dto;

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 3);

    const listing = await this.prisma.listing.create({
      data: {
        ...rest,
        availableFrom: new Date(availableFrom),
        status:
          userRole === UserRole.ADMIN
            ? (status ?? ListingStatus.PENDING)
            : ListingStatus.PENDING,
        ownerId: userId,
        expiresAt,
      },
    });

    if (photos?.length) {
      await this.prisma.listingPhoto.createMany({
        data: photos.map((url, index) => ({
          url,
          isPrimary: index === 0,
          listingId: listing.id,
        })),
      });
    }

    return this.loadListing(listing.id);
  }

  async update(
    id: string,
    userId: string,
    userRole: UserRole,
    dto: UpdateListingDto,
  ) {
    const listing = await this.loadListing(id);
    this.assertOwner(listing.ownerId, userId, userRole);

    const { photos, availableFrom, status, ...rest } = dto;

    if (status !== undefined && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException("Only admins can change listing status");
    }

    if (photos && photos.length > MAX_LISTING_PHOTOS) {
      throw new BadRequestException("A listing can have a maximum of 8 photos");
    }

    const updateData: Prisma.ListingUpdateInput = {
      ...rest,
      ...(availableFrom ? { availableFrom: new Date(availableFrom) } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(listing.status === ListingStatus.REJECTED &&
      userRole !== UserRole.ADMIN
        ? { status: ListingStatus.PENDING }
        : {}),
    };

    if (photos) {
      await this.prisma.listingPhoto.deleteMany({ where: { listingId: id } });
      updateData.photos = {
        create: photos.map((url, index) => ({
          url,
          isPrimary: index === 0,
        })),
      };
    }

    await this.prisma.listing.update({
      where: { id },
      data: updateData,
    });

    return this.loadListing(id);
  }

  async addPhotosToListing(
    listingId: string,
    userId: string,
    userRole: UserRole,
    urls: string[],
  ) {
    const listing = await this.loadListing(listingId);
    this.assertOwner(listing.ownerId, userId, userRole);

    const currentCount = listing.photos.length;
    if (currentCount + urls.length > MAX_LISTING_PHOTOS) {
      throw new BadRequestException("A listing can have a maximum of 8 photos");
    }

    const hasPrimary = listing.photos.some((photo) => photo.isPrimary);

    await this.prisma.listingPhoto.createMany({
      data: urls.map((url, index) => ({
        url,
        isPrimary: !hasPrimary && index === 0,
        listingId,
      })),
    });

    return this.loadListing(listingId);
  }

  async setPrimaryPhoto(
    listingId: string,
    photoId: string,
    userId: string,
    userRole: UserRole,
  ) {
    const listing = await this.loadListing(listingId);
    this.assertOwner(listing.ownerId, userId, userRole);

    const photo = await this.prisma.listingPhoto.findFirst({
      where: { id: photoId, listingId },
    });

    if (!photo) {
      throw new NotFoundException("Photo not found for this listing");
    }

    await this.prisma.$transaction([
      this.prisma.listingPhoto.updateMany({
        where: { listingId },
        data: { isPrimary: false },
      }),
      this.prisma.listingPhoto.update({
        where: { id: photoId },
        data: { isPrimary: true },
      }),
    ]);

    return this.loadListing(listingId);
  }

  async softDelete(id: string, userId: string, userRole: UserRole) {
    const listing = await this.loadListing(id);
    this.assertOwner(listing.ownerId, userId, userRole);

    return this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.EXPIRED },
      include: listingInclude,
    });
  }

  async markFilled(id: string, userId: string, userRole: UserRole) {
    const listing = await this.loadListing(id);
    this.assertOwner(listing.ownerId, userId, userRole);

    if (listing.status !== ListingStatus.ACTIVE) {
      throw new BadRequestException("Only active listings can be marked as filled");
    }

    return this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.FILLED },
      include: listingInclude,
    });
  }

  async markUnFilled(id: string, userId: string, userRole: UserRole) {
    const listing = await this.loadListing(id);
    this.assertOwner(listing.ownerId, userId, userRole);

    if (listing.status !== ListingStatus.FILLED) {
      throw new BadRequestException("Only filled listings can be marked as active");
    }

    return this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.ACTIVE },
      include: listingInclude,
    });
  }

  private assertOwner(ownerId: string, userId: string, userRole: UserRole) {
    if (userRole === UserRole.ADMIN) {
      return;
    }

    if (ownerId !== userId) {
      throw new ForbiddenException("You can only modify your own listings");
    }
  }

  private async moderatePendingListing(id: string, status: ListingStatus) {
    const result = await this.prisma.listing.updateMany({
      where: { id, status: ListingStatus.PENDING },
      data: { status },
    });

    if (result.count === 0) {
      const listing = await this.prisma.listing.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!listing) {
        throw new NotFoundException("Listing not found");
      }
      throw new ConflictException("Only pending listings can be moderated");
    }

    return this.loadListing(id);
  }

  private async loadListing(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: listingInclude,
    });

    if (!listing) {
      throw new NotFoundException("Listing not found");
    }

    return listing;
  }
}
