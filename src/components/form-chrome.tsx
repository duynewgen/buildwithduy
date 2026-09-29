"use client";

import { creatorFieldSelectClassName } from "@/lib/creator";

export function useCreatorFieldClass() {
  return creatorFieldSelectClassName;
}

/** Empty birthyear copy is lighter than a chosen year. */
export function useCreatorFieldTextClass(empty: boolean) {
  return empty ? "text-[#80868b]" : "text-[#202124]";
}
