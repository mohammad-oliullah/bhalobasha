import enMessages from "@/messages/en.json";
import bnMessages from "@/messages/bn.json";

export const locales = ["en", "bn"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const messages = {
  en: enMessages,
  bn: bnMessages,
} as const;
