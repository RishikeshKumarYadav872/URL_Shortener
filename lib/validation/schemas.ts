import { z } from "zod/v4";

const BLOCKED_HOSTS = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "10.",
  "172.16.",
  "172.17.",
  "172.18.",
  "172.19.",
  "172.20.",
  "172.21.",
  "172.22.",
  "172.23.",
  "172.24.",
  "172.25.",
  "172.26.",
  "172.27.",
  "172.28.",
  "172.29.",
  "172.30.",
  "172.31.",
  "192.168.",
  "169.254.",
];

const ALLOWED_PROTOCOLS = ["http:", "https:"];

function isBlockedUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    if (!ALLOWED_PROTOCOLS.includes(url.protocol)) return true;
    const hostname = url.hostname.toLowerCase();
    return BLOCKED_HOSTS.some(
      (blocked) => hostname === blocked || hostname.startsWith(blocked)
    );
  } catch {
    return true;
  }
}

export const shortenUrlSchema = z.object({
  url: z
    .url("Invalid URL format")
    .refine((val) => !isBlockedUrl(val), {
      message: "This URL is not allowed",
    }),
  customAlias: z
    .string()
    .regex(/^[a-z0-9-]{3,32}$/, "Alias must be 3-32 lowercase alphanumeric characters or hyphens")
    .optional(),
  expiresAt: z
    .string()
    .datetime()
    .refine((val) => new Date(val) > new Date(), {
      message: "Expiry must be in the future",
    })
    .optional(),
});

export type ShortenUrlInput = z.infer<typeof shortenUrlSchema>;
