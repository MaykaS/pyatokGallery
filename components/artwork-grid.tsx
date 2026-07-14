import { ArtworkCard } from "@/components/artwork-card";
import type { ArtworkRow, Dictionary } from "@/lib/types";

type ArtworkGridProps = {
  artworks: ArtworkRow[];
  t: Dictionary;
};

export function ArtworkGrid({ artworks, t }: ArtworkGridProps) {
  if (artworks.length === 0) {
    return (
      <div className="mt-12 border border-[var(--border-color)] px-6 py-10 text-center text-sm leading-7 text-[var(--muted-color)]">
        {t.noArtworks}
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-x-4 gap-y-8 px-0 pb-0 pt-[24px] sm:gap-x-6 sm:gap-y-9 sm:pt-[27px] sm:grid-cols-3">
      {artworks.map((artwork) => (
        <ArtworkCard artwork={artwork} key={artwork.id} />
      ))}
    </section>
  );
}
