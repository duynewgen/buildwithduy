import { pageMetadata } from "@/lib/page-metadata";
import { BirthdayPlinko } from "@/components/birthday-plinko";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("form/drop-the-cake")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/form/drop-the-cake",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function BirthdayDropTheCakePage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      title={build.title}
      description={build.description}
      backHref="/form"
      contentClassName="max-w-2xl"
      prompt="age"
      YearPicker={BirthdayPlinko}
    >
      <BirthdayPlinko />
    </BuildExperience>
  );
}
