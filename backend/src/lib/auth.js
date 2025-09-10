import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 jours

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
  if (!hash) return false;
  // Supporte les anciens mots de passe non hashés si la DB contient du texte en clair
  const isBcrypt = typeof hash === 'string' && hash.startsWith('$2');
  if (isBcrypt) return bcrypt.compare(password, hash);
  return password === hash;
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL_SECONDS });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export const cookieOptions = {
  name: "auth_token",
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  // secure uniquement en prod
  secure: process.env.NODE_ENV === "production",
  maxAge: TOKEN_TTL_SECONDS,
};

