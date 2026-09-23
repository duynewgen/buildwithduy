import { pageMetadata } from "@/lib/page-metadata";
import { AuthOtp } from "@/components/auth-otp";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("authentication/otp-hint")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/authentication/otp-hint",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function AuthenticationOtpHintPage({
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
      <AuthOtp />
    </BuildExperience>
  );
}
