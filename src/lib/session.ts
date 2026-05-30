import "server-only";

import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import { User } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";


const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: User & JWTPayload) {
  if (!payload.exp) throw new Error("The 'expiredAt' argument is missing.");
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify<User>(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function createSession(payload: User) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const exp = Math.floor(expires.getTime() / 1000);
  const session = await encrypt({ ...payload, exp });
  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: false, // TODO: make it true in production
    expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function readSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  return payload;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getUserRole(userId: string): Promise<"admin" | "premium" | null> {
  const userRoles = await prisma.userRole.findMany({
    where: { userId },
    select: { roleId: true },
  });
  const roleIds = userRoles.map((ur) => ur.roleId);
  if (roleIds.includes("admin")) return "admin";
  if (roleIds.includes("premium")) return "premium";
  return null;
}

