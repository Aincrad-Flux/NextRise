import { NextResponse } from "next/server";

const DEFAULT_ALLOWED = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

function parseAllowedOrigins() {
  const env = process.env.ALLOWED_ORIGINS || "";
  const list = env.split(",").map((s) => s.trim()).filter(Boolean);
  return list.length ? list : DEFAULT_ALLOWED;
}

export function middleware(req) {
  const allowed = parseAllowedOrigins();
  const origin = req.headers.get("origin");
  const isAllowed = origin && allowed.includes(origin);

  // Préparer les headers CORS
  const headers = new Headers();
  if (isAllowed) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Credentials", "true");
  }
  headers.set("Vary", "Origin");
  headers.set(
    "Access-Control-Allow-Headers",
    req.headers.get("Access-Control-Request-Headers") || "Content-Type"
  );
  headers.set(
    "Access-Control-Allow-Methods",
    req.headers.get("Access-Control-Request-Method") || "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers });
  }

  const res = NextResponse.next();
  for (const [k, v] of headers) res.headers.set(k, v);
  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};

