"use client";
import { AuthContext } from "./context";
import { AuthProviderProps } from "./types";

export function AuthProvider(props: AuthProviderProps) {
  return (
    <AuthContext.Provider value={{}}>{props.children}</AuthContext.Provider>
  );
}
