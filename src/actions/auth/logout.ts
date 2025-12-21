"use server";

import { deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function logout(lang: string) {
  await deleteSession();
  redirect(`/${lang}`);
}
