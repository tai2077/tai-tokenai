import dynamic from "next/dynamic";
import { RouteFallback } from "../../src/components/RouteFallback";

const Deposit = dynamic(() => import("../../src/pages/Deposit"), {
  loading: () => <RouteFallback label="Loading deposit flow..." />,
});

export default function DepositPage() {
  return <Deposit />;
}
