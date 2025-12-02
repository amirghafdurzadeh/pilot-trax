import { LoginForm } from "@/components/login/form";
import { LoginProvider } from "@/context/login";

export default function Page() {
  return (
    <LoginProvider>
      <main className="flex-1 flex p-4 pb-20">
        <LoginForm />
      </main>
    </LoginProvider>
  );
}
