import prisma from "@/lib/prisma/client";
import { setCachedUrl } from "@/lib/redis/url-cache";
import { generateSlug, isReservedSlug, normalizeSlug } from "./slug";
import type { ShortenUrlInput } from "@/lib/validation/schemas";

const MAX_RETRIES = 5;

export interface CreateUrlResult {
  id: string;
  slug: string;
  shortUrl: string;
  qrCodeUrl: string;
}

export async function createShortUrl(
  input: ShortenUrlInput,
  userId?: string | null
): Promise<CreateUrlResult> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  let slug: string;
  let isCustom = false;

  if (input.customAlias) {
    slug = normalizeSlug(input.customAlias);

    if (isReservedSlug(slug)) {
      throw new ApiError(409, "This alias is reserved");
    }

    const existing = await prisma.url.findUnique({ where: { slug } });
    if (existing) {
      throw new ApiError(409, "This alias is already taken");
    }
    isCustom = true;
  } else {
    slug = "";
    for (let i = 0; i < MAX_RETRIES; i++) {
      const candidate = generateSlug();
      const existing = await prisma.url.findUnique({
        where: { slug: candidate },
      });
      if (!existing) {
        slug = candidate;
        break;
      }
    }
    if (!slug) {
      throw new ApiError(500, "Failed to generate unique slug after retries");
    }
  }

  const url = await prisma.url.create({
    data: {
      slug,
      destination: input.url,
      customAlias: isCustom,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      userId: userId || null,
    },
  });

  // Pre-warm Redis cache
  await setCachedUrl({
    id: url.id,
    slug: url.slug,
    destination: url.destination,
    expiresAt: url.expiresAt?.toISOString() || null,
    isActive: url.isActive,
  });

  return {
    id: url.id,
    slug: url.slug,
    shortUrl: `${appUrl}/${url.slug}`,
    qrCodeUrl: `${appUrl}/api/qr/${url.slug}`,
  };
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}
