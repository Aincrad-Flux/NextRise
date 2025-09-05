export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { addUser, publicUser } from "@/lib/db";
import { hashPassword, signToken, cookieOptions } from "@/lib/auth";
import { withLogging } from "@/lib/logging";

function badRequest(message) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export const POST = withLogging(async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password, name } = body || {};

    if (!email || typeof email !== "string") return badRequest("Email requis");
    if (!password || typeof password !== "string" || password.length < 6)
      return badRequest("Mot de passe (>=6) requis");

    const passwordHash = await hashPassword(password);
    const user = await addUser({ email: email.trim(), passwordHash, name });

    const token = signToken({ sub: user.id, email: user.email });
    const res = NextResponse.json({ user: publicUser(user) }, { status: 201 });
    res.cookies.set({ name: cookieOptions.name, value: token, httpOnly: cookieOptions.httpOnly, sameSite: cookieOptions.sameSite, secure: cookieOptions.secure, path: cookieOptions.path, maxAge: cookieOptions.maxAge });
    return res;
  } catch (err) {
    if (err && err.code === "USER_EXISTS") {
      return NextResponse.json({ error: "Utilisateur déjà existant" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
});

