import { createHash, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "sagalin-admin-session";

export function isValidAdminPassword(candidatePassword: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    throw new Error("Missing ADMIN_PASSWORD in .env.local.");
  }

  return safeCompare(candidatePassword, expectedPassword);
}

export function createAdminSessionValue() {
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    throw new Error("Missing ADMIN_PASSWORD in .env.local.");
  }

  return createHash("sha256")
    .update(`sagalin-admin:${expectedPassword}`)
    .digest("hex");
}

export async function isAdminAuthenticated() {
  // We check the cookie on the server, not in client-side JavaScript. That keeps
  // the password and session logic out of the browser and matches the shared-
  // password requirement from the brief.
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!sessionCookie) {
    return false;
  }

  return safeCompare(sessionCookie, createAdminSessionValue());
}

export async function ensureAdminRequest() {
  const isAuthed = await isAdminAuthenticated();

  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return null;
}

function safeCompare(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();

  return timingSafeEqual(leftHash, rightHash);
}
