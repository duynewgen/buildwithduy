import type { Metadata } from "next";
import { BirthdayLottery } from "@/components/birthday-lottery";
import { BuildShell } from "@/components/build-shell";
import { getBuildByPath } from "@/lib/builds";

const build = getBuildByPath("birthday/lottery")!;

export const metadata: Metadata = {
  title: build.title,
  description: build.description,
};

export default function BirthdayLotteryPage() {
  return (
    <BuildShell
      title={build.title}
      description={build.description}
      backHref="/birthday"
      contentClassName="max-w-3xl"
    >
      <BirthdayLottery />
    </BuildShell>
  );
}
