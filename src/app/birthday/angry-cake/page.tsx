import type { Metadata } from "next";
import { BirthdayAngryCake } from "@/components/birthday-angry-cake";
import { BuildShell } from "@/components/build-shell";
import { getBuildByPath } from "@/lib/builds";

const build = getBuildByPath("birthday/angry-cake")!;

export const metadata: Metadata = {
  title: build.title,
  description: build.description,
};

export default function BirthdayAngryCakePage() {
  return (
    <BuildShell
      title={build.title}
      description={build.description}
      backHref="/birthday"
      contentClassName="max-w-5xl"
    >
      <BirthdayAngryCake />
    </BuildShell>
  );
}
