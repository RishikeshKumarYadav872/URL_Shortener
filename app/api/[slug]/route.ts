import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { resolveShortUrl } from "@/lib/urls/resolve-short-url";
import { recordClick } from "@/lib/analytics/record-click";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const result = await resolveShortUrl(slug);

  switch (result.status) {
    case "not_found":
    case "inactive":
      return NextResponse.json({ error: "Link not found" }, { status: 404 });

    case "expired":
      return NextResponse.json({ error: "This link has expired" }, { status: 410 });

    case "found": {
      // Schedule click recording after response
      after(async () => {
        try {
          await recordClick({
            urlId: result.url.id,
            request,
          });
        } catch (e) {
          console.error("Failed to record click:", e);
        }
      });

      return NextResponse.redirect(result.url.destination, 307);
    }
  }
}
