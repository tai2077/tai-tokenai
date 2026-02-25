import dynamic from "next/dynamic";
import { RouteFallback } from "../../src/components/RouteFallback";

const Trade = dynamic(() => import("../../src/pages/Trade"), {
  loading: () => <RouteFallback label="Loading trade module..." />,
});

export default function TradePage() {
  return <Trade />;
}
