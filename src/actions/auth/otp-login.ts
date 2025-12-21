"use server";
import z from "zod";

import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";

import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";

export async function otpLogin(lang: Locale, _: any, formData: FormData) {
  const dictionary = await getDictionary(lang);
  const otpLoginSchema = z.object({
    phone: z.string().regex(/^09\d{9}$/, dictionary.v_otp_login.phone_invalid),
    otp: z.string().regex(/^\d{6}$/, dictionary.v_otp_login.otp_invalid),
    redirectURL: z.string().optional(),
  });
  const validatedFields = otpLoginSchema.safeParse({
    phone: formData.get("phone"),
    otp: formData.get("otp"),
    redirectURL: formData.get("redirectURL"),
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
        formErrors: [dictionary.e_login_failed],
      },
    };

  try {
    await createSession(user);
  } catch (error) {
    return {
      success: false,
      errors: {
        fieldErrors: {},
        formErrors: [dictionary.e_something_went_wrong],
      },
    };
  }

  const redirectURL =
    !user.firstName || !user.lastName
      ? `/${lang}/auth/complete-profile`
      : validatedFields.data.redirectURL;

  return {
    success: true,
    data: { redirectURL },
  };
}
