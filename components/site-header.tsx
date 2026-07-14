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
    <header className="relative border-b border-[var(--border-color)] px-4 pb-7 pt-9 text-center sm:px-6 sm:pb-6 sm:pt-9">
      <div className="absolute right-4 top-9 flex items-center gap-[13px] whitespace-nowrap text-[12px] text-[var(--muted-color)] sm:right-6">
        <LocaleToggle currentPath={currentPath} locale={locale} t={t} />
        <span className="text-[var(--subtle-border-color)]">|</span>
        <Link className="text-[var(--muted-color)] hover:text-[var(--text-color)]" href={adminHref}>
          {t.admin}
        </Link>
      </div>

      <h1 className="font-heading text-[52px] font-normal leading-none tracking-[-0.01em] text-[var(--text-color)] sm:text-[52px]">
        {galleryTitle}
      </h1>
      <p className="mt-[9px] text-[12px] uppercase tracking-[0.18em] text-[var(--muted-color)]">
        {artistName}
      </p>
    </header>
  );
}
