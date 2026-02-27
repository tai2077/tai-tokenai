import AppDetail from "../../../src/pages/AppDetail";

export default function AppDetailPage({
    params,
}: {
    params: { id: string };
}) {
    return <AppDetail id={params.id} />;
}
