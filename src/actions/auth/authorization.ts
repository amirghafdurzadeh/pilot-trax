"use server";

type Args = Readonly<{
  permissions?: null | string | string[];
}>;

export async function authorization(args?: Args) {}
