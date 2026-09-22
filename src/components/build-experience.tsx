"use client";

import type { ComponentType, ReactNode } from "react";
import { BuildShell } from "@/components/build-shell";
import { CreatorMode } from "@/components/creator-mode";
import type { YearPickerProps } from "@/lib/creator";

type BuildExperienceProps = {
  creator: boolean;
  title: string;
  description: string;
  backHref?: string;
  contentClassName?: string;
  YearPicker: ComponentType<YearPickerProps>;
  /** select-based builds: year dropdown sits in the form (no modal) */
  creatorInline?: boolean;
  children: ReactNode;
};

/**
 * Normal build page, or creator filming mode when `?creator=true`.
 */
export function BuildExperience({
  creator,
  title,
  description,
  backHref = "/",
  contentClassName,
  YearPicker,
  creatorInline = false,
  children,
}: BuildExperienceProps) {
  if (creator) {
    return (
      <CreatorMode
        backHref={backHref}
        YearPicker={YearPicker}
        inlinePicker={creatorInline}
      />
    );
  }

  return (
    <BuildShell
      title={title}
      description={description}
      backHref={backHref}
      contentClassName={contentClassName}
    >
      {children}
    </BuildShell>
  );
}
