import { NextResponse } from "next/server";
import { deployToken } from "../../_lib/appStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const symbol = typeof body.symbol === "string" ? body.symbol.trim() : "";

    if (!name || !symbol) {
      return NextResponse.json({ error: "name and symbol are required" }, { status: 400 });
    }

    const deployed = deployToken({
      name,
      symbol,
      description: typeof body.description === "string" ? body.description : "",
      logo: typeof body.logo === "string" ? body.logo : "",
      initialSupply: Number(body.initialSupply || 0),
    });

    return NextResponse.json({
      tokenId: deployed.tokenId,
      address: deployed.address,
      explorerUrl: deployed.explorerUrl,
      symbol: deployed.symbol,
      initialSupply: deployed.initialSupply,
    });
  } catch {
    return NextResponse.json({ error: "Failed to deploy token" }, { status: 500 });
  }
}
