import { NextResponse } from "next/server";
import { recordAppUsage, type AppUsageAction } from "../../../_lib/appStore";

const isAction = (value: string): value is AppUsageAction =>
  value === "open" || value === "interact" || value === "pay";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => ({}));
    const actionRaw = typeof body.action === "string" ? body.action : "open";
    const action: AppUsageAction = isAction(actionRaw) ? actionRaw : "open";
    const userId = typeof body.userId === "string" ? body.userId : "anonymous";
    const amount = typeof body.amount === "number" ? body.amount : 0;

    recordAppUsage({ appId: params.id, userId, action, amount });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to record app usage";
    const status = /not found/i.test(message) ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
