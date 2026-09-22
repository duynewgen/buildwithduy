import { pageMetadata } from "@/lib/page-metadata";
import { BirthdayRoman } from "@/components/birthday-roman";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("birthday/roman")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/birthday/roman",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function BirthdayRomanPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      title={build.title}
      description={build.description}
      backHref="/birthday"
      contentClassName="max-w-3xl"
      creatorInline
      YearPicker={BirthdayRoman}
    >
      <BirthdayRoman />
    </BuildExperience>
  );
}
