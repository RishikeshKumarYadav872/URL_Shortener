import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { createHash } from "crypto";

export const runtime = "nodejs";

interface ClickPayload {
  urlId: string;
  referer?: string | null;
  country?: string | null;
  city?: string | null;
  browser?: string | null;
  os?: string | null;
  device?: string | null;
  userAgent?: string | null;
  ip?: string | null;
  isBot?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Verify internal secret
    const secret = request.headers.get("x-internal-secret");
    if (secret !== process.env.INTERNAL_CLICK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload: ClickPayload = await request.json();

    if (!payload.urlId) {
      return NextResponse.json({ error: "Missing urlId" }, { status: 400 });
    }

    // Hash IP for privacy
    const ipHash = payload.ip
      ? createHash("sha256").update(payload.ip + (process.env.INTERNAL_CLICK_SECRET || "")).digest("hex").slice(0, 32)
      : null;

    // Transaction: insert click + update counters
    await prisma.$transaction([
      prisma.click.create({
        data: {
          urlId: payload.urlId,
          referer: payload.referer || null,
          country: payload.country || null,
          city: payload.city || null,
          browser: payload.browser || null,
          os: payload.os || null,
          device: payload.device || null,
          userAgent: payload.userAgent || null,
          ipHash,
          isBot: payload.isBot || false,
        },
      }),
      prisma.url.update({
        where: { id: payload.urlId },
        data: {
          clickCount: { increment: 1 },
          lastClickedAt: new Date(),
        },
      }),
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Click ingest error:", error);
    return NextResponse.json(
      { error: "Failed to record click" },
      { status: 500 }
    );
  }
}
