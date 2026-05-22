import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const provided = new URL(request.url).searchParams.get("secret") ?? request.headers.get("x-cron-secret");

  if (secret && provided !== secret) {
    return NextResponse.json({ ok: false, error: "Unauthorized refresh request" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    message: "Refresh endpoint is configured. Run the Python pipeline in GitHub Actions or a server job for persistent snapshots.",
    updatedAt: new Date().toISOString()
  });
}
