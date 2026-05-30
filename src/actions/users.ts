"use server";

import { revalidatePath } from "next/cache";
import z from "zod";

import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";
import prisma from "@/lib/prisma";
import { createSession, readSession, getUserRole } from "@/lib/session";


type UsersGrowth = {
  month: string;
  users: number;
};

export async function getUsersGrowth(lang: Locale) {
  const data: UsersGrowth[] = [];
  const now = new Date();
  const locale = lang === "fa" ? "fa-IR" : "en-US";

  for (let i = 0; i < 12; i++) {
    const startOfMonth = new Date();
    startOfMonth.setMonth(now.getMonth() - (12 - (i + 1)));
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(now.getMonth() - (11 - (i + 1)));
    endOfMonth.setDate(1);
    endOfMonth.setHours(0, 0, 0, 0);

    const users = await prisma.user.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
      },
    });

    data.push({
      month: startOfMonth.toLocaleString(locale, {
        month: "long",
      }),
      users: users,
    });
  }

  return data;
}

export async function updateUserProfile(
  lang: Locale,
  _: any,
  formData: FormData
) {
  const dictionary = await getDictionary(lang);
  const user = await readSession();
  if (!user) {
    return {
      success: false,
      errors: {
        fieldErrors: {},
        formErrors: [dictionary.e_unauthorized],
      },
    };
  }

  const userProfileSchema = z.object({
    firstName: z.string().min(2, dictionary.v_update_profile.first_name_min),
    lastName: z.string().min(2, dictionary.v_update_profile.last_name_min),
    redirectURL: z.string().optional(),
  });

  const validatedFields = userProfileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    redirectURL: formData.get("redirectURL"),
  });

  if (!validatedFields.success) {
    return { success: false, errors: z.flattenError(validatedFields.error) };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: validatedFields.data.firstName,
        lastName: validatedFields.data.lastName,
      },
    });
    await createSession(updatedUser);
  } catch (error) {
    return {
      success: false,
      errors: {
        fieldErrors: {},
        formErrors: [dictionary.e_something_went_wrong],
      },
    };
  }

  revalidatePath(`/${lang}/app`);

  return {
    success: true,
    data: { redirectURL: validatedFields.data.redirectURL },
  };
}

export async function getAllUsersAction(query?: string) {
  const currentUser = await readSession();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }
  const currentRole = await getUserRole(currentUser.id);
  if (currentRole !== "admin" && currentRole !== "system_user") {
    throw new Error("Unauthorized");
  }

  const users = await prisma.user.findMany({
    where: query
      ? {
          OR: [
            { phone: { contains: query, mode: "insensitive" } },
            { firstName: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: {
      userRoles: {
        select: {
          roleId: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return users.map((user) => ({
    ...user,
    roles: user.userRoles.map((ur) => ur.roleId),
  }));
}

export async function updateUserRoleAction(
  targetUserId: string,
  roleId: "admin" | "premium",
  action: "add" | "remove",
  lang: string
) {
  const currentUser = await readSession();
  if (!currentUser) {
    throw new Error("Unauthorized");
  }
  const currentRole = await getUserRole(currentUser.id);
  if (currentRole !== "admin" && currentRole !== "system_user") {
    throw new Error("Unauthorized");
  }

  // Only system_user can manage admin roles
  if (roleId === "admin" && currentRole !== "system_user") {
    throw new Error("Only system user can manage admin roles");
  }

  // Prevent system_user from revoking their own system_user access
  if (currentUser.id === targetUserId && roleId === "admin" && action === "remove") {
    throw new Error("Cannot revoke your own admin permissions");
  }

  if (action === "add") {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: targetUserId,
          roleId,
        },
      },
      create: {
        userId: targetUserId,
        roleId,
      },
      update: {},
    });
  } else {
    try {
      await prisma.userRole.delete({
        where: {
          userId_roleId: {
            userId: targetUserId,
            roleId,
          },
        },
      });
    } catch (e) {
      // Ignore if record already doesn't exist
    }
  }

  revalidatePath(`/${lang}/app/users`);
  return { success: true };
}

