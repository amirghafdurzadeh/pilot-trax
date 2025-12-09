"use server";

import { redirect } from "next/navigation";

import { readSession } from "@/lib/session";

export async function authentication() {
  const session = await readSession();
  if (!session) redirect("/login");
  return session;
}
