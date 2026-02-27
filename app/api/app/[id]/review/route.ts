import { NextResponse } from "next/server";
import { addOrUpdateReview } from "../../../_lib/appStore";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const rating = Number(body.rating);
    const comment = typeof body.comment === "string" ? body.comment : "";
    const userId = typeof body.userId === "string" ? body.userId : "anonymous";

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "rating must be 1-5" }, { status: 400 });
    }

    const review = addOrUpdateReview({
      appId: params.id,
      userId,
      rating,
      comment,
    });
    return NextResponse.json({ success: true, review });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit review";
    const status = /not found/i.test(message) ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
