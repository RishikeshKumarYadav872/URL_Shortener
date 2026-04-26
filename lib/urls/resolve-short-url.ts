import prisma from "@/lib/prisma/client";
import { setCachedUrl, type CachedUrl } from "@/lib/redis/url-cache";

export interface ResolvedUrl {
  id: string;
  slug: string;
  destination: string;
  expiresAt: Date | null;
  isActive: boolean;
}

export type ResolveResult =
  | { status: "found"; url: ResolvedUrl }
  | { status: "not_found" }
  | { status: "expired" }
  | { status: "inactive" };

export async function resolveShortUrl(slug: string): Promise<ResolveResult> {
  const normalizedSlug = slug.toLowerCase();

  const url = await prisma.url.findUnique({
    where: { slug: normalizedSlug },
    select: {
      id: true,
      slug: true,
      destination: true,
      expiresAt: true,
      isActive: true,
    },
  });

  if (!url) {
    return { status: "not_found" };
  }

  if (!url.isActive) {
    return { status: "inactive" };
  }

  if (url.expiresAt && url.expiresAt < new Date()) {
    return { status: "expired" };
  }

  // Warm Redis cache for future edge hits
  await setCachedUrl({
    id: url.id,
    slug: url.slug,
    destination: url.destination,
    expiresAt: url.expiresAt?.toISOString() || null,
    isActive: url.isActive,
  });

  return {
    status: "found",
    url: {
      id: url.id,
      slug: url.slug,
      destination: url.destination,
      expiresAt: url.expiresAt,
      isActive: url.isActive,
    },
  };
}

export function cachedUrlToResolved(cached: CachedUrl): ResolveResult {
  if (!cached.isActive) {
    return { status: "inactive" };
  }

  if (cached.expiresAt && new Date(cached.expiresAt) < new Date()) {
    return { status: "expired" };
  }

  return {
    status: "found",
    url: {
      id: cached.id,
      slug: cached.slug,
      destination: cached.destination,
      expiresAt: cached.expiresAt ? new Date(cached.expiresAt) : null,
      isActive: cached.isActive,
    },
  };
}
