"use client";

import { BirthdayClick } from "@/components/birthday-click";
import type { YearPickerProps } from "@/lib/creator";

/** Same mash timer as click, but counts down from max → 0. */
export function BirthdayClickTwo(props: YearPickerProps) {
  return <BirthdayClick {...props} direction="down" />;
}
