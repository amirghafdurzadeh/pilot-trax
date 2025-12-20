"use server";

import prisma from "@/lib/prisma";

type UsersGrowth = {
  month: string;
  users: number;
};

export async function getUsersGrowth() {
  const data: UsersGrowth[] = [];
  const now = new Date();

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
      month: startOfMonth.toLocaleString("fa-IR", {
        month: "long",
      }),
      users: users,
    });
  }

  return data;
}
