import dynamic from "next/dynamic";
import { RouteFallback } from "../../src/components/RouteFallback";

const Market = dynamic(() => import("../../src/pages/Market"), {
  loading: () => <RouteFallback label="Loading market..." />,
});

export default function MarketPage() {
  return <Market />;
}
