import { UserRole } from "@prisma/client";

export const DEMO_ACCOUNTS = [
  {
    email: "demo-seeker@bhalobasha.com",
    code: "123456",
    role: UserRole.SEEKER,
  },
  {
    email: "demo-seeker1@bhalobasha.com",
    code: "123456",
    role: UserRole.SEEKER,
  },
  { email: "demo-owner@bhalobasha.com", code: "123456", role: UserRole.OWNER },
  { email: "demo-admin@bhalobasha.com", code: "123456", role: UserRole.ADMIN },
] as const;

export const DEMO_ACCOUNT_EMAILS = new Set<string>(
  DEMO_ACCOUNTS.map(({ email }) => email),
);
