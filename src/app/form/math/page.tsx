import { pageMetadata } from "@/lib/page-metadata";
import { BirthdayMath } from "@/components/birthday-math";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("birthday/math")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/birthday/math",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function BirthdayMathPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      title={build.title}
      description={build.description}
      backHref="/birthday"
      contentClassName="max-w-3xl"
      creatorInline
      YearPicker={BirthdayMath}
    >
      <BirthdayMath />
    </BuildExperience>
  );
}
