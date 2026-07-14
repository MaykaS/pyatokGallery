import Link from "next/link";

import { LocaleToggle } from "@/components/locale-toggle";
import type { Dictionary, Locale } from "@/lib/types";

type SiteHeaderProps = {
  adminHref: string;
  artistName: string;
  currentPath: string;
  galleryTitle: string;
  locale: Locale;
  t: Dictionary;
};

export function SiteHeader({
  adminHref,
  artistName,
  currentPath,
  galleryTitle,
  locale,
  t,
}: SiteHeaderProps) {
  return (
    <header className="relative border-b border-[var(--border-color)] px-2 pb-8 pt-14 text-center sm:px-4">
      <div className="absolute right-0 top-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-[var(--muted-color)] sm:right-4">
        <LocaleToggle currentPath={currentPath} locale={locale} t={t} />
        <span className="text-[var(--border-color)]">|</span>
        <Link className="hover:text-[var(--text-color)]" href={adminHref}>
          {t.admin}
        </Link>
      </div>

      <h1 className="font-heading text-5xl font-normal tracking-[-0.03em] text-[var(--text-color)] sm:text-7xl">
        {galleryTitle}
      </h1>
      <p className="mt-3 text-xs uppercase tracking-[0.3em] text-[var(--muted-color)]">
        {artistName}
      </p>
    </header>
  );
}
