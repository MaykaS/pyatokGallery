import { setLocaleAction } from "@/app/actions";
import type { Dictionary, Locale } from "@/lib/types";

type LocaleToggleProps = {
  currentPath: string;
  locale: Locale;
  t: Dictionary;
};

export function LocaleToggle({ currentPath, locale, t }: LocaleToggleProps) {
  return (
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--muted-color)]">
      <LocaleButton
        currentPath={currentPath}
        isActive={locale === "en"}
        label={t.localeEnglish}
        locale="en"
      />
      <span>/</span>
      <LocaleButton
        currentPath={currentPath}
        isActive={locale === "ru"}
        label={t.localeRussian}
        locale="ru"
      />
    </div>
  );
}

type LocaleButtonProps = {
  currentPath: string;
  isActive: boolean;
  label: string;
  locale: Locale;
};

function LocaleButton({
  currentPath,
  isActive,
  label,
  locale,
}: LocaleButtonProps) {
  return (
    <form action={setLocaleAction}>
      <input name="locale" type="hidden" value={locale} />
      <input name="redirectTo" type="hidden" value={currentPath} />
      <button
        className={isActive ? "text-[var(--text-color)]" : "hover:text-[var(--text-color)]"}
        type="submit"
      >
        {label}
      </button>
    </form>
  );
}
