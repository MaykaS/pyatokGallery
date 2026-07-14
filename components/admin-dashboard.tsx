"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import type { ArtworkRow, Dictionary } from "@/lib/types";

type AdminDashboardProps = {
  artworks: ArtworkRow[];
  t: Dictionary;
};

type FormState = {
  id: string | null;
  title: string;
  description: string;
  medium: string;
  year: string;
  dimensions: string;
  currentImageUrl: string;
};

const COMMON_MEDIA = ["Painting", "Ceramics", "Drawing", "Mixed Media"];

export function AdminDashboard({ artworks, t }: AdminDashboardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [editingArtworkId, setEditingArtworkId] = useState<string | null>(null);

  const editingArtwork = useMemo(
    () => artworks.find((artwork) => artwork.id === editingArtworkId) ?? null,
    [artworks, editingArtworkId],
  );

  const formDefaults = useMemo<FormState>(
    () =>
      editingArtwork
        ? {
            id: editingArtwork.id,
            title: editingArtwork.title,
            description: editingArtwork.description,
            medium: editingArtwork.medium,
            year: String(editingArtwork.year),
            dimensions: editingArtwork.dimensions ?? "",
            currentImageUrl: editingArtwork.image_url,
          }
        : {
            id: null,
            title: "",
            description: "",
            medium: "",
            year: "",
            dimensions: "",
            currentImageUrl: "",
          },
    [editingArtwork],
  );

  async function handleSubmit(formData: FormData) {
    setError("");
    setStatusMessage("");

    const endpoint = editingArtwork
      ? `/api/admin/artworks/${editingArtwork.id}`
      : "/api/admin/artworks";

    const method = editingArtwork ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      body: formData,
    });

    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(payload.error ?? t.saveError);
      return;
    }

    setEditingArtworkId(null);
    setStatusMessage(editingArtwork ? t.updatedMessage : t.createdMessage);
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleDelete(artwork: ArtworkRow) {
    if (!window.confirm(t.deleteConfirm)) {
      return;
    }

    setError("");
    setStatusMessage("");

    const response = await fetch(`/api/admin/artworks/${artwork.id}`, {
      method: "DELETE",
    });

    const payload = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(payload.error ?? t.deleteError);
      return;
    }

    if (editingArtworkId === artwork.id) {
      setEditingArtworkId(null);
    }

    setStatusMessage(t.deletedMessage);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <section className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)] lg:items-start">
      <div>
        <h2 className="font-heading text-3xl text-[var(--text-color)]">
          {editingArtwork ? t.editArtwork : t.uploadArtwork}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[var(--muted-color)]">
          {t.uploadHelp}
        </p>

        {statusMessage ? (
          <p className="mt-4 border border-[var(--border-color)] px-4 py-3 text-sm text-[var(--text-color)]">
            {statusMessage}
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 border border-[var(--border-color)] px-4 py-3 text-sm text-[var(--error-color)]">
            {error}
          </p>
        ) : null}

        <ArtworkEditorForm
          defaultValues={formDefaults}
          isPending={isPending}
          onCancelEdit={() => {
            setEditingArtworkId(null);
            setError("");
            setStatusMessage("");
          }}
          onSubmit={handleSubmit}
          showCancel={Boolean(editingArtwork)}
          t={t}
        />
      </div>

      <div>
        <h2 className="font-heading text-3xl text-[var(--text-color)]">
          {t.existingArtworks}
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {artworks.map((artwork) => (
            <article
              className="border border-[var(--border-color)] p-4"
              key={artwork.id}
            >
              <div className="mb-3 flex items-center justify-end gap-2">
                <button
                  className="icon-button"
                  onClick={() => setEditingArtworkId(artwork.id)}
                  title={t.edit}
                  type="button"
                >
                  <PencilIcon />
                </button>
                <button
                  className="icon-button"
                  onClick={() => void handleDelete(artwork)}
                  title={t.delete}
                  type="button"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="art-plate">
                <img
                  alt={artwork.title}
                  className="h-auto w-full object-cover"
                  src={artwork.image_url}
                />
              </div>

              <h3 className="mt-4 font-heading text-2xl italic text-[var(--text-color)]">
                {artwork.title}
              </h3>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--muted-color)]">
                {artwork.medium}, {artwork.year}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

type ArtworkEditorFormProps = {
  defaultValues: FormState;
  isPending: boolean;
  onCancelEdit: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  showCancel: boolean;
  t: Dictionary;
};

function ArtworkEditorForm({
  defaultValues,
  isPending,
  onCancelEdit,
  onSubmit,
  showCancel,
  t,
}: ArtworkEditorFormProps) {
  return (
    <form
      action={async (formData) => {
        await onSubmit(formData);
      }}
      className="mt-6 space-y-5"
      key={defaultValues.id ?? "new-artwork"}
    >
      <div className="space-y-2">
        <label className="ui-label" htmlFor="image">
          {t.image}
        </label>
        <input
          className="ui-file-input"
          id="image"
          name="image"
          type="file"
          accept="image/*"
        />
        {defaultValues.currentImageUrl ? (
          <div className="art-plate mt-4 max-w-xs">
            <img
              alt={defaultValues.title}
              className="h-auto w-full object-cover"
              src={defaultValues.currentImageUrl}
            />
          </div>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="ui-label" htmlFor="title">
            {t.title}
          </label>
          <input
            className="ui-input"
            defaultValue={defaultValues.title}
            id="title"
            name="title"
            required
            type="text"
          />
        </div>

        <div className="space-y-2">
          <label className="ui-label" htmlFor="year">
            {t.year}
          </label>
          <input
            className="ui-input"
            defaultValue={defaultValues.year}
            id="year"
            name="year"
            required
            type="number"
          />
        </div>

        <div className="space-y-2">
          <label className="ui-label" htmlFor="medium">
            {t.medium}
          </label>
          <input
            className="ui-input"
            defaultValue={defaultValues.medium}
            id="medium"
            list="medium-options"
            name="medium"
            required
            type="text"
          />
          <datalist id="medium-options">
            {COMMON_MEDIA.map((medium) => (
              <option key={medium} value={medium} />
            ))}
          </datalist>
        </div>

        <div className="space-y-2">
          <label className="ui-label" htmlFor="dimensions">
            {t.dimensions}
          </label>
          <input
            className="ui-input"
            defaultValue={defaultValues.dimensions}
            id="dimensions"
            name="dimensions"
            type="text"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="ui-label" htmlFor="description">
          {t.description}
        </label>
        <textarea
          className="ui-textarea"
          defaultValue={defaultValues.description}
          id="description"
          name="description"
          required
          rows={6}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="ui-button" disabled={isPending} type="submit">
          {showCancel ? t.saveChanges : t.addArtwork}
        </button>

        {showCancel ? (
          <button
            className="ui-button ui-button-muted"
            onClick={onCancelEdit}
            type="button"
          >
            {t.cancel}
          </button>
        ) : null}
      </div>
    </form>
  );
}

function PencilIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width="14"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width="14"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
