import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify({ users: [] }, null, 2));
  }
}

export async function getUsers() {
  await ensureDataFile();
  const raw = await fs.readFile(USERS_FILE, "utf8");
  const data = JSON.parse(raw || "{}");
  return Array.isArray(data.users) ? data.users : [];
}

async function saveUsers(users) {
  await ensureDataFile();
  const data = { users };
  await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));
}

export async function findUserByEmail(email) {
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === String(email).toLowerCase()) || null;
}

export async function findUserById(id) {
  const users = await getUsers();
  return users.find((u) => u.id === id) || null;
}

export async function addUser({ email, passwordHash, name }) {
  const users = await getUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    const err = new Error("User already exists");
    err.code = "USER_EXISTS";
    throw err;
  }
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const user = { id, email, passwordHash, name: name || null, createdAt: now, updatedAt: now };
  users.push(user);
  await saveUsers(users);
  return { ...user };
}

export function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
}

