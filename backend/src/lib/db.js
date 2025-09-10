import { sendRequest } from "@/lib/supabase";

// Map a DB row to our internal user shape (expose passwordHash instead of password)
function rowToInternalUser(row) {
  if (!row) return null;
  const { password, ...rest } = row;
  return { ...rest, passwordHash: password };
}

export async function getUsers() {
  const rows = await sendRequest({ path: "/user", query: { select: "*" } });
  return Array.isArray(rows) ? rows.map(rowToInternalUser) : [];
}

export async function findUserByEmail(email) {
  if (!email) return null;
  const e = String(email).trim().toLowerCase();
  // We normalize emails to lowercase on insert; use exact match
  const rows = await sendRequest({
    path: "/user",
    query: { select: "*", email: `eq.${e}` },
  });
  const row = Array.isArray(rows) ? rows[0] : null;
  return rowToInternalUser(row);
}

export async function findUserById(id) {
  if (id === undefined || id === null) return null;
  const rows = await sendRequest({
    path: "/user",
    query: { select: "*", id: `eq.${encodeURIComponent(id)}` },
  });
  const row = Array.isArray(rows) ? rows[0] : null;
  return rowToInternalUser(row);
}

export async function addUser({ email, passwordHash, name, role, founder_id, investor_id }) {
  const e = String(email || "").trim().toLowerCase();
  if (!e) {
    const err = new Error("Email requis");
    err.code = "BAD_REQUEST";
    throw err;
  }

  // Prevent duplicates
  const existing = await findUserByEmail(e);
  if (existing) {
    const err = new Error("User already exists");
    err.code = "USER_EXISTS";
    throw err;
  }

  // Build payload WITHOUT id (DB must assign it)
  const allowedRoles = ["admin", "investor", "founder", "user"];
  const payload = {
    email: e,
    name: name ?? null,
    role: allowedRoles.includes(role) ? role : "user",
    founder_id: founder_id ?? null,
    investor_id: investor_id ?? null,
    password: passwordHash,
  };

  const created = await sendRequest({ path: "/user", method: "POST", body: payload });
  const row = Array.isArray(created) ? created[0] : created;
  return rowToInternalUser(row);
}

export function publicUser(user) {
  if (!user) return null;
  const { passwordHash, password, ...rest } = user;
  return rest;
}

