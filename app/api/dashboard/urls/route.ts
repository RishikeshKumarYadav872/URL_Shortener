import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { auth } from "@/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const urls = await prisma.url.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        slug: true,
        destination: true,
        clickCount: true,
        isActive: true,
        createdAt: true,
        expiresAt: true,
      },
    });
    return NextResponse.json(urls);
  } catch (error) {
    console.error("Dashboard URLs error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
