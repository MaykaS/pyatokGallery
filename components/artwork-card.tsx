import Link from "next/link";

import type { ArtworkRow } from "@/lib/types";

type ArtworkCardProps = {
  artwork: ArtworkRow;
};

export function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <Link className="group block" href={`/art/${artwork.id}`}>
      <div className="art-plate overflow-hidden">
        <img
          alt={artwork.title}
          className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
          src={artwork.image_url}
        />
      </div>

      <div className="mt-4 text-center">
        <h2 className="font-heading text-3xl italic tracking-tight text-[var(--text-color)]">
          {artwork.title}
        </h2>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--muted-color)]">
          {artwork.medium}, {artwork.year}
        </p>
      </div>
    </Link>
  );
}
