import { LoginForm } from "@/components/auth/login/form";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";
import { LoginProvider } from "@/context/login";

export default async function Page(props: PageProps<"/[lang]/auth/login">) {
  const lang = (await props.params).lang as Locale;
  const dict = await getDictionary(lang);
  return (
    <LoginProvider>
      <main className="flex-1 flex p-4 pb-20">
        <LoginForm lang={lang} dict={dict.login} />
      </main>
    </LoginProvider>
  );
}
