"use client";
import { useLogin } from "@/context/login";
import { LoginOTPForm } from "./form-otp";
import { LoginPhoneForm } from "./form-phone";
import { Suspense } from "react";

export function LoginForm({ lang }: { lang: string }) {
  const { step } = useLogin();

  return (
    <Suspense>
      {step === "phone" && <LoginPhoneForm lang={lang} />}
      {step === "otp" && <LoginOTPForm lang={lang} />}
    </Suspense>
  );
}
