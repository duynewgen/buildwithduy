import { pageMetadata } from "@/lib/page-metadata";
import { BirthdayWords } from "@/components/birthday-words";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("form/words")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/form/words",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function BirthdayWordsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      title={build.title}
      description={build.description}
      backHref="/form"
      contentClassName="max-w-3xl"
      creatorInline
      YearPicker={BirthdayWords}
    >
      <BirthdayWords />
    </BuildExperience>
  );
}
