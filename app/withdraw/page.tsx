import dynamic from "next/dynamic";
import { RouteFallback } from "../../src/components/RouteFallback";

const Withdraw = dynamic(() => import("../../src/pages/Withdraw"), {
  loading: () => <RouteFallback label="Loading withdraw flow..." />,
});

export default function WithdrawPage() {
  return <Withdraw />;
}
