import { NextResponse } from "next/server";
import { createPublishedApp, type AppCategory, type DomainType } from "../../_lib/appStore";

const VALID_CATEGORIES: AppCategory[] = [
  "lottery",
  "vote",
  "game",
  "tool",
  "display",
  "other",
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const code = typeof body.code === "string" ? body.code : "";
    const subdomain = typeof body.subdomain === "string" ? body.subdomain.trim() : "";
    const categoryRaw = typeof body.category === "string" ? body.category : "other";
    const category: AppCategory = VALID_CATEGORIES.includes(categoryRaw as AppCategory)
      ? (categoryRaw as AppCategory)
      : "other";
    const domainType: DomainType =
      body.domainType === "premium" || body.domainType === "free" ? body.domainType : "free";

    if (!code) {
      return NextResponse.json({ error: "code is required" }, { status: 400 });
    }
    if (!subdomain) {
      return NextResponse.json({ error: "subdomain is required" }, { status: 400 });
    }

    const result = createPublishedApp({
      name: typeof body.name === "string" ? body.name : subdomain,
      description: typeof body.description === "string" ? body.description : "",
      category,
      code,
      subdomain,
      domainType,
      tokenId: typeof body.tokenId === "string" ? body.tokenId : undefined,
      icon: typeof body.icon === "string" ? body.icon : "📱",
    });

    return NextResponse.json({
      appId: result.appId,
      url: result.url,
      app: result.app,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to publish app";
    const status = /domain/i.test(message) ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
