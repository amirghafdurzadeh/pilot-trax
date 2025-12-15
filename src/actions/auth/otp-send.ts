"use server";
import z from "zod";

import prisma from "@/lib/prisma";

const otpSendSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل نامعتبر است."),
});

async function sendOtpMessage(phone: string, code: string) {
  const body = JSON.stringify({
    bodyId: 406859,
    to: phone,
    args: [code],
  });

  try {
    const response = await fetch(
      "https://console.melipayamak.com/api/send/shared/" + process.env["SMS_APIKEY"],
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": body.length.toString(),
        },
        body,
      }
    );
    const json = await response.json();
    console.log(json);
  } catch (error: any) {
    throw error;
  }
}

export async function otpSend(_: any, formData: FormData) {
  const validatedFields = otpSendSchema.safeParse({
    phone: formData.get("phone"),
  });

  if (!validatedFields.success)
    return { success: false, errors: z.flattenError(validatedFields.error) };

  try {
    const expiredAt = await prisma.$transaction(async (tx) => {
      const otp = await tx.otp.findUnique({
        where: { receiver: validatedFields.data.phone },
      });

      const now = new Date();

      if (otp && otp.expiredAt > now) return otp.expiredAt;

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await sendOtpMessage(validatedFields.data.phone, code);

      const expiredAt = new Date(now.getTime() + 2 * 60 * 1000);
      await tx.otp.upsert({
        where: { receiver: validatedFields.data.phone },
        update: { code, expiredAt },
        create: {
          receiver: validatedFields.data.phone,
          code,
          expiredAt,
        },
      });

      return expiredAt;
    });

    return { success: true, data: { expiredAt } };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      errors: {
        fieldErrors: {},
        formErrors: [
          "خطایی رخ داده است، لطفا در زمان دیگری مجددا تلاش نمایید.",
        ],
      },
    };
  }
}
