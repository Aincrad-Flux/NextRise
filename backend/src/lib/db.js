import { sendRequest } from "@/lib/supabase";

/**
 * Convert a raw database row into the internal user representation.
 * Re-maps the stored password column to passwordHash and hides the original field.
 * @param {Object|null} row Raw database row from the `user` table.
 * @returns {Object|null} Internal user object or null when input is falsy.
 * @private
 */
function rowToInternalUser(row) {
  if (!row) return null;
  const { password, ...rest } = row;
  return { ...rest, passwordHash: password };
}

/**
 * Retrieve all users (without plaintext passwords) from the database.
 * @async
 * @returns {Promise<Array<Object>>} List of internal user records.
 */
export async function getUsers() {
  const rows = await sendRequest({ path: "/user", query: { select: "*" } });
  return Array.isArray(rows) ? rows.map(rowToInternalUser) : [];
}

/**
 * Find a user by email (case-insensitive). Emails are normalized (trim + lowercase).
 * @async
 * @param {string} email Email address to search for.
 * @returns {Promise<Object|null>} Matching user or null.
 */
export async function findUserByEmail(email) {
  if (!email) return null;
  const e = String(email).trim().toLowerCase();
  const rows = await sendRequest({
    path: "/user",
    query: { select: "*", email: `eq.${e}` },
  });
  const row = Array.isArray(rows) ? rows[0] : null;
  return rowToInternalUser(row);
}

/**
 * Find a user by numeric or UUID identifier.
 * @async
 * @param {string|number} id User primary key value.
 * @returns {Promise<Object|null>} Matching user or null when not found.
 */
export async function findUserById(id) {
  if (id === undefined || id === null) return null;
  const rows = await sendRequest({
    path: "/user",
    query: { select: "*", id: `eq.${encodeURIComponent(id)}` },
  });
  const row = Array.isArray(rows) ? rows[0] : null;
  return rowToInternalUser(row);
}

/**
 * Insert a new user. Ensures uniqueness on email and sets defaults for unspecified fields.
 * @async
 * @param {Object} params New user parameters.
 * @param {string} params.email Email address (will be normalized).
 * @param {string} params.passwordHash Already hashed password value.
 * @param {string} [params.name] Display name.
 * @param {string} [params.role] Role (admin|investor|founder|user). Defaults to user.
 * @param {number|string|null} [params.founder_id] Optional founder FK.
 * @param {number|string|null} [params.investor_id] Optional investor FK.
 * @returns {Promise<Object>} Created user (internal representation).
 * @throws {Error} If email missing or already exists (err.code = USER_EXISTS).
 */
export async function addUser({ email, passwordHash, name, role, founder_id, investor_id }) {
  const e = String(email || "").trim().toLowerCase();
  if (!e) {
    const err = new Error("Email required");
    err.code = "BAD_REQUEST";
    throw err;
  }

  const existing = await findUserByEmail(e);
  if (existing) {
    const err = new Error("User already exists");
    err.code = "USER_EXISTS";
    throw err;
  }

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

/**
 * Produce a public-safe user object by dropping password related fields.
 * @param {Object|null} user Internal user object.
 * @returns {Object|null} Public user object or null.
 */
export function publicUser(user) {
  if (!user) return null;
  const { passwordHash, password, ...rest } = user;
  return rest;
}

