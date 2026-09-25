import { pageMetadata } from "@/lib/page-metadata";
import { BirthdayLottery } from "@/components/birthday-lottery";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("birthday/lottery")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/birthday/lottery",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function BirthdayLotteryPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      title={build.title}
      description={build.description}
      backHref="/birthday"
      contentClassName="max-w-3xl"
      YearPicker={BirthdayLottery}
    >
      <BirthdayLottery />
    </BuildExperience>
  );
}
