export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { findUserByEmail, publicUser } from "@/lib/db";
import { verifyPassword, signToken, cookieOptions } from "@/lib/auth";

function unauthorized(message = "Identifiants invalides") {
  return NextResponse.json({ error: message }, { status: 401 });
}

function badRequest(message) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body || {};

    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password)
      return badRequest("Email et mot de passe requis");

    const normalizedEmail = email.trim();
    const user = await findUserByEmail(normalizedEmail);
    if (!user) return unauthorized();

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return unauthorized();

    const token = signToken({ sub: user.id, email: user.email });
    const res = NextResponse.json({ user: publicUser(user) }, { status: 200 });
    res.cookies.set({ name: cookieOptions.name, value: token, httpOnly: cookieOptions.httpOnly, sameSite: cookieOptions.sameSite, secure: cookieOptions.secure, path: cookieOptions.path, maxAge: cookieOptions.maxAge });
    return res;
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

