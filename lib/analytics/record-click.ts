import { NextRequest } from "next/server";

interface RecordClickInput {
  urlId: string;
  request: NextRequest;
}

function parseUserAgent(ua: string): { browser: string; os: string; device: string; isBot: boolean } {
  const lowerUa = ua.toLowerCase();

  // Bot detection
  const isBot = /bot|crawl|spider|slurp|wget|curl|fetch/i.test(ua);

  // Browser detection
  let browser = "Unknown";
  if (lowerUa.includes("firefox")) browser = "Firefox";
  else if (lowerUa.includes("edg")) browser = "Edge";
  else if (lowerUa.includes("chrome")) browser = "Chrome";
  else if (lowerUa.includes("safari")) browser = "Safari";
  else if (lowerUa.includes("opera") || lowerUa.includes("opr")) browser = "Opera";

  // OS detection
  let os = "Unknown";
  if (lowerUa.includes("windows")) os = "Windows";
  else if (lowerUa.includes("mac")) os = "macOS";
  else if (lowerUa.includes("linux")) os = "Linux";
  else if (lowerUa.includes("android")) os = "Android";
  else if (lowerUa.includes("iphone") || lowerUa.includes("ipad")) os = "iOS";

  // Device type
  let device = "Desktop";
  if (lowerUa.includes("mobile") || lowerUa.includes("android")) device = "Mobile";
  else if (lowerUa.includes("tablet") || lowerUa.includes("ipad")) device = "Tablet";

  return { browser, os, device, isBot };
}

export async function recordClick({ urlId, request }: RecordClickInput): Promise<void> {
  const appUrl = request.nextUrl.origin;
  const ua = request.headers.get("user-agent") || "";
  const referer = request.headers.get("referer") || null;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || request.headers.get("x-real-ip") || null;
  const country = request.headers.get("x-vercel-ip-country") || null;
  const city = request.headers.get("x-vercel-ip-city") || null;

  const { browser, os, device, isBot } = parseUserAgent(ua);

  try {
    await fetch(`${appUrl}/api/internal/click`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.INTERNAL_CLICK_SECRET || "",
      },
      body: JSON.stringify({
        urlId,
        referer,
        country,
        city,
        browser,
        os,
        device,
        userAgent: ua,
        ip,
        isBot,
      }),
    });
  } catch (e) {
    console.error("Failed to send click event:", e);
  }
}
