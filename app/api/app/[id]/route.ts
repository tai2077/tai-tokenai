import { NextResponse } from "next/server";
import { getAppById } from "../../_lib/appStore";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const app = getAppById(params.id);
    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }
    return NextResponse.json(app);
  } catch {
    return NextResponse.json({ error: "Failed to fetch app details" }, { status: 500 });
  }
}
