import { NextResponse } from "next/server";
import { searchApps } from "../../_lib/appStore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    if (!q.trim()) {
      return NextResponse.json({ apps: [] });
    }
    return NextResponse.json({ apps: searchApps(q) });
  } catch {
    return NextResponse.json({ error: "Failed to search apps" }, { status: 500 });
  }
}
