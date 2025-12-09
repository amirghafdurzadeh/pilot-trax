import { AuthProvider } from "@/context/auth";
import { LoginProvider } from "@/context/login";
import { ThemeProvider } from "./theme-provider";

type Props = Readonly<{
  children?: React.ReactNode;
}>;

export function Providers(props: Props) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <LoginProvider>{props.children}</LoginProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
