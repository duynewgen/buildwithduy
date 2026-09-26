import { pageMetadata } from "@/lib/page-metadata";
import { BirthdayWheel } from "@/components/birthday-wheel";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("form/wheel-of-fortune")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/form/wheel-of-fortune",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function FormWheelPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      title={build.title}
      description={build.description}
      backHref="/form"
      contentClassName="max-w-lg"
      prompt="age"
      YearPicker={BirthdayWheel}
    >
      <BirthdayWheel />
    </BuildExperience>
  );
}
