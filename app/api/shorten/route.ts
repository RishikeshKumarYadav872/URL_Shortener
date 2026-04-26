import { NextRequest, NextResponse } from "next/server";
import { shortenUrlSchema } from "@/lib/validation/schemas";
import { createShortUrl, ApiError } from "@/lib/urls/create-short-url";
import { shortenRateLimit, checkRateLimit } from "@/lib/ratelimit";
import { auth } from "@/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous";
    const rateLimitResult = await checkRateLimit(shortenRateLimit, ip);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": String(rateLimitResult.remaining ?? 0),
            "X-RateLimit-Reset": String(rateLimitResult.reset ?? 0),
          },
        }
      );
    }

    const body = await request.json();
    const parsed = shortenUrlSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const session = await auth();
    const userId = session?.user?.id;

    const result = await createShortUrl(parsed.data, userId);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    console.error("Shorten error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
