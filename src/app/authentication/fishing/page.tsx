import { pageMetadata } from "@/lib/page-metadata";
import { AuthFishing } from "@/components/auth-fishing";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("authentication/fishing")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/authentication/fishing",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function AuthenticationFishingPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      creatorSame
      title={build.title}
      description={build.description}
      backHref="/authentication"
      contentClassName="max-w-lg"
    >
      <AuthFishing />
    </BuildExperience>
  );
}
