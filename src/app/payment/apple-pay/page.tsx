import { pageMetadata } from "@/lib/page-metadata";
import { PaymentApplePay } from "@/components/payment-apple-pay";
import { BuildExperience } from "@/components/build-experience";
import { getBuildByPath } from "@/lib/builds";
import { isCreatorMode } from "@/lib/creator";

const build = getBuildByPath("payment/apple-pay")!;

export const metadata = pageMetadata({
  title: build.title,
  description: build.description,
  path: "/payment/apple-pay",
});

type PageProps = {
  searchParams: Promise<{ creator?: string | string[] }>;
};

export default async function PaymentApplePayPage({
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
      <PaymentApplePay />
    </BuildExperience>
  );
}
