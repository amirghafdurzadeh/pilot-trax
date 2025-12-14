"use client";
import { useLogin } from "@/context/login";
import { LoginOTPForm } from "./form-otp";
import { LoginPhoneForm } from "./form-phone";
import { Suspense } from "react";

export function LoginForm() {
  const { step } = useLogin();

  return (
    <Suspense>
      {step === "phone" && <LoginPhoneForm />}
      {step === "otp" && <LoginOTPForm />}
    </Suspense>
  );
}
