"use client";

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "manager" | "staff" | "customer";
}

const SESSION_KEY = "pe_session";
const USERS_KEY = "pe_users";

function loadUsers(): Record<string, LocalUser> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  const users: Record<string, LocalUser> = {
    "admin@diaenterprises.in": {
      id: "local-admin",
      name: "Admin",
      email: "admin@diaenterprises.in",
      role: "admin",
    },
  };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return users;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    typeof window !== "undefined" &&
      (process.env.NEXT_PUBLIC_SUPABASE_URL || "").length > 0 &&
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").length > 0,
  );
}

export function localSignIn(email: string, password: string): LocalUser | { error: string } {
  const users = loadUsers();
  const user = users[email.toLowerCase()];
  if (email.toLowerCase() === "admin@diaenterprises.in" && password === "Admin@123") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  }
  if (!user) return { error: "No account found with this email. Please sign up." };
  const stored = localStorage.getItem(`${USERS_KEY}:pw:${user.id}`);
  if (!stored || stored !== password) return { error: "Incorrect email or password" };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function localSignUp(name: string, email: string, password: string): LocalUser | { error: string } {
  const users = loadUsers();
  const key = email.toLowerCase();
  if (users[key]) return { error: "An account with this email already exists. Please login." };
  const user: LocalUser = {
    id: `local-${Date.now()}`,
    name,
    email: key,
    role: "customer",
  };
  users[key] = user;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(`${USERS_KEY}:pw:${user.id}`, password);
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export function getLocalUser(): LocalUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as LocalUser) : null;
  } catch {
    return null;
  }
}

export function localSignOut() {
  localStorage.removeItem(SESSION_KEY);
}

export function otpLogin(email: string): boolean {
  const users = loadUsers();
  if (!users[email.toLowerCase()]) return false;
  const user = users[email.toLowerCase()];
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return true;
}
