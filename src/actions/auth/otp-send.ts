"use server";
import z from "zod";

import prisma from "@/lib/prisma";

const otpSendSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/, "Phone number is invalid."),
});

export async function otpSendAction(_: any, formData: FormData) {
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

      // TODO: send otp message

      return expiredAt;
    });

    return { success: true, data: { expiredAt } };
  } catch (error) {
    return {
      success: false,
      errors: {
        fieldErrors: {},
        formErrors: ["Something went wrong, please try again later."],
      },
    };
  }
}
