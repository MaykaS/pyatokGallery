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
    <main className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col px-4 pb-10 pt-0 sm:px-6 sm:pb-12">
      <SiteHeader
        adminHref="/admin"
        artistName={dictionary.artistName}
        currentPath={currentPath}
        galleryTitle={dictionary.galleryTitle}
        locale={locale}
        t={dictionary}
      />

      <section className="flex flex-col gap-[13px] px-0 pt-[18px] sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-1 flex flex-wrap items-center gap-2 sm:mx-0">
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

        <form action="/" className="w-full sm:w-auto">
          <input name="medium" type="hidden" value={mediumFilter} />
          <select
            className="ui-input min-h-[30px] w-full min-w-0 px-2 py-1 text-[12px] sm:w-auto"
            defaultValue={sortOrder}
            id="sort"
            name="sort"
          >
            <option value="newest">{dictionary.sortNewest}</option>
            <option value="oldest">{dictionary.sortOldest}</option>
          </select>
        </form>
      </section>

      <ArtworkGrid artworks={visibleArtworks} t={dictionary} />

      <footer className="px-4 pb-8 pt-9 text-center">
        <a
          className="text-[11px] tracking-[0.04em] text-[var(--muted-color)] hover:text-[var(--text-color)]"
          href="/admin"
        >
          {dictionary.admin}
        </a>
      </footer>
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
    "tag-chip transition-colors",
    isActive ? "tag-chip-active" : "tag-chip-idle",
  ].join(" ");
}
