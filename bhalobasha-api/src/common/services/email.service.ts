import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

interface AlertListing {
  id: string;
  title: string;
  address: string;
  rent: number;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const user = this.configService.get<string>("GMAIL_USER");
    const password = this.configService.get<string>("GMAIL_APP_PASSWORD");

    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      ...(user && password ? { auth: { user, pass: password } } : {}),
    });
  }

  async sendSavedSearchAlert(
    to: string,
    searchName: string,
    listing: AlertListing,
  ): Promise<void> {
    const fromAddress = this.configService.get<string>("GMAIL_USER");
    if (!fromAddress || !this.configService.get<string>("GMAIL_APP_PASSWORD")) {
      throw new Error("Email delivery is not configured");
    }

    const frontendUrl = this.configService.get<string>(
      "FRONTEND_URL",
      "http://localhost:3000",
    );
    const listingUrl = `${frontendUrl}/listings/${encodeURIComponent(listing.id)}`;
    const searchesUrl = `${frontendUrl}/dashboard/saved-searches`;
    const safeTitle = escapeHtml(listing.title);
    const safeAddress = escapeHtml(listing.address);
    const safeSearchName = escapeHtml(searchName);

    await this.transporter.sendMail({
      from: `"Bhalobasha ভালোবাসা" <${fromAddress}>`,
      to,
      subject: "New listing matches your saved search",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #1a6b3c;">ভালোবাসা — Bhalobasha</h2>
          <p>A new home matches your saved search <strong>${safeSearchName}</strong>.</p>
          <h3><a href="${listingUrl}" style="color: #1a6b3c;">${safeTitle}</a></h3>
          <p>${safeAddress}</p>
          <p><strong>৳${listing.rent.toLocaleString("en-BD")} / month</strong></p>
          <p><a href="${listingUrl}">View listing</a></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 12px; color: #777;">
            You can manage or turn off these alerts in
            <a href="${searchesUrl}">your saved searches</a>.
          </p>
        </div>
      `,
    });
  }
}
