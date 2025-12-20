import { LoginForm } from "@/components/login/form";
import { getDictionary, Locale } from "@/lib/dictionaries";
import { LoginProvider } from "@/context/login";

export default async function Page(props: PageProps<"/[lang]/login">) {
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
