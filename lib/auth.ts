import { cookies } from "next/headers";
import { db } from "./db";
import bcrypt from "bcryptjs";

const SESSION_COOKIE = "silk_session_user";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN" | "CUSTOMER";
  locale: string;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const parsed = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    if (!parsed || !parsed.id) return null;

    const user = await db.user.findUnique({
      where: { id: parsed.id },
      select: { id: true, email: true, name: true, role: true, locale: true, isActive: true },
    });

    if (!user || !user.isActive) return null;
    return user as SessionUser;
  } catch (err) {
    return null;
  }
}

export function createSessionCookie(user: SessionUser) {
  const data = JSON.stringify({ id: user.id, email: user.email, role: user.role });
  return Buffer.from(data).toString("base64");
}
