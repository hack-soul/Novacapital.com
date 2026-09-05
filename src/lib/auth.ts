import { db } from './storage';
import type { User } from './types';

const SESSION_KEY = 'nc_session';

export interface Session {
  userId: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export function getCurrentSession(): Session | null {
  try {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

export function getCurrentUser(): User | null {
  const session = getCurrentSession();
  if (!session) return null;
  return db.users.find(session.userId) || null;
}

export function login(email: string, password: string): { success: boolean; error?: string; user?: User } {
  const user = db.users.findByEmail(email);
  if (!user) return { success: false, error: 'Invalid email or password.' };
  if (user.password !== password) return { success: false, error: 'Invalid email or password.' };
  if (user.status === 'suspended') return { success: false, error: 'Your account has been suspended. Contact support.' };

  const session: Session = { userId: user.id, email: user.email, name: user.name, role: user.role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, user };
}

export function register(name: string, email: string, password: string, phone?: string, country?: string): { success: boolean; error?: string; user?: User } {
  if (db.users.findByEmail(email)) return { success: false, error: 'An account with this email already exists.' };
  if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

  const user = db.users.create({
    email,
    name,
    password,
    role: 'user',
    balance: 0,
    totalInvested: 0,
    totalEarnings: 0,
    phone,
    country,
    verified: false,
    status: 'active',
  });

  db.notifications.create({
    userId: user.id,
    title: 'Welcome to Nova Capital!',
    message: `Welcome, ${name}! Your account is ready. Browse our investment plans and start growing your wealth today.`,
    type: 'success',
    read: false,
  });

  const session: Session = { userId: user.id, email: user.email, name: user.name, role: user.role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { success: true, user };
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isAdmin(): boolean {
  const session = getCurrentSession();
  return session?.role === 'admin';
}

export function isAuthenticated(): boolean {
  return !!getCurrentSession();
}
