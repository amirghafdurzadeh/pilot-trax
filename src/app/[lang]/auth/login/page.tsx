import { LoginForm } from "@/components/auth/login/form";
import { LoginProvider } from "@/context/login";
import { getDictionary } from "@/lib/dictionaries";

export default async function Page(props: PageProps<"/[lang]/auth/login">) {
  const lang = (await props.params).lang;
  const dict = await getDictionary(lang);
  return (
    <LoginProvider>
      <main className="flex-1 flex p-4 pb-20">
        <LoginForm lang={lang} dict={dict.login} />
      </main>
    </LoginProvider>
  );
}
