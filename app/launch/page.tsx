import dynamic from "next/dynamic";
import { RouteFallback } from "../../src/components/RouteFallback";

const Launch = dynamic(() => import("../../src/pages/Launch"), {
  loading: () => <RouteFallback label="Loading launch terminal..." />,
});

export default function LaunchPage() {
  return <Launch />;
}
