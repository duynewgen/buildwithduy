import type { Metadata } from "next";
import { BirthdayBounce } from "@/components/birthday-bounce";
import { BuildShell } from "@/components/build-shell";
import { getBuildByPath } from "@/lib/builds";

const build = getBuildByPath("birthday/bounce")!;

export const metadata: Metadata = {
  title: build.title,
  description: build.description,
};

export default function BirthdayBouncePage() {
  return (
    <BuildShell
      title={build.title}
      description={build.description}
      backHref="/birthday"
      contentClassName="max-w-2xl"
    >
      <BirthdayBounce />
    </BuildShell>
  );
}
