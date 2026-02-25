import dynamic from "next/dynamic";
import { RouteFallback } from "../../src/components/RouteFallback";

const Profile = dynamic(() => import("../../src/pages/Profile"), {
  loading: () => <RouteFallback label="Loading profile..." />,
});

export default function ProfilePage() {
  return <Profile />;
}
