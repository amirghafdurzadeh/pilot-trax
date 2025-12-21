"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useActionState, useEffect, useMemo } from "react";

import { updateUserProfile } from "@/actions/users";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";

type Dict = Awaited<ReturnType<typeof getDictionary>>["complete_profile"];

export function CompleteProfileForm({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dict;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateUserProfileWithLang = updateUserProfile.bind(null, lang);
  const [updateState, updateAction, updatePending] = useActionState(
    updateUserProfileWithLang,
    null
  );

  const errors = useMemo(
    () => [
      ...(updateState?.errors?.formErrors ?? []),
      ...Object.values(updateState?.errors?.fieldErrors ?? {}).flat(),
    ],
    [updateState]
  );

  useEffect(() => {
    if (!updateState?.success) return;
    const redirect = updateState.data!.redirectURL;
    router.replace(redirect || `/${lang}/app`);
  }, [updateState, searchParams]);

  return (
    <Card className="max-w-sm w-full m-auto">
      <CardHeader>
        <CardTitle>{dict.title}</CardTitle>
        <CardDescription>{dict.description}</CardDescription>
      </CardHeader>
      <form id="completeProfileForm" action={updateAction}>
        <CardContent className="flex flex-col gap-4">
          <input type="hidden" name="redirectURL" value={`/${lang}/app`} />
          <Field>
            <FieldLabel htmlFor="firstName">{dict.firstName_label}</FieldLabel>
            <Input
              id="firstName"
              name="firstName"
              placeholder={dict.firstName_placeholder}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="lastName">{dict.lastName_label}</FieldLabel>
            <Input
              id="lastName"
              name="lastName"
              placeholder={dict.lastName_placeholder}
            />
          </Field>
          <div className="flex flex-col gap-2">
            {errors.map((error, index) => (
              <FieldError key={index}>{error}</FieldError>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            type="submit"
            form="completeProfileForm"
            disabled={updatePending}
            className="w-full"
          >
            {updatePending && <Spinner />}
            {updatePending ? dict.saving_button : dict.save_button}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => router.replace(`/${lang}/app`)}
          >
            {dict.skip_button}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
