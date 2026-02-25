import dynamic from "next/dynamic";
import { RouteFallback } from "../../src/components/RouteFallback";

const Ops = dynamic(() => import("../../src/pages/Ops"), {
  loading: () => <RouteFallback label="Loading ops center..." />,
});

export default function OpsPage() {
  return <Ops />;
}
