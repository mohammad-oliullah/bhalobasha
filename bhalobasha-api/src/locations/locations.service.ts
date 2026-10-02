import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  findDivisions() {
    return this.prisma.division.findMany({
      orderBy: { name: "asc" },
    });
  }

  findDistricts(divisionId: number) {
    return this.prisma.district.findMany({
      where: { divisionId },
      orderBy: { name: "asc" },
    });
  }

  findUpazilas(districtId: number) {
    return this.prisma.upazila.findMany({
      where: { districtId },
      orderBy: { name: "asc" },
    });
  }

  findAreas(upazilaId: number) {
    return this.prisma.area.findMany({
      where: { upazilaId },
      orderBy: { name: "asc" },
    });
  }
}
