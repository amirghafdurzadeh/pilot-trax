import { Dispatch, SetStateAction } from "react";

export type LoginContextType = Readonly<{
  step: string;
  setStep: Dispatch<SetStateAction<string>>;
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
  otpExpiredAt: string;
  setOtpExpiredAt: Dispatch<SetStateAction<string>>;
}>;
