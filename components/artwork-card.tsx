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
          className="w-full transition-transform duration-300 group-hover:scale-[1.005]"
          src={artwork.image_url}
        />
      </div>

      <div className="mt-[13px] text-center">
        <h2 className="font-heading text-[18px] italic text-[var(--text-color)]">
          {artwork.title}
        </h2>
        <p className="mt-1 text-[12px] text-[var(--muted-color)]">
          {artwork.medium}, {artwork.year}
        </p>
      </div>
    </Link>
  );
}
