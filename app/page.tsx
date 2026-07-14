import { ArtworkGrid } from "@/components/artwork-grid";
import { SiteHeader } from "@/components/site-header";
import { getLocaleDictionary, getLocaleFromCookie } from "@/lib/i18n";
import { getAllArtworks } from "@/lib/artworks";
import { sortAndFilterArtworks } from "@/lib/sort-and-filter";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<{
    medium?: string;
    sort?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const locale = await getLocaleFromCookie();
  const dictionary = getLocaleDictionary(locale);
  const artworks = await getAllArtworks();

  const sortOrder = params.sort === "oldest" ? "oldest" : "newest";
  const mediumFilter = params.medium?.trim() ? params.medium.trim() : "all";

  const mediums = Array.from(
    new Set(
      artworks
        .map((artwork) => artwork.medium.trim())
        .filter((medium) => medium.length > 0),
    ),
  ).sort((left, right) => left.localeCompare(right));

  const visibleArtworks = sortAndFilterArtworks({
    artworks,
    mediumFilter,
    sortOrder,
  });

  const currentPath = `/${buildGalleryQuery(sortOrder, mediumFilter)}`;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <SiteHeader
        adminHref="/admin"
        artistName={dictionary.artistName}
        currentPath={currentPath}
        galleryTitle={dictionary.galleryTitle}
        locale={locale}
        t={dictionary}
      />

      <section className="mt-8 flex flex-col gap-3 border-t border-[var(--border-color)] pt-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <a
            className={getChipClassName(mediumFilter === "all")}
            href={`/${buildGalleryQuery(sortOrder, "all")}`}
          >
            {dictionary.all}
          </a>

          {mediums.map((medium) => (
            <a
              key={medium}
              className={getChipClassName(mediumFilter === medium)}
              href={`/${buildGalleryQuery(sortOrder, medium)}`}
            >
              {medium}
            </a>
          ))}
        </div>

        <form action="/" className="flex items-center gap-2">
          <input name="medium" type="hidden" value={mediumFilter} />
          <label className="ui-label" htmlFor="sort">
            {dictionary.sortLabel}
          </label>
          <select
            className="ui-input min-w-36"
            defaultValue={sortOrder}
            id="sort"
            name="sort"
          >
            <option value="newest">{dictionary.sortNewest}</option>
            <option value="oldest">{dictionary.sortOldest}</option>
          </select>
          <button className="ui-button" type="submit">
            {dictionary.apply}
          </button>
        </form>
      </section>

      <ArtworkGrid artworks={visibleArtworks} t={dictionary} />
    </main>
  );
}

function buildGalleryQuery(sortOrder: "newest" | "oldest", mediumFilter: string) {
  const searchParams = new URLSearchParams();

  if (sortOrder !== "newest") {
    searchParams.set("sort", sortOrder);
  }

  if (mediumFilter !== "all") {
    searchParams.set("medium", mediumFilter);
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

function getChipClassName(isActive: boolean) {
  return [
    "inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.18em] transition-colors",
    isActive
      ? "border-[var(--text-color)] text-[var(--text-color)]"
      : "border-[var(--border-color)] text-[var(--muted-color)] hover:border-[var(--text-color)] hover:text-[var(--text-color)]",
  ].join(" ");
}
