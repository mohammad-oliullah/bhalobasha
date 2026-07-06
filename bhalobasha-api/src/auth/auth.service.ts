import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.otpVerification.create({
      data: {
        phone: dto.phone,
        code,
        expiresAt,
      },
    });

    console.log(`[MOCK OTP] Phone: ${dto.phone}, Code: ${code}`);

    return {
      success: true,
      data: null,
      message: 'OTP sent',
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const otpRecord = await this.prisma.otpVerification.findFirst({
      where: {
        phone: dto.phone,
        code: dto.code,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    await this.prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });

    let user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone: dto.phone,
          isVerified: true,
        },
      });
    } else if (!user.isVerified) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });
    }

    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d') as `${number}d`,
    });

    const { id, phone, name, email, role, isVerified, profilePhoto, createdAt } =
      user;

    return {
      success: true,
      data: {
        accessToken,
        user: {
          id,
          phone,
          name,
          email,
          role,
          isVerified,
          profilePhoto,
          createdAt,
        },
      },
      message: 'OTP verified successfully',
    };
  }
}
