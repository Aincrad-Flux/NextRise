import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { findUserById, publicUser } from "@/lib/db";

/**
 * Read the auth token from cookies, verify it and resolve the public user.
 * @async
 * @returns {Promise<{token:string,user:Object}|null>} Session data or null when unauthenticated.
 */
export async function getSessionUser() {
  const jar = cookies();
  const token = jar.get("auth_token")?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload || !payload.sub) return null;
  const user = await findUserById(payload.sub);
  if (!user) return null;
  return { token, user: publicUser(user) };
}

