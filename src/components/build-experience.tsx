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
  /** birthday-style year picker; omit when creator uses the same UI as normal */
  YearPicker?: ComponentType<YearPickerProps>;
  /** select-based builds: year dropdown sits in the form (no modal) */
  creatorInline?: boolean;
  /**
   * creator mode shows the same build as normal (no interest form),
   * only hides title/description for filming.
   */
  creatorSame?: boolean;
  children: ReactNode;
};

/**
 * Form builds with a YearPicker use the interest form and a year-only picker.
 * `?creator=true` adds the start-year filming control.
 * Other builds use BuildShell; creatorSame hides the title for filming.
 */
export function BuildExperience({
  creator,
  title,
  description,
  backHref = "/",
  contentClassName,
  YearPicker,
  creatorInline = false,
  creatorSame = false,
  children,
}: BuildExperienceProps) {
  if (creator && creatorSame) {
    return (
      <BuildShell
        title={title}
        description={description}
        backHref={backHref}
        contentClassName={contentClassName}
        filming
      >
        {children}
      </BuildShell>
    );
  }

  if (YearPicker) {
    return (
      <CreatorMode
        backHref={backHref}
        YearPicker={YearPicker}
        inlinePicker={creatorInline}
        showStartYear={creator}
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
