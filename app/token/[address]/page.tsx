import dynamic from "next/dynamic";
import { RouteFallback } from "../../../src/components/RouteFallback";

const TokenDetail = dynamic(() => import("../../../src/pages/TokenDetail"), {
  loading: () => <RouteFallback label="Loading token detail..." />,
});

export default function TokenDetailPage() {
  return <TokenDetail />;
}
