import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Secret used to sign JWT tokens. Must be set in the environment.
 * @private
 * @type {string|undefined}
 */
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Token lifetime (7 days) in seconds.
 * @constant
 * @type {number}
 */
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

/**
 * Hash a plaintext password using bcrypt with a generated salt.
 * @async
 * @param {string} password Plain user password.
 * @returns {Promise<string>} Bcrypt hash.
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a stored hash. Falls back to direct text comparison
 * for legacy records that were not yet migrated to bcrypt (hash not starting with '$2').
 * @async
 * @param {string} password Plain candidate password.
 * @param {string} hash Stored bcrypt hash or legacy clear text password.
 * @returns {Promise<boolean>} True if the password matches.
 */
export async function verifyPassword(password, hash) {
  if (!hash) return false;
  const isBcrypt = typeof hash === 'string' && hash.startsWith('$2');
  if (isBcrypt) return bcrypt.compare(password, hash);
  return password === hash;
}

/**
 * Sign a JWT token containing the provided payload.
 * @param {Object} payload Arbitrary JSON-serializable payload. Common fields: { sub: userId }.
 * @returns {string} Signed JWT token.
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL_SECONDS });
}

/**
 * Verify and decode a JWT token. Returns null if invalid or expired.
 * @param {string} token JWT token string.
 * @returns {Object|null} Decoded payload or null when invalid.
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Default cookie options for storing the auth token.
 * @typedef {Object} AuthCookieOptions
 * @property {string} name Cookie name.
 * @property {boolean} httpOnly True to disallow JS access.
 * @property {string} sameSite SameSite policy.
 * @property {string} path Path scope.
 * @property {boolean} secure Sent only over HTTPS in production.
 * @property {number} maxAge Lifetime in seconds.
 */

/**
 * Cookie configuration used when setting the authentication token.
 * @type {AuthCookieOptions}
 */
// Allow overriding the secure flag in local development when using plain HTTP.
// By default cookies are secure only in production to avoid them being dropped by browsers
// when served over http:// during local dev. You can force secure cookie with COOKIE_SECURE=true
// or force insecure (even in prod) with COOKIE_SECURE=false (not recommended in production).
const COOKIE_SECURE = (() => {
  if (process.env.COOKIE_SECURE === 'true') return true;
  if (process.env.COOKIE_SECURE === 'false') return false;
  return process.env.NODE_ENV === 'production';
})();

export const cookieOptions = {
  name: "auth_token",
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: COOKIE_SECURE,
  maxAge: TOKEN_TTL_SECONDS,
};

