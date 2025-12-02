"use server";

import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { readSession } from "@/lib/session";

type Args = Readonly<{
  redirectUrl?: string | null;
  permission?: string | string[];
}>;

export async function needAuthAction(args?: Args) {
  const session = await readSession();
  if (!session) return redirect("/login");
  if (!args?.permission || args?.permission.length === 0) return;

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

  const requiredPermissions = Array.isArray(args.permission)
    ? args.permission
    : [args.permission];
  const userPermissions = user.roles.flatMap((r) =>
    r.role.permissions.map((p) => p.permissionId)
  );
}
