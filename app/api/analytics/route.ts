import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const urlId = searchParams.get("urlId");
    const range = searchParams.get("range") || "7d";
    const groupBy = searchParams.get("groupBy") || "day";

    const now = new Date();
    const rangeMap: Record<string, number> = {
      "24h": 1, "7d": 7, "30d": 30, "90d": 90,
    };
    const days = rangeMap[range] || 7;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Build where clause
    const conditions: Prisma.ClickWhereInput = {
      clickedAt: { gte: startDate },
    };
    if (urlId) conditions.urlId = urlId;

    const totalClicks = await prisma.click.count({ where: conditions });

    // Unique visitors approximate
    const uniqueRaw = await prisma.click.findMany({
      where: conditions,
      select: { ipHash: true },
      distinct: ["ipHash"],
    });
    const uniqueVisitors = uniqueRaw.length;

    let groupedData: unknown = [];

    switch (groupBy) {
      case "country":
        groupedData = await prisma.click.groupBy({
          by: ["country"],
          where: conditions,
          _count: { id: true },
          orderBy: { _count: { id: "desc" } },
          take: 20,
        });
        break;
      case "referrer":
        groupedData = await prisma.click.groupBy({
          by: ["referer"],
          where: conditions,
          _count: { id: true },
          orderBy: { _count: { id: "desc" } },
          take: 20,
        });
        break;
      case "device":
        groupedData = await prisma.click.groupBy({
          by: ["device"],
          where: conditions,
          _count: { id: true },
          orderBy: { _count: { id: "desc" } },
        });
        break;
      case "browser":
        groupedData = await prisma.click.groupBy({
          by: ["browser"],
          where: conditions,
          _count: { id: true },
          orderBy: { _count: { id: "desc" } },
          take: 10,
        });
        break;
      case "day":
      default:
        if (urlId) {
          groupedData = await prisma.$queryRaw`
            SELECT DATE(TIMEZONE('UTC', "clickedAt")) as date, COUNT(*)::int as clicks
            FROM "Click"
            WHERE "urlId" = ${urlId} AND "clickedAt" >= ${startDate}
            GROUP BY DATE(TIMEZONE('UTC', "clickedAt"))
            ORDER BY date ASC
          `;
        } else {
          groupedData = await prisma.$queryRaw`
            SELECT DATE(TIMEZONE('UTC', "clickedAt")) as date, COUNT(*)::int as clicks
            FROM "Click"
            WHERE "clickedAt" >= ${startDate}
            GROUP BY DATE(TIMEZONE('UTC', "clickedAt"))
            ORDER BY date ASC
          `;
        }
        break;
    }

    return NextResponse.json({
      totalClicks,
      uniqueVisitors,
      range,
      groupBy,
      data: groupedData,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
