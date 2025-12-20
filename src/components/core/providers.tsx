"use client";
import { Direction } from "radix-ui";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "./theme-provider";

type Props = Readonly<{
  dir: "ltr" | "rtl";
  children?: React.ReactNode;
}>;

export function Providers(props: Props) {
  return (
    <Direction.Provider dir={props.dir}>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {props.children}
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </Direction.Provider>
  );
}
