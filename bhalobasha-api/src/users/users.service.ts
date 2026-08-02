import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        isActive: true,
        profilePhoto: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }
    const { phone, email, ...rest } = dto;
    const updatedData: any = { ...rest };

    // Check phone isn't already taken by another user
    if (dto.phone) {
      const phoneExists = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      });
      if (phoneExists && phoneExists.id !== userId) {
        throw new BadRequestException("Phone number is already in use");
      }
    }

    // Check email isn't already taken by another user
    if (dto.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (emailExists && emailExists.id !== userId) {
        throw new BadRequestException("Email is already in use");
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        isActive: true,
        profilePhoto: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
