import { pageMetadata } from "@/lib/page-metadata";
import { BirthdaySliders } from "@/components/birthday-sliders";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("birthday/slider")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/birthday/slider",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function BirthdaySliderPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      title={build.title}
      description={build.description}
      backHref="/birthday"
      YearPicker={BirthdaySliders}
    >
      <BirthdaySliders />
    </BuildExperience>
  );
}
