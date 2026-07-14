import { redirect } from "next/navigation";

import { AdminDashboard } from "@/components/admin-dashboard";
import { logoutAdmin } from "@/app/admin/actions";
import { getAllArtworks } from "@/lib/artworks";
import { isAdminAuthenticated } from "@/lib/auth";
import { getLocaleDictionary, getLocaleFromCookie } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const isAuthed = await isAdminAuthenticated();

  if (!isAuthed) {
    redirect("/admin");
  }

  const locale = await getLocaleFromCookie();
  const dictionary = getLocaleDictionary(locale);
  const artworks = await getAllArtworks();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 border-b border-[var(--border-color)] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-4xl text-[var(--text-color)]">
            {dictionary.dashboardTitle}
          </h1>
          <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[var(--muted-color)]">
            {dictionary.dashboardSubtitle}
          </p>
        </div>

        <form action={logoutAdmin}>
          <button className="ui-button" type="submit">
            {dictionary.logout}
          </button>
        </form>
      </div>

      <AdminDashboard artworks={artworks} t={dictionary} />
    </main>
  );
}
