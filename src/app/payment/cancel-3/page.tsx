import { pageMetadata } from "@/lib/page-metadata";
import { PaymentCancelThree } from "@/components/payment-cancel-three";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("payment/cancel-3")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/payment/cancel-3",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function PaymentCancelThreePage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  return (
    <BuildExperience
      creator={isCreatorMode(params.creator)}
      creatorSame
      title={build.title}
      description={build.description}
      backHref="/payment"
      contentClassName="max-w-lg"
    >
      <PaymentCancelThree />
    </BuildExperience>
  );
}
