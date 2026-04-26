import { nanoid } from "nanoid";

export const RESERVED_SLUGS = new Set([
  "api",
  "dashboard",
  "auth",
  "login",
  "signup",
  "settings",
  "admin",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "public",
  "static",
]);

const SLUG_LENGTH = 7;

export function generateSlug(): string {
  return nanoid(SLUG_LENGTH).toLowerCase();
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}

export function normalizeSlug(slug: string): string {
  return slug.toLowerCase().trim();
}
