import dynamic from "next/dynamic";
import { RouteFallback } from "../../src/components/RouteFallback";

const C2C = dynamic(() => import("../../src/pages/C2C"), {
  loading: () => <RouteFallback label="Loading C2C market..." />,
});

export default function C2CPage() {
  return <C2C />;
}
