"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { SquarePenIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  startTransition,
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { otpLoginAction, otpSendAction } from "@/actions/login";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";

const LoginContext = createContext({
  step: "phone",
  setStep: (step: string) => {},
  phone: "",
  setPhone: (phone: string) => {},
  otpExpiredAt: "",
  setOtpExpiredAt: (otp: string) => {},
});

function LoginProvider(props: { children?: React.ReactNode }) {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otpExpiredAt, setOtpExpiredAt] = useState("");

  return (
    <LoginContext.Provider
      value={{ step, setStep, phone, setPhone, otpExpiredAt, setOtpExpiredAt }}
    >
      {props.children}
    </LoginContext.Provider>
  );
}

export default function Page() {
  return (
    <main className="flex-1 p-4 flex">
      <LoginProvider>
        <LoginForm />
      </LoginProvider>
    </main>
  );
}

function LoginForm() {
  const { step } = useContext(LoginContext);

  if (step === "phone") return <LoginPhoneForm />;
  if (step === "otp") return <LoginOTPForm />;
  return null;
}

function LoginPhoneForm() {
  const { setStep, phone, setPhone, setOtpExpiredAt } =
    useContext(LoginContext);
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

function LoginOTPForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const { phone, setStep, otpExpiredAt, setOtpExpiredAt } =
    useContext(LoginContext);
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
            <InputOTP
              id="otp"
              name="otp"
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={otp}
              onChange={(value) => setOtp(value)}
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
