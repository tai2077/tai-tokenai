import dynamic from "next/dynamic";
import { RouteFallback } from "../../../../src/components/RouteFallback";

const C2COrderDetail = dynamic(() => import("../../../../src/pages/C2COrderDetail"), {
  loading: () => <RouteFallback label="Loading order detail..." />,
});

export default function C2COrderDetailPage() {
  return <C2COrderDetail />;
}
