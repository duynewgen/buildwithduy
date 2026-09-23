import { pageMetadata } from "@/lib/page-metadata";
import { AuthPayToProve } from "@/components/auth-pay-to-prove";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("authentication/pay-to-prove")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/authentication/pay-to-prove",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function AuthenticationPayToProvePage({
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
      <AuthPayToProve />
    </BuildExperience>
  );
}
