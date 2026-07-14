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
    <header className="relative border-b border-[var(--border-color)] px-4 pb-7 pt-6 text-center sm:px-6 sm:pb-6 sm:pt-9">
      <div className="mb-5 flex flex-wrap items-center justify-center gap-[13px] text-[12px] text-[var(--muted-color)] sm:absolute sm:right-6 sm:top-9 sm:mb-0 sm:flex-nowrap">
        <LocaleToggle currentPath={currentPath} locale={locale} t={t} />
        <span className="text-[var(--subtle-border-color)]">|</span>
        <Link
          className="text-[var(--muted-color)] hover:text-[var(--text-color)]"
          href={adminHref}
        >
          {t.admin}
        </Link>
      </div>

      <h1 className="font-heading text-[40px] font-normal leading-none tracking-[-0.01em] text-[var(--text-color)] sm:text-[52px]">
        {galleryTitle}
      </h1>
      <p className="mt-[9px] text-[12px] uppercase tracking-[0.18em] text-[var(--muted-color)]">
        {artistName}
      </p>
    </header>
  );
}
