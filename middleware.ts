import { NextRequest, NextResponse } from "next/server";
import { getCachedUrl, type CachedUrl } from "@/lib/redis/url-cache";

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - _next (Next.js internals)
     * - dashboard
     * - auth
     * - static files
     */
    "/((?!api|_next|dashboard|auth|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\..*).*)",
  ],
};

// Known app routes to skip
const APP_ROUTES = new Set(["", "/"]);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip root path (marketing page)
  if (pathname === "/" || pathname === "") {
    return NextResponse.next();
  }

  // Extract potential slug (first path segment only)
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length !== 1) {
    return NextResponse.next();
  }

  const slug = segments[0].toLowerCase();

  // Skip known app routes
  if (APP_ROUTES.has(slug)) {
    return NextResponse.next();
  }

  // Try Redis cache first (fast path)
  const cached = await getCachedUrl(slug, request.headers.get("host") || undefined);

  if (cached) {
    const result = cachedUrlToResolved(cached);

    if (result.status === "found") {
      // Fire-and-forget click recording via waitUntil
      const clickPromise = recordClickFromEdge(cached.id, request);

      // Use waitUntil if available (Vercel edge)
      const ctx = (globalThis as Record<string, unknown>);
      if (typeof ctx.waitUntil === "function") {
        (ctx.waitUntil as (p: Promise<unknown>) => void)(clickPromise);
      }

      return NextResponse.redirect(result.url.destination, 307);
    }

    if (result.status === "expired") {
      return new NextResponse("This link has expired", { status: 410 });
    }

    if (result.status === "inactive") {
      return new NextResponse("Link not found", { status: 404 });
    }
  }

  // Cache miss: rewrite to Node.js fallback route
  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = `/api/${slug}`;
  return NextResponse.rewrite(rewriteUrl);
}

async function recordClickFromEdge(urlId: string, request: NextRequest): Promise<void> {
  const appUrl = request.nextUrl.origin;
  try {
    await fetch(`${appUrl}/api/internal/click`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.INTERNAL_CLICK_SECRET || "",
      },
      body: JSON.stringify({
        urlId,
        referer: request.headers.get("referer") || null,
        country: request.headers.get("x-vercel-ip-country") || null,
        city: request.headers.get("x-vercel-ip-city") || null,
        userAgent: request.headers.get("user-agent") || null,
        ip: request.headers.get("x-forwarded-for")?.split(",")[0] || null,
      }),
    });
  } catch {
    // Non-blocking, swallow errors
  }
}

type ResolveResult =
  | { status: "found"; url: { destination: string } }
  | { status: "expired" }
  | { status: "inactive" };

function cachedUrlToResolved(cached: CachedUrl): ResolveResult {
  if (!cached.isActive) {
    return { status: "inactive" };
  }

  if (cached.expiresAt && new Date(cached.expiresAt) < new Date()) {
    return { status: "expired" };
  }

  return {
    status: "found",
    url: {
      destination: cached.destination,
    },
  };
}
