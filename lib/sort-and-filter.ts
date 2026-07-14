import type { ArtworkRow } from "@/lib/types";

type SortAndFilterOptions = {
  artworks: ArtworkRow[];
  mediumFilter: string;
  sortOrder: "newest" | "oldest";
};

export function sortAndFilterArtworks({
  artworks,
  mediumFilter,
  sortOrder,
}: SortAndFilterOptions) {
  // The gallery page fetches all artworks once, then derives the filter chips from
  // that same list. This keeps the UI flexible when new media types are added,
  // because we never need to hardcode a separate list of categories.
  return artworks
    .filter((artwork) =>
      mediumFilter === "all" ? true : artwork.medium.trim() === mediumFilter,
    )
    .sort((left, right) => {
      const yearDifference = left.year - right.year;

      if (yearDifference !== 0) {
        return sortOrder === "oldest" ? yearDifference : -yearDifference;
      }

      const leftCreated = new Date(left.created_at).getTime();
      const rightCreated = new Date(right.created_at).getTime();

      return sortOrder === "oldest"
        ? leftCreated - rightCreated
        : rightCreated - leftCreated;
    });
}
