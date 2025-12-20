"use client";
import { useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect, useMemo } from "react";

import { otpSend } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "@/context/login";
import { getDictionary } from "@/lib/dictionaries";

type Dict = Awaited<ReturnType<typeof getDictionary>>["login"]["phone"];

export function LoginPhoneForm({ lang, dict }: { lang: string; dict: Dict }) {
  const searchParams = useSearchParams();
  const { setStep, phone, setPhone, setOtpExpiredAt } = useLogin();
  const [otpSendState, otpSendAction, otpSendPending] = useActionState(
    otpSend,
    null
  );
  const errors = useMemo(
    () => [
      ...(otpSendState?.errors?.formErrors ?? []),
      ...Object.values(otpSendState?.errors?.fieldErrors ?? {}).flat(),
    ],
    [otpSendState]
  );

  useEffect(() => {
    const phone = searchParams.get("phone");
    if (!phone) return;
    setPhone(phone);
  }, [searchParams]);

  useEffect(() => {
    if (!otpSendState?.success) return;
    startTransition(() => {
      setOtpExpiredAt(otpSendState.data!.expiredAt.toString());
      setStep("otp");
    });
  }, [otpSendState]);

  return (
    <Card className="max-w-xs w-full m-auto">
      <CardHeader>
        <CardTitle>{dict.title}</CardTitle>
        <CardDescription>{dict.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="loginForm"
          action={otpSendAction}
          className="flex flex-col gap-4"
        >
          <input type="hidden" name="redirectURL" value={`/${lang}/app`} />
          <Field>
            <FieldLabel htmlFor="phone">{dict.label}</FieldLabel>
            <div className="flex w-full" style={{ direction: "ltr" }}>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder={dict.placeholder}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </Field>
          <div className="flex flex-col gap-2">
            {errors.map((error, index) => (
              <FieldError key={index}>{error}</FieldError>
            ))}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 items-stretch">
        <Button
          variant="default"
          type="submit"
          form="loginForm"
          disabled={otpSendPending}
        >
          {otpSendPending && <Spinner />}
          {dict.button}
        </Button>
      </CardFooter>
    </Card>
  );
}
