import { NextResponse } from "next/server";
import { registerDomain, type DomainType } from "../../_lib/appStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name : "";
    const type: DomainType = body.type === "premium" ? "premium" : "free";
    const ownerId = typeof body.ownerId === "string" ? body.ownerId : "me";

    if (!name.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const created = registerDomain({ name, type, ownerId });
    return NextResponse.json({
      domain: `${created.name}.tai.lat`,
      expiresAt: created.expiresAt,
      pricePaid: created.pricePaid,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed";
    const status = /unavailable|reserved|taken|required/i.test(message) ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
