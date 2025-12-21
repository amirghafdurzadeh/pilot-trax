"use server";

import { redirect } from "next/navigation";

import { readSession } from "@/lib/session";

export async function authentication(lang: string) {
  const session = await readSession();
  if (!session) redirect(`/${lang}/login`);
  return session;
}
