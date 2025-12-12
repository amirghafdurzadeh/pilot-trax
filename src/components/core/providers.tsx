"use client";
import { Direction } from "radix-ui";
import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "./theme-provider";

type Props = Readonly<{
  children?: React.ReactNode;
}>;

export function Providers(props: Props) {
  return (
    <Direction.Provider dir="rtl">
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
    </Direction.Provider>
  );
}
