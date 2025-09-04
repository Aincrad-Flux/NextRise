export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookieOptions } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.cookies.set({
    name: cookieOptions.name,
    value: "",
    httpOnly: cookieOptions.httpOnly,
    sameSite: cookieOptions.sameSite,
    secure: cookieOptions.secure,
    path: cookieOptions.path,
    maxAge: 0,
  });
  return res;
}

