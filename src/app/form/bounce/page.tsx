import { pageMetadata } from "@/lib/page-metadata";
import { BirthdayBounce } from "@/components/birthday-bounce";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("form/bounce")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/form/bounce",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function BirthdayBouncePage({
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
      YearPicker={BirthdayBounce}
    >
      <BirthdayBounce />
    </BuildExperience>
  );
}
