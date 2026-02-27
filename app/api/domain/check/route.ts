import { NextResponse } from "next/server";
import { checkDomainAvailability, type DomainType } from "../../_lib/appStore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const type: DomainType =
      searchParams.get("type") === "premium" ? "premium" : "free";

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const result = checkDomainAvailability(name, type);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Check failed" }, { status: 500 });
  }
}
