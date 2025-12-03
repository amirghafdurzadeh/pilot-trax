"use client";
import { createContext } from "react";
import { LoginContextType } from "./types";

export const LoginContext = createContext<LoginContextType | undefined>(
  undefined
);
