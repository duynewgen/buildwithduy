"use client";

import { createContext, useContext } from "react";
import {
  basicFieldSelectClassName,
  creatorFieldSelectClassName,
  type FormShell,
} from "@/lib/creator";

export type { FormShell };

const FormChromeContext = createContext<FormShell>("google");

export function FormChromeProvider({
  shell,
  children,
}: {
  shell: FormShell;
  children: React.ReactNode;
}) {
  return (
    <FormChromeContext.Provider value={shell}>
      {children}
    </FormChromeContext.Provider>
  );
}

export function useCreatorFieldClass() {
  const shell = useContext(FormChromeContext);
  return shell === "basic"
    ? basicFieldSelectClassName
    : creatorFieldSelectClassName;
}

/** Empty birthyear copy is lighter than a chosen year. */
export function useCreatorFieldTextClass(empty: boolean) {
  const shell = useContext(FormChromeContext);
  if (shell === "basic") return empty ? "text-zinc-400" : "text-zinc-900";
  return empty ? "text-[#80868b]" : "text-[#202124]";
}
