import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma/client";
import { redis } from "@/lib/redis/client";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== "boolean") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Verify ownership
    const url = await prisma.url.findUnique({
      where: { id },
    });

    if (!url) {
      return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    if (url.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update status
    const updatedUrl = await prisma.url.update({
      where: { id },
      data: { isActive },
    });

    // Invalidate cache if Redis is configured
    if (redis) {
      try {
        await redis.del(`url:${url.slug}`);
      } catch (cacheError) {
        console.error("Failed to invalidate cache:", cacheError);
      }
    }

    return NextResponse.json(updatedUrl);
  } catch (error) {
    console.error("Failed to update URL:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
