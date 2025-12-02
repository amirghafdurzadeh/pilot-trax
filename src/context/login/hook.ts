import { useContext } from "react";

import { LoginContext } from "./context";

export function useLogin() {
  const ctx = useContext(LoginContext);
  if (!ctx) throw new Error("useLogin must be used inside LoginProvider");
  return ctx;
}
