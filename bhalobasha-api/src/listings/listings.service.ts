import {
  BadRequestException,
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
  area: {
    include: {
      thana: {
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
    const where: Prisma.ListingWhereInput = {
      status: filters.status ?? ListingStatus.ACTIVE,
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
    } else if (filters.thanaId) {
      where.area = { thanaId: filters.thanaId };
    } else if (filters.districtId) {
      where.area = { thana: { districtId: filters.districtId } };
    } else if (filters.divisionId) {
      where.area = { thana: { district: { divisionId: filters.divisionId } } };
    }

    return this.prisma.listing.findMany({
      where,
      include: listingInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: listingInclude,
    });

    if (!listing) {
      throw new NotFoundException("Listing not found");
    }

    return listing;
  }

  async create(userId: string, userRole: UserRole, dto: CreateListingDto) {
    // if (userRole !== UserRole.OWNER && userRole !== UserRole.ADMIN) {
    //   throw new ForbiddenException('Only owners and admins can create listings');
    // }

    // console.log(JSON.stringify(dto, null, 4));

    const area = await this.prisma.area.findUnique({
      where: { id: dto.areaId },
    });

    if (!area) {
      throw new NotFoundException("Area not found");
    }

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
        status: status ?? ListingStatus.ACTIVE,
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

    return this.findOne(listing.id);
  }

  async update(
    id: string,
    userId: string,
    userRole: UserRole,
    dto: UpdateListingDto,
  ) {
    const listing = await this.findOne(id);
    this.assertOwner(listing.ownerId, userId, userRole);

    const { photos, availableFrom, ...rest } = dto;

    if (photos && photos.length > MAX_LISTING_PHOTOS) {
      throw new BadRequestException("A listing can have a maximum of 8 photos");
    }

    const updateData: Prisma.ListingUpdateInput = {
      ...rest,
      ...(availableFrom ? { availableFrom: new Date(availableFrom) } : {}),
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

    return this.findOne(id);
  }

  async addPhotosToListing(
    listingId: string,
    userId: string,
    userRole: UserRole,
    urls: string[],
  ) {
    const listing = await this.findOne(listingId);
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

    return this.findOne(listingId);
  }

  async setPrimaryPhoto(
    listingId: string,
    photoId: string,
    userId: string,
    userRole: UserRole,
  ) {
    const listing = await this.findOne(listingId);
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

    return this.findOne(listingId);
  }

  async softDelete(id: string, userId: string, userRole: UserRole) {
    const listing = await this.findOne(id);
    this.assertOwner(listing.ownerId, userId, userRole);

    return this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.EXPIRED },
      include: listingInclude,
    });
  }

  async markFilled(id: string, userId: string, userRole: UserRole) {
    const listing = await this.findOne(id);
    this.assertOwner(listing.ownerId, userId, userRole);

    return this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.FILLED },
      include: listingInclude,
    });
  }

  async markUnFilled(id: string, userId: string, userRole: UserRole) {
    const listing = await this.findOne(id);
    this.assertOwner(listing.ownerId, userId, userRole);

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
}
