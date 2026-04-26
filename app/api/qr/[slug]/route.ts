import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const shortUrl = `${appUrl}/${slug}`;

  try {
    const svg = await QRCode.toString(shortUrl, {
      type: "svg",
      margin: 2,
      width: 300,
      color: {
        dark: "#0d1117",
        light: "#ffffff",
      },
    });

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("QR generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    );
  }
}
