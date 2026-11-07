import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SubscriptionPaymentStatus, UserRole } from "@prisma/client";
import axios from "axios";
import { randomUUID } from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { DEMO_ACCOUNT_EMAILS } from "../auth/demo-accounts";
import { CreateCheckoutDto } from "./dto/create-checkout.dto";

const FIXED_PLANS = [
  { durationDays: 3, amountBdt: 10, label: "3 days" },
  { durationDays: 7, amountBdt: 15, label: "7 days" },
  { durationDays: 15, amountBdt: 30, label: "15 days" },
  { durationDays: 30, amountBdt: 50, label: "30 days" },
  { durationDays: 180, amountBdt: 250, label: "6 months (180 days)" },
];

interface GatewayInitResponse {
  status?: string;
  GatewayPageURL?: string;
  failedreason?: string;
}

interface GatewayValidationResponse {
  status?: string;
  tran_id?: string;
  val_id?: string;
  amount?: string;
  currency?: string;
  store_id?: string;
}

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  getPlans() {
    return {
      fixed: FIXED_PLANS,
      custom: {
        minDays: 1,
        maxDays: 3650,
        baseDurationDays: 30,
        basePriceBdt: 50,
        priceFormula: "ceil(days * 50 / 30)",
      },
    };
  }

  async getSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionExpiresAt: true, email: true, role: true },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const expiresAt = user.subscriptionExpiresAt;
    const isUnlimited =
      user.role === UserRole.ADMIN ||
      (user.email !== null && DEMO_ACCOUNT_EMAILS.has(user.email));
    return {
      expiresAt: isUnlimited ? null : expiresAt,
      isActive:
        isUnlimited || (expiresAt !== null && expiresAt.getTime() > Date.now()),
      isUnlimited,
    };
  }

  async assertActive(userId: string) {
    const subscription = await this.getSubscription(userId);
    if (!subscription.isActive) {
      throw new ForbiddenException(
        "An active subscription is required for this action",
      );
    }
  }

  async createCheckout(userId: string, dto: CreateCheckoutDto) {
    const subscription = await this.getSubscription(userId);
    if (subscription.isUnlimited) {
      throw new BadRequestException(
        "This account has unlimited subscription access",
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.email || !user.phone) {
      throw new BadRequestException(
        "Add both an email address and phone number to your profile before subscribing",
      );
    }

    const plan = this.getPlan(dto.durationDays);
    const tranId = randomUUID();
    const payment = await this.prisma.subscriptionPayment.create({
      data: {
        userId,
        tranId,
        amount: plan.amountBdt,
        durationDays: dto.durationDays,
      },
      select: { id: true },
    });

    const storeId = this.config.get<string>("SSLCOMMERZ_STORE_ID");
    const storePassword = this.config.get<string>("SSLCOMMERZ_STORE_PASSWORD");
    if (!storeId || !storePassword) {
      await this.prisma.subscriptionPayment.update({
        where: { id: payment.id },
        data: { status: SubscriptionPaymentStatus.FAILED },
      });
      throw new ServiceUnavailableException(
        "SSLCommerz is not configured on the server",
      );
    }

    const apiBaseUrl = this.config.get<string>(
      "API_BASE_URL",
      "http://localhost:4040/api/v1",
    );
    const frontendUrl = this.config.get<string>(
      "FRONTEND_URL",
      "http://localhost:3000",
    );
    const callbackBase = `${apiBaseUrl.replace(/\/$/, "")}/subscriptions/sslcommerz`;
    const params = new URLSearchParams({
      store_id: storeId,
      store_passwd: storePassword,
      total_amount: plan.amountBdt.toFixed(2),
      currency: "BDT",
      tran_id: tranId,
      success_url: `${callbackBase}/success`,
      fail_url: `${callbackBase}/fail`,
      cancel_url: `${callbackBase}/cancel`,
      ipn_url: `${callbackBase}/ipn`,
      cus_name: user.name || "Bhalobasha user",
      cus_email: user.email,
      cus_add1: dto.address,
      cus_city: dto.city,
      cus_postcode: dto.postcode,
      cus_country: "Bangladesh",
      cus_phone: user.phone,
      shipping_method: "NO",
      product_name: `Bhalobasha subscription - ${plan.label}`,
      product_category: "Subscription",
      product_profile: "non-physical-goods",
      num_of_item: "1",
    });

    try {
      const response = await axios.post<GatewayInitResponse>(
        this.getGatewayUrl(),
        params,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );
      if (response.data.status !== "SUCCESS" || !response.data.GatewayPageURL) {
        throw new BadGatewayException(
          response.data.failedreason || "SSLCommerz could not start checkout",
        );
      }
      let gatewayUrl: URL;
      try {
        gatewayUrl = new URL(response.data.GatewayPageURL);
      } catch {
        throw new BadGatewayException(
          "SSLCommerz returned an invalid checkout URL",
        );
      }
      const expectedHost =
        this.config.get<string>("SSLCOMMERZ_SANDBOX", "true") === "false"
          ? "securepay.sslcommerz.com"
          : "sandbox.sslcommerz.com";
      if (
        gatewayUrl.protocol !== "https:" ||
        gatewayUrl.hostname !== expectedHost
      ) {
        throw new BadGatewayException(
          "SSLCommerz returned an invalid checkout URL",
        );
      }

      return {
        redirectUrl: gatewayUrl.toString(),
        durationDays: dto.durationDays,
        amountBdt: plan.amountBdt,
        paymentId: payment.id,
      };
    } catch (error) {
      if (error instanceof BadGatewayException) {
        await this.prisma.subscriptionPayment.update({
          where: { id: payment.id },
          data: { status: SubscriptionPaymentStatus.FAILED },
        });
        throw error;
      }
      await this.prisma.subscriptionPayment.update({
        where: { id: payment.id },
        data: { status: SubscriptionPaymentStatus.FAILED },
      });
      if (axios.isAxiosError(error)) {
        throw new BadGatewayException(
          "Could not connect to SSLCommerz to start checkout",
        );
      }
      throw error;
    }
  }

  async completePayment(
    tranId: string,
    valId: string,
  ): Promise<"PAID" | "FAILED"> {
    if (!tranId || !valId) {
      return "FAILED";
    }

    const payment = await this.prisma.subscriptionPayment.findUnique({
      where: { tranId },
    });
    if (!payment) {
      throw new NotFoundException("Subscription payment not found");
    }
    if (payment.status === SubscriptionPaymentStatus.PAID) {
      return "PAID";
    }
    if (payment.status !== SubscriptionPaymentStatus.PENDING) {
      return "FAILED";
    }

    const storeId = this.config.get<string>("SSLCOMMERZ_STORE_ID");
    const storePassword = this.config.get<string>("SSLCOMMERZ_STORE_PASSWORD");
    if (!storeId || !storePassword) {
      throw new ServiceUnavailableException(
        "SSLCommerz is not configured on the server",
      );
    }

    let validation: GatewayValidationResponse;
    try {
      const response = await axios.get<GatewayValidationResponse>(
        this.getValidationUrl(),
        {
          params: {
            val_id: valId,
            store_id: storeId,
            store_passwd: storePassword,
            format: "json",
          },
        },
      );
      validation = response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new BadGatewayException(
          "Could not validate the SSLCommerz payment",
        );
      }
      throw error;
    }

    const isValid =
      (validation.status === "VALID" || validation.status === "VALIDATED") &&
      validation.tran_id === payment.tranId &&
      validation.val_id === valId &&
      Number(validation.amount) === payment.amount &&
      validation.currency === "BDT" &&
      validation.store_id === storeId;

    if (!isValid) {
      await this.prisma.subscriptionPayment.updateMany({
        where: {
          id: payment.id,
          status: SubscriptionPaymentStatus.PENDING,
        },
        data: { status: SubscriptionPaymentStatus.FAILED },
      });
      return "FAILED";
    }

    await this.prisma.$transaction(async (transaction) => {
      const claimed = await transaction.subscriptionPayment.updateMany({
        where: {
          id: payment.id,
          status: SubscriptionPaymentStatus.PENDING,
        },
        data: {
          status: SubscriptionPaymentStatus.PAID,
          valId,
        },
      });
      if (claimed.count === 0) {
        return;
      }

      await transaction.$executeRaw`
        UPDATE "User"
        SET "subscriptionExpiresAt" =
          GREATEST(COALESCE("subscriptionExpiresAt", CURRENT_TIMESTAMP), CURRENT_TIMESTAMP)
          + ${payment.durationDays} * INTERVAL '1 day',
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE "id" = ${payment.userId}
      `;
    });

    const updated = await this.prisma.subscriptionPayment.findUnique({
      where: { id: payment.id },
      select: { status: true },
    });
    return updated?.status === SubscriptionPaymentStatus.PAID
      ? "PAID"
      : "FAILED";
  }

  async failPayment(tranId: string) {
    if (tranId) {
      await this.prisma.subscriptionPayment.updateMany({
        where: {
          tranId,
          status: SubscriptionPaymentStatus.PENDING,
        },
        data: { status: SubscriptionPaymentStatus.FAILED },
      });
    }
  }

  async cancelPayment(tranId: string) {
    if (tranId) {
      await this.prisma.subscriptionPayment.updateMany({
        where: {
          tranId,
          status: SubscriptionPaymentStatus.PENDING,
        },
        data: { status: SubscriptionPaymentStatus.CANCELLED },
      });
    }
  }

  getResultUrl(result: "success" | "failed" | "cancelled") {
    const frontendUrl = this.config.get<string>(
      "FRONTEND_URL",
      "http://localhost:3000",
    );
    return `${frontendUrl.replace(/\/$/, "")}/dashboard/subscription?payment=${result}`;
  }

  private getPlan(durationDays: number) {
    const fixedPlan = FIXED_PLANS.find(
      (plan) => plan.durationDays === durationDays,
    );
    if (fixedPlan) {
      return fixedPlan;
    }
    return {
      durationDays,
      amountBdt: Math.ceil((durationDays * 50) / 30),
      label: `${durationDays} days`,
    };
  }

  private getGatewayUrl() {
    return this.config.get<string>("SSLCOMMERZ_SANDBOX", "true") === "false"
      ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
      : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
  }

  private getValidationUrl() {
    return this.config.get<string>("SSLCOMMERZ_SANDBOX", "true") === "false"
      ? "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
      : "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";
  }
}
