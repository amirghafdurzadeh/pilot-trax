"use server";

import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { readSession } from "@/lib/session";

export async function needAuthAction(permission?: string | string[]) {
  const session = await readSession();
  if (!session) return redirect("/login");
  if (!permission || permission.length === 0) return;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      roles: {
        select: {
          role: {
            select: {
              permissions: { select: { permissionId: true } },
            },
          },
        },
      },
    },
  });
  if (!user) return redirect("/login");

  const requiredPermissions = Array.isArray(permission)
    ? permission
    : [permission];
  const userPermissions = user.roles.flatMap((r) =>
    r.role.permissions.map((p) => p.permissionId)
  );
}
