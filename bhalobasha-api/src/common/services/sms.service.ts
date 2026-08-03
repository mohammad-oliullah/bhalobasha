import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Twilio } from "twilio";
import axios from "axios";
import * as nodemailer from "nodemailer";

@Injectable()
export class SmsService {
  private twilioClient: Twilio;
  private readonly logger = new Logger(SmsService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Twilio client
    const accountSid = this.configService.get<string>("TWILIO_ACCOUNT_SID");
    const authToken = this.configService.get<string>("TWILIO_AUTH_TOKEN");
    this.twilioClient = new Twilio(accountSid, authToken);

    // Nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      connectionTimeout: 10000,
      socketTimeout: 10000,
      auth: {
        user: this.configService.get<string>("GMAIL_USER"),
        pass: this.configService.get<string>("GMAIL_APP_PASSWORD"),
      },
    } as nodemailer.TransportOptions);
  }

  async sendOtp(contact: string, code: string): Promise<void> {
    const isEmail = contact.includes("@");

    if (isEmail) {
      await this.sendEmailOtp(contact, code);
    } else {
      await this.sendPhoneOtp(contact, code);
    }
  }

  // ─── Email via Nodemailer ───────────────────────────────────────────────────

  private async sendEmailOtp(email: string, code: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"Bhalobasha ভালোবাসা" <${this.configService.get("GMAIL_USER")}>`,
        to: email,
        subject: "Your Bhalobasha OTP Code",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1a6b3c;">ভালোবাসা — Bhalobasha</h2>
            <p>Your OTP code is:</p>
            <div style="
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 8px;
              color: #1a6b3c;
              background: #e8f5ee;
              padding: 16px;
              border-radius: 8px;
              text-align: center;
              margin: 16px 0;
            ">${code}</div>
            <p style="color: #666;">Valid for <strong>5 minutes</strong>. Do not share with anyone.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
            <p style="font-size: 12px; color: #999;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
        `,
      });

      // this.logger.log(`OTP email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${email}: ${error}`);
      this.logger.warn(`[FALLBACK] Email: ${email} → Code: ${code}`);
      throw error;
    }
  }

  // ─── Phone via Twilio + SMSBD fallback ─────────────────────────────────────

  private async sendPhoneOtp(phone: string, code: string): Promise<void> {
    const formattedPhone = phone.startsWith("0")
      ? `+880${phone.slice(1)}`
      : `+880${phone}`;

    // Try Twilio first
    const twilioSent = await this.sendViaTwilio(formattedPhone, code);
    if (twilioSent) return;

    // Twilio failed — try SMSBD
    const smsBdSent = await this.sendViaSmsBd(phone, code);
    if (smsBdSent) return;

    // Both failed — log fallback
    this.logger.warn(`[FALLBACK] Phone: ${formattedPhone} → Code: ${code}`);
  }

  private async sendViaTwilio(
    formattedPhone: string,
    code: string,
  ): Promise<boolean> {
    const from = this.configService.get<string>("TWILIO_PHONE_NUMBER");

    try {
      await this.twilioClient.messages.create({
        body: `Your Bhalobasha (ভালোবাসা) OTP Code is ${code}. Valid for 5 minutes. Do not share with anyone.`,
        from,
        to: formattedPhone,
      });

      this.logger.log(`[Twilio] OTP sent to ${formattedPhone}`);
      return true;
    } catch (error) {
      this.logger.warn(
        `[Twilio] Failed to send OTP to ${formattedPhone}: ${error}. Trying SMSBD...`,
      );
      return false;
    }
  }

  private async sendViaSmsBd(phone: string, code: string): Promise<boolean> {
    const apiKey = this.configService.get<string>("SMS_BD_API_KEY");

    // SMSBD format: 8801XXXXXXXXX (no +)
    const formattedPhone = phone.startsWith("0")
      ? `880${phone.slice(1)}`
      : phone;

    try {
      const response = await axios.get("https://api.sms.net.bd/sendsms", {
        params: {
          api_key: apiKey,
          msg: `Your Bhalobasha (ভালোবাসা) OTP Code is ${code}. Valid for 5 minutes. Do not share with anyone.`,
          to: formattedPhone,
        },
      });

      // SMSBD returns 200 even on errors — check the error field
      if (response.data?.error && response.data.error !== 0) {
        this.logger.warn(
          `[SMSBD] API error for ${formattedPhone}: ${response.data.msg}`,
        );
        return false;
      }

      this.logger.log(
        `[SMSBD] OTP sent to ${formattedPhone} — response: ${JSON.stringify(response.data)}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `[SMSBD] Failed to send OTP to ${formattedPhone}: ${error}`,
      );
      return false;
    }
  }
}
