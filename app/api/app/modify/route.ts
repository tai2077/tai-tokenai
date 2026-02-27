import { NextResponse } from "next/server";

const sanitize = (value: string): string => value.replace(/[<>]/g, "");

const patchCode = (code: string, instruction: string): string => {
  const lowered = instruction.toLowerCase();
  let nextCode = code;

  if (lowered.includes("黑") || lowered.includes("black")) {
    nextCode = nextCode.replace(/background:\s*[^;]+;/i, "background: #000000;");
  }
  if (lowered.includes("霓虹绿") || lowered.includes("green")) {
    nextCode = nextCode.replace(/#00ff41/gi, "#00FF41");
  }
  if (lowered.includes("按钮") || lowered.includes("button")) {
    nextCode = nextCode.replace(/<button([^>]*)>/i, "<button$1 style=\"box-shadow:0 0 18px rgba(0,255,65,.35)\">");
  }

  const note = `<p style="margin-top:14px;color:#FFD700;font-size:12px">AI Adjustment: ${sanitize(instruction).slice(0, 120)}</p>`;
  if (nextCode.includes("</body>")) {
    return nextCode.replace("</body>", `${note}</body>`);
  }
  return `${nextCode}\n${note}`;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const currentCode = typeof body.currentCode === "string" ? body.currentCode : "";
    const modification = typeof body.modification === "string" ? body.modification.trim() : "";

    if (!currentCode) {
      return NextResponse.json({ error: "currentCode is required" }, { status: 400 });
    }
    if (!modification) {
      return NextResponse.json({ error: "modification is required" }, { status: 400 });
    }

    const code = patchCode(currentCode, modification);
    const previewUrl = `data:text/html;charset=utf-8,${encodeURIComponent(code)}`;
    return NextResponse.json({ code, previewUrl });
  } catch {
    return NextResponse.json({ error: "Failed to modify app" }, { status: 500 });
  }
}
