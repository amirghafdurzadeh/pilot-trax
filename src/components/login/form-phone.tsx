"use client";
import { startTransition, useActionState, useEffect } from "react";

import { otpSendAction } from "@/actions/auth";
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

export function LoginPhoneForm() {
  const { setStep, phone, setPhone, setOtpExpiredAt } = useLogin();
  const [otpSendState, otpSend, otpSendPending] = useActionState(
    otpSendAction,
    null
  );

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
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your phone number to login.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="loginForm" action={otpSend}>
          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input
              id="phone"
              name="phone"
              type="number"
              placeholder="09123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {otpSendState?.errors?.fieldErrors.phone && (
              <FieldError>
                {otpSendState.errors.fieldErrors.phone[0]}
              </FieldError>
            )}
          </Field>
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
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}
