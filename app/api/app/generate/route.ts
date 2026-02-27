import { NextResponse } from "next/server";

const sanitize = (value: string): string => value.replace(/[<>]/g, "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const appType = typeof body.appType === "string" ? body.appType.trim() : "other";
    const tokenId =
      typeof body.tokenId === "string" && body.tokenId.trim() ? body.tokenId.trim() : "";

    if (!prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const title = sanitize(prompt).slice(0, 32) || "TAI App";
    const tokenHint = tokenId ? `<p>绑定代币：${sanitize(tokenId)}</p>` : "";
    const code = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      :root { --bg: #0a0a0c; --card: #111111; --border: #333333; --green: #00ff41; --gold: #ffd700; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: var(--bg); color: #fff; font-family: system-ui, sans-serif; }
      .card { width: min(560px, 92vw); border: 1px solid var(--border); border-radius: 16px; padding: 28px; background: var(--card); box-shadow: 0 0 24px rgba(0,255,65,.12); }
      h1 { margin: 0 0 8px; font-size: 28px; }
      p { color: #bbb; margin: 0 0 12px; }
      button { border: 0; border-radius: 10px; background: var(--green); color: #000; font-weight: 700; padding: 10px 16px; cursor: pointer; }
      small { color: #ffd700; display: block; margin-top: 10px; }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>${title}</h1>
      <p>应用类型：${sanitize(appType)}。以下是 AI 生成的初始版本，可继续微调。</p>
      ${tokenHint}
      <button>开始使用</button>
      <small>Prompt: ${sanitize(prompt).slice(0, 120)}</small>
    </main>
  </body>
</html>`;

    const previewUrl = `data:text/html;charset=utf-8,${encodeURIComponent(code)}`;
    return NextResponse.json({ code, previewUrl });
  } catch {
    return NextResponse.json({ error: "Failed to generate app" }, { status: 500 });
  }
}
