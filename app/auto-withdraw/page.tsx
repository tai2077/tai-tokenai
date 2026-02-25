import dynamic from "next/dynamic";
import { RouteFallback } from "../../src/components/RouteFallback";

const AutoWithdraw = dynamic(() => import("../../src/pages/AutoWithdraw"), {
  loading: () => <RouteFallback label="Loading auto-withdraw settings..." />,
});

export default function AutoWithdrawPage() {
  return <AutoWithdraw />;
}
