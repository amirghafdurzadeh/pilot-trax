"use client";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { otpLoginAction, otpSendAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "@/context/login";
import { SquarePenIcon } from "lucide-react";

export function LoginOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const { phone, setStep, otpExpiredAt, setOtpExpiredAt } = useLogin();
  const [otpLoginState, otpLogin, otpLoginPending] = useActionState(
    otpLoginAction,
    null
  );
  const [otpSendState, otpSend, otpSendPending] = useActionState(
    otpSendAction,
    null
  );
  const [otp, setOtp] = useState("");
  const [otpRemaining, setOtpRemaining] = useState(0);

  const handleResend = useCallback(() => {
    const formData = new FormData();
    formData.set("phone", phone);
    startTransition(() => {
      otpSend(formData);
    });
  }, []);

  useEffect(() => {
    const expiredAt = new Date(otpExpiredAt);
    const now = new Date();
    const remaining =
      Math.floor((expiredAt.getTime() - now.getTime()) / 1000) + 1;
    startTransition(() => {
      setOtpRemaining(remaining < 0 ? 0 : remaining);
    });
  }, [otpExpiredAt]);

  useEffect(() => {
    const interval = setInterval(() => {
      startTransition(() => {
        setOtpRemaining((p) => (p === 0 ? p : p - 1));
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!otpLoginState?.success) return;
    const r = searchParams.get("r");
    router.replace(r || "/");
  }, [otpLoginState, searchParams]);

  useEffect(() => {
    if (!otpSendState?.success) return;
    startTransition(() => {
      setOtpExpiredAt(otpSendState.data!.expiredAt.toString());
      setStep("otp");
    });
  }, [otpSendState]);

  useEffect(() => {
    if (!formRef.current) return;
    if (otp.length !== 6) return;
    formRef.current.requestSubmit();
  }, [otp]);

  return (
    <Card className="max-w-xs w-full m-auto">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter the verification code sent to your phone.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center">
          <div className="flex flex-col gap-1">
            <span className="text-sm">Phone</span>
            <span className="text-sm text-muted-foreground">{phone}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center ms-auto"
            onClick={() => setStep("phone")}
          >
            <SquarePenIcon className="size-3" />
            Edit
          </Button>
        </div>
        <form id="loginForm" action={otpLogin} ref={formRef}>
          <Field>
            <FieldLabel htmlFor="otp">Code</FieldLabel>
            <div className="flex w-full" style={{ direction: "ltr" }}>
              <InputOTP
                id="otp"
                name="otp"
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={otp}
                onChange={(value) => setOtp(value)}
                containerClassName="w-full"
              >
                <InputOTPGroup className="w-full">
                  <InputOTPSlot index={0} className="flex-1" />
                  <InputOTPSlot index={1} className="flex-1" />
                  <InputOTPSlot index={2} className="flex-1" />
                  <InputOTPSlot index={3} className="flex-1" />
                  <InputOTPSlot index={4} className="flex-1" />
                  <InputOTPSlot index={5} className="flex-1" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </Field>
          <input type="hidden" name="phone" value={phone} />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 items-stretch">
        <Button
          variant="secondary"
          onClick={handleResend}
          disabled={otpLoginPending || otpSendPending || otpRemaining !== 0}
        >
          {otpSendPending && <Spinner />}
          {otpRemaining !== 0 && (
            <span>
              {Math.floor(otpRemaining / 60)}:
              {String(otpRemaining % 60).padStart(2, "0")}
            </span>
          )}
          Resend
        </Button>
        <Button
          variant="default"
          type="submit"
          form="loginForm"
          disabled={otpLoginPending || otpSendPending}
        >
          {otpLoginPending && <Spinner />}
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}
