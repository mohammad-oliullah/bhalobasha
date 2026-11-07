import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ListingStatus, SavedSearch } from "@prisma/client";
import { EmailService } from "../common/services/email.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSavedSearchDto } from "./dto/create-saved-search.dto";

@Injectable()
export class SavedSearchesService {
  private readonly logger = new Logger(SavedSearchesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  findMine(userId: string) {
    return this.prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(userId: string, dto: CreateSavedSearchDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!user) throw new NotFoundException("User not found");
    if (!user.email) {
      throw new BadRequestException(
        "Add an email address to your profile before saving an email alert",
      );
    }
    if (
      dto.minRent !== undefined &&
      dto.maxRent !== undefined &&
      dto.minRent > dto.maxRent
    ) {
      throw new BadRequestException("Minimum rent cannot exceed maximum rent");
    }

    const { name, ...criteria } = dto;
    const cleanName = name.trim();
    if (!cleanName) throw new BadRequestException("Search name is required");

    return this.prisma.savedSearch.create({
      data: {
        ...criteria,
        name: cleanName,
        userId,
      },
    });
  }

  async updateAlerts(id: string, userId: string, alertsEnabled: boolean) {
    const search = await this.getOwnedSearch(id, userId);
    if (alertsEnabled) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });
      if (!user?.email) {
        throw new BadRequestException(
          "Add an email address to your profile before enabling alerts",
        );
      }
    }

    return this.prisma.savedSearch.update({
      where: { id: search.id },
      data: { alertsEnabled },
    });
  }

  async remove(id: string, userId: string) {
    const search = await this.getOwnedSearch(id, userId);
    return this.prisma.savedSearch.delete({ where: { id: search.id } });
  }

  async notifyMatchingSearches(listingId: string): Promise<void> {
    try {
      const listing = await this.prisma.listing.findUnique({
        where: { id: listingId },
        include: {
          upazila: { include: { district: true } },
        },
      });
      if (!listing || listing.status !== ListingStatus.ACTIVE) return;

      const subscriptions = await this.prisma.savedSearch.findMany({
        where: { alertsEnabled: true, user: { email: { not: null } } },
        include: { user: { select: { email: true } } },
      });
      const matching = subscriptions.filter((search) =>
        this.matches(search, listing),
      );

      await Promise.all(
        matching.map(async (search) => {
          const email = search.user.email;
          if (!email) return;
          try {
            await this.emailService.sendSavedSearchAlert(
              email,
              search.name,
              listing,
            );
          } catch (error) {
            this.logger.error(
              `Unable to send saved-search alert ${search.id} for listing ${listing.id}`,
              error instanceof Error ? error.stack : String(error),
            );
          }
        }),
      );
    } catch (error) {
      this.logger.error(
        `Unable to process saved-search alerts for listing ${listingId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private matches(
    search: SavedSearch,
    listing: {
      type: string;
      tenantPolicy: string;
      genderPreference: string;
      areaId: number | null;
      upazilaId: number;
      isFurnished: boolean;
      utilitiesIncluded: boolean;
      rent: number;
      upazila: { districtId: number; district: { divisionId: number } };
    },
  ): boolean {
    if (search.type && search.type !== listing.type) return false;
    if (search.tenantPolicy && search.tenantPolicy !== listing.tenantPolicy) {
      return false;
    }
    if (
      search.genderPreference &&
      search.genderPreference !== listing.genderPreference
    ) {
      return false;
    }
    if (search.minRent !== null && listing.rent < search.minRent) return false;
    if (search.maxRent !== null && listing.rent > search.maxRent) return false;
    if (search.isFurnished && !listing.isFurnished) return false;
    if (search.utilitiesIncluded && !listing.utilitiesIncluded) return false;

    if (search.areaId !== null && search.areaId !== listing.areaId) return false;
    if (
      search.areaId === null &&
      search.upazilaId !== null &&
      search.upazilaId !== listing.upazilaId
    ) {
      return false;
    }
    if (
      search.areaId === null &&
      search.upazilaId === null &&
      search.districtId !== null &&
      search.districtId !== listing.upazila.districtId
    ) {
      return false;
    }
    if (
      search.areaId === null &&
      search.upazilaId === null &&
      search.districtId === null &&
      search.divisionId !== null &&
      search.divisionId !== listing.upazila.district.divisionId
    ) {
      return false;
    }

    return true;
  }

  private async getOwnedSearch(
    id: string,
    userId: string,
  ): Promise<SavedSearch> {
    const search = await this.prisma.savedSearch.findUnique({ where: { id } });
    if (!search) throw new NotFoundException("Saved search not found");
    if (search.userId !== userId) {
      throw new ForbiddenException("You can only manage your own saved searches");
    }
    return search;
  }
}
