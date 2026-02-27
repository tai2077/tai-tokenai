import Ops from "../../src/pages/Ops";
import { redirect } from "next/navigation";
import { isPixelOpsEnabled } from "../../src/lib/featureFlags";

export default function OpsPage() {
  if (isPixelOpsEnabled()) {
    redirect("/c2c/office");
  }

  return <Ops />;
}
