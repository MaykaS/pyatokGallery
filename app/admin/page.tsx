import Link from "next/link";

import { AdminLoginForm } from "@/components/admin-login-form";
import { getLocaleDictionary, getLocaleFromCookie } from "@/lib/i18n";

export default async function AdminLoginPage() {
  const locale = await getLocaleFromCookie();
  const dictionary = getLocaleDictionary(locale);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pb-12 pt-5 sm:px-6 sm:pb-16 sm:pt-6 lg:px-8">
      <Link className="ui-link self-start" href="/">
        {dictionary.backToGallery}
      </Link>

      <section className="mx-auto mt-10 w-full max-w-sm border border-[var(--border-color)] bg-[var(--background-color)] p-5 sm:mt-16 sm:p-8">
        <h1 className="font-heading text-center text-[32px] text-[var(--text-color)]">
          {dictionary.adminLogin}
        </h1>
        <p className="mt-3 text-center text-sm leading-6 text-[var(--muted-color)]">
          {dictionary.adminHelp}
        </p>

        <AdminLoginForm t={dictionary} />
      </section>
    </main>
  );
}
