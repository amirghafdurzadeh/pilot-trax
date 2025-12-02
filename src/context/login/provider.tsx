"use client";
import { useState } from "react";
import { LoginContext } from "./context";

export function LoginProvider(props: { children?: React.ReactNode }) {
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
