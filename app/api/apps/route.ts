import { NextResponse } from "next/server";
import { listApps } from "../_lib/appStore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "all";
    const sort = searchParams.get("sort") || "hot";
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "20");

    const result = listApps({ category, sort, page, limit });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to list apps" }, { status: 500 });
  }
}
