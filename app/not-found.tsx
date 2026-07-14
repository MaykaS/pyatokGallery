import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-4 text-center sm:px-6">
      <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted-color)]">
        Artwork Not Found
      </p>
      <h1 className="mt-4 font-heading text-5xl text-[var(--text-color)]">
        This piece is no longer in the gallery.
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-[var(--soft-text-color)]">
        The link may be old, or the artwork may have been removed from the public
        collection.
      </p>
      <Link className="ui-button mt-8" href="/">
        Return to gallery
      </Link>
    </main>
  );
}
