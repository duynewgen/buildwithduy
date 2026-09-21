import type { Metadata } from "next";
import { BirthdayAngryCake } from "@/components/birthday-angry-cake";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("birthday/angry-cake")!;

export const metadata: Metadata = {
  title: build.title,
  description: build.description,
};

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function BirthdayAngryCakePage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      title={build.title}
      description={build.description}
      backHref="/birthday"
      contentClassName="max-w-5xl"
      YearPicker={BirthdayAngryCake}
    >
      <BirthdayAngryCake />
    </BuildExperience>
  );
}
