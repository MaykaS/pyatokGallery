import Link from "next/link";
import { notFound } from "next/navigation";

import { getArtworkById } from "@/lib/artworks";
import { getLocaleDictionary, getLocaleFromCookie } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type ArtworkDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ArtworkDetailPage({
  params,
}: ArtworkDetailPageProps) {
  const { id } = await params;
  const locale = await getLocaleFromCookie();
  const dictionary = getLocaleDictionary(locale);
  const artwork = await getArtworkById(id);

  if (!artwork) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <Link className="ui-link self-start" href="/">
        {dictionary.backToGallery}
      </Link>

      <section className="mx-auto mt-8 flex w-full max-w-3xl flex-col items-center">
        <div className="art-plate w-full">
          <img
            alt={artwork.title}
            className="h-auto w-full object-cover"
            src={artwork.image_url}
          />
        </div>

        <div className="mt-6 text-center">
          <h1 className="font-heading text-4xl italic tracking-tight text-[var(--text-color)] sm:text-5xl">
            {artwork.title}
          </h1>
          <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[var(--muted-color)]">
            {artwork.medium}, {artwork.year}
          </p>

          {artwork.dimensions ? (
            <p className="mt-1 text-sm uppercase tracking-[0.16em] text-[var(--muted-color)]">
              {artwork.dimensions}
            </p>
          ) : null}
        </div>

        <p className="mt-8 max-w-2xl text-pretty text-base leading-8 text-[var(--soft-text-color)] sm:text-lg">
          {artwork.description}
        </p>
      </section>
    </main>
  );
}
