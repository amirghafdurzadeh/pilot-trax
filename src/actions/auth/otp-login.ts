"use server";
import z from "zod";

import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";

const otpLoginSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل نامعتبر است."),
  otp: z.string().regex(/^\d{6}$/, "کد وارد شده نامعتبر است."),
});

export async function otpLogin(_: any, formData: FormData) {
  const validatedFields = otpLoginSchema.safeParse({
    phone: formData.get("phone"),
    otp: formData.get("otp"),
  });

  if (!validatedFields.success)
    return { success: false, errors: z.flattenError(validatedFields.error) };

  const user = await prisma.$transaction(async (tx) => {
    const now = new Date();
    const otp = await tx.otp.findFirst({
      where: {
        AND: [
          { receiver: validatedFields.data.phone },
          { code: validatedFields.data.otp },
          { expiredAt: { gt: now } },
        ],
      },
    });
    if (!otp) return null;

    await tx.otp.update({
      where: { receiver: otp.receiver },
      data: { expiredAt: now },
    });

    const user = await tx.user.findUnique({
      where: {
        phone: validatedFields.data.phone,
      },
    });
    if (user) return user;

    return await tx.user.create({
      data: {
        phone: validatedFields.data.phone,
      },
    });
  });

  if (!user)
    return {
      success: false,
      errors: {
        fieldErrors: {},
        formErrors: [
          "ورود ناموفق بود. لطفا اطلاعات خود را بررسی کنید و دوباره تلاش کنید.",
        ],
      },
    };

  try {
    await createSession(user);
  } catch (error) {
    return {
      success: false,
      errors: {
        fieldErrors: {},
        formErrors: ["مشکلی پیش آمد، لطفا بعدا تلاش کنید.", error],
      },
    };
  }

  return { success: true, data: null };
}
