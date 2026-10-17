import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser, JwtPayload } from "../common/decorators/current-user.decorator";
import { Public } from "../common/decorators/public.decorator";
import { CreateCheckoutDto } from "./dto/create-checkout.dto";
import { SubscriptionsService } from "./subscriptions.service";

@ApiTags("Subscriptions")
@Controller("subscriptions")
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Public()
  @Get("plans")
  @ApiOperation({ summary: "Get available subscription plans" })
  getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get the current user's subscription status" })
  getMySubscription(@CurrentUser() user: JwtPayload) {
    return this.subscriptionsService.getSubscription(user.sub);
  }

  @Post("checkout")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Start an SSLCommerz subscription checkout" })
  createCheckout(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateCheckoutDto,
  ) {
    return this.subscriptionsService.createCheckout(user.sub, dto);
  }

  @Public()
  @Post("sslcommerz/success")
  @HttpCode(HttpStatus.OK)
  async success(
    @Body() body: Record<string, string>,
    @Res() response: Response,
  ) {
    const result = await this.subscriptionsService.completePayment(
      body.tran_id,
      body.val_id,
    );
    return response.redirect(
      this.subscriptionsService.getResultUrl(
        result === "PAID" ? "success" : "failed",
      ),
    );
  }

  @Public()
  @Post("sslcommerz/fail")
  @HttpCode(HttpStatus.OK)
  async fail(
    @Body() body: Record<string, string>,
    @Res() response: Response,
  ) {
    await this.subscriptionsService.failPayment(body.tran_id);
    return response.redirect(
      this.subscriptionsService.getResultUrl("failed"),
    );
  }

  @Public()
  @Post("sslcommerz/cancel")
  @HttpCode(HttpStatus.OK)
  async cancel(
    @Body() body: Record<string, string>,
    @Res() response: Response,
  ) {
    await this.subscriptionsService.cancelPayment(body.tran_id);
    return response.redirect(
      this.subscriptionsService.getResultUrl("cancelled"),
    );
  }

  @Public()
  @Post("sslcommerz/ipn")
  @HttpCode(HttpStatus.OK)
  async ipn(@Body() body: Record<string, string>) {
    if (body.tran_id && body.val_id) {
      await this.subscriptionsService.completePayment(
        body.tran_id,
        body.val_id,
      );
    }
    return { received: true };
  }
}
