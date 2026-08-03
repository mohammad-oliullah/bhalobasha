import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { SendOtpDto } from "./dto/send-otp.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { SmsService } from "../common/services/sms.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly otpService: SmsService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    if (!dto.phone && !dto.email) {
      throw new BadRequestException("Either phone or email must be provided");
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.otpVerification.create({
      data: {
        phone: dto.phone ?? null,
        email: dto.email ?? null,
        code,
        expiresAt,
      },
    });

    const contact = dto.email ?? dto.phone!;
    // Fire and forget: send email asynchronously without blocking the response
    this.otpService.sendOtp(contact, code).catch((error) => {
      this.logger.error(`Failed to send OTP email: ${error}`);
    });

    return {
      success: true,
      data: null,
      message: `OTP sent to ${dto.email ? "email" : "phone"}`,
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    if (!dto.phone && !dto.email) {
      throw new BadRequestException("Either phone or email must be provided");
    }

    // Build where clause based on what was provided
    const otpRecord = await this.prisma.otpVerification.findFirst({
      where: {
        ...(dto.phone ? { phone: dto.phone } : { email: dto.email }),
        code: dto.code,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      throw new UnauthorizedException("Invalid or expired OTP");
    }

    await this.prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { isUsed: true },
    });

    // Find or create user by phone or email
    let user = await this.prisma.user.findFirst({
      where: dto.phone ? { phone: dto.phone } : { email: dto.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone: dto.phone ?? null,
          email: dto.email ?? null,
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
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>("JWT_SECRET"),
      expiresIn: this.configService.get<string>(
        "JWT_EXPIRES_IN",
        "7d",
      ) as `${number}d`,
    });

    const {
      id,
      phone,
      name,
      email,
      role,
      isVerified,
      profilePhoto,
      createdAt,
    } = user;

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
      message: "OTP verified successfully",
    };
  }
}
