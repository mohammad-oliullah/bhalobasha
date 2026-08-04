/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginToggle } from "./_components/login-toggle";
import { PhoneLogin } from "./_components/phone-login";
import { EmailLogin } from "./_components/email-login";
import { DemoLogin } from "./_components/demo-login";

type LoginMethod = "phone" | "email" | "demo";

export default function LoginPage() {
  const [method, setMethod] = useState<LoginMethod>("demo");
  const [email, setEmail] = useState("");

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
            ভা
          </div>
          <CardTitle className="text-2xl">Welcome to Bhalobasha</CardTitle>
          <p className="text-sm text-muted">Login or sign up to continue</p>
        </CardHeader>

        <CardContent>
          <LoginToggle method={method} onChange={setMethod} />

          {method === "phone" && <PhoneLogin />}
          {method === "email" && (
            <EmailLogin email={email} onChange={setEmail} />
          )}
          {method === "demo" && <DemoLogin />}

          <p className="mt-6 text-center text-xs text-muted">
            By continuing, you agree to Bhalobasha&apos;s terms of service.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
