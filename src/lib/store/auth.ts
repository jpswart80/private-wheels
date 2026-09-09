import type { User } from "@/lib/types";

/**
 * Mock auth store backed by localStorage. This exists purely so the rest of
 * the app can be built and clicked through end-to-end before Supabase Auth
 * is wired up. Every function here is the seam that gets reimplemented
 * against Supabase later — nothing outside this file should touch
 * localStorage directly.
 *
 * Exposes a tiny pub/sub (subscribeAuth) so `useSyncExternalStore` can read
 * this store directly, instead of components polling it via an effect.
 */

const USERS_KEY = "pw_users";
const SESSION_KEY = "pw_session";

function isBrowser() {
  return typeof window !== "undefined";
}

function readUsers(): User[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

type Listener = () => void;
const listeners = new Set<Listener>();
let version = 0;

function notify() {
  version += 1;
  listeners.forEach((listener) => listener());
}

export function subscribeAuth(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setSession(userId: string | null) {
  if (!isBrowser()) return;
  if (userId) {
    window.localStorage.setItem(SESSION_KEY, userId);
  } else {
    window.localStorage.removeItem(SESSION_KEY);
  }
  notify();
}

export class AuthError extends Error {}

export function register(email: string, password: string): User {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();

  if (users.some((u) => u.email === normalizedEmail)) {
    throw new AuthError("An account with this email already exists.");
  }

  const user: User = {
    id: `user-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    email: normalizedEmail,
    password,
    name: normalizedEmail.split("@")[0],
    createdAt: new Date().toISOString(),
  };

  writeUsers([...users, user]);
  setSession(user.id);
  return user;
}

export function login(email: string, password: string): User {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user || user.password !== password) {
    throw new AuthError("Invalid email or password.");
  }

  setSession(user.id);
  return user;
}

export function logout() {
  setSession(null);
}

let cachedVersion = -1;
let cachedSessionId: string | null = null;
let cachedUser: User | null = null;

export function getCurrentUser(): User | null {
  if (!isBrowser()) return null;

  const sessionId = window.localStorage.getItem(SESSION_KEY);
  if (version === cachedVersion && sessionId === cachedSessionId) {
    return cachedUser;
  }

  cachedVersion = version;
  cachedSessionId = sessionId;
  cachedUser = sessionId ? (readUsers().find((u) => u.id === sessionId) ?? null) : null;
  return cachedUser;
}

export function getServerUser(): User | null {
  return null;
}
