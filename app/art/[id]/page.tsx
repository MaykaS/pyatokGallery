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
    <main className="mx-auto flex min-h-screen w-full max-w-[900px] flex-col px-4 pb-8 pt-5 sm:px-6 sm:pt-6">
      <Link className="ui-link self-start" href="/">
        {dictionary.backToGallery}
      </Link>

      <section className="mx-auto mt-5 flex w-full flex-col items-center sm:mt-6">
        <div className="art-plate w-full max-w-[640px]">
          <img
            alt={artwork.title}
            className="h-auto w-full object-cover"
            src={artwork.image_url}
          />
        </div>

        <div className="mt-[18px] text-center">
          <h1 className="font-heading text-[24px] italic text-[var(--text-color)] sm:text-[26px]">
            {artwork.title}
          </h1>
          <p className="mt-[6px] text-[13px] text-[var(--muted-color)]">
            {artwork.medium}, {artwork.year}
          </p>

          {artwork.dimensions ? (
            <p className="mt-[2px] text-[13px] text-[var(--muted-color)]">
              {artwork.dimensions}
            </p>
          ) : null}
        </div>

        <p className="editorial-copy mt-6 max-w-[56ch] text-[15px] leading-[1.75] text-[var(--soft-text-color)] sm:leading-[1.7]">
          {artwork.description}
        </p>
      </section>
    </main>
  );
}
