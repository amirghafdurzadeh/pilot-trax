"use client";
import { useLogin } from "@/context/login";
import { LoginOTPForm } from "./form-otp";
import { LoginPhoneForm } from "./form-phone";

export function LoginForm() {
  const { step } = useLogin();

  if (step === "phone") return <LoginPhoneForm />;
  if (step === "otp") return <LoginOTPForm />;
  return null;
}
