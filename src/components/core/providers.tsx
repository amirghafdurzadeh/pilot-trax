import { AuthProvider } from "@/context/auth";
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
        {props.children}
      </ThemeProvider>
    </AuthProvider>
  );
}
