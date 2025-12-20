"use client";
import { Suspense } from "react";

import { useLogin } from "@/context/login";
import { LoginOTPForm } from "./form-otp";
import { LoginPhoneForm } from "./form-phone";
import { getDictionary } from "@/lib/dictionaries";

type Dict = Awaited<ReturnType<typeof getDictionary>>["login"];

export function LoginForm({ lang, dict }: { lang: string; dict: Dict }) {
  const { step } = useLogin();

  return (
    <Suspense>
      {step === "phone" && <LoginPhoneForm lang={lang} dict={dict.phone} />}
      {step === "otp" && <LoginOTPForm lang={lang} dict={dict.otp} />}
    </Suspense>
  );
}
