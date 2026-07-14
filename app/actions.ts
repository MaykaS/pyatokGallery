"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DEFAULT_LOCALE, isSupportedLocale, LOCALE_COOKIE } from "@/lib/i18n";

export async function setLocaleAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? DEFAULT_LOCALE);
  const redirectTo = String(formData.get("redirectTo") ?? "/");
  const cookieStore = await cookies();

  cookieStore.set({
    name: LOCALE_COOKIE,
    value: isSupportedLocale(locale) ? locale : DEFAULT_LOCALE,
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect(redirectTo || "/");
}
