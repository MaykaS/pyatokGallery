import type { PostgrestError } from "@supabase/supabase-js";

import { getSupabaseServerClient } from "@/lib/supabase";
import type { ArtworkInsert, ArtworkRow, ArtworkUpdate } from "@/lib/types";

const STORAGE_BUCKET = "artwork-images";

export async function getAllArtworks() {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("artworks")
    .select("id, title, description, medium, year, image_url, created_at, dimensions")
    .order("created_at", { ascending: false });

  if (error) {
    throw buildSupabaseError("Unable to load artworks.", error);
  }

  return (data ?? []) as ArtworkRow[];
}

export async function getArtworkById(id: string) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("artworks")
    .select("id, title, description, medium, year, image_url, created_at, dimensions")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw buildSupabaseError("Unable to load artwork.", error);
  }

  return (data ?? null) as ArtworkRow | null;
}

export async function createArtwork(formData: FormData) {
  const artworkInput = parseArtworkFormData(formData);
  const image = formData.get("image");

  if (!(image instanceof File) || image.size === 0) {
    throw new Error("Please choose an image before saving a new artwork.");
  }

  const publicUrl = await uploadImageFile(image);
  const supabase = getSupabaseServerClient();

  const insertPayload: ArtworkInsert = {
    ...artworkInput,
    image_url: publicUrl,
  };

  const { data, error } = await supabase
    .from("artworks")
    .insert(insertPayload)
    .select("id, title, description, medium, year, image_url, created_at, dimensions")
    .single();

  if (error) {
    await deleteStorageFile(publicUrl);
    throw buildSupabaseError("Unable to save the artwork row.", error);
  }

  return data as ArtworkRow;
}

export async function updateArtwork(id: string, formData: FormData) {
  const existingArtwork = await getArtworkById(id);

  if (!existingArtwork) {
    throw new Error("Artwork not found.");
  }

  const artworkInput = parseArtworkFormData(formData);
  const image = formData.get("image");
  let nextImageUrl = existingArtwork.image_url;

  if (image instanceof File && image.size > 0) {
    nextImageUrl = await uploadImageFile(image);
  }

  const supabase = getSupabaseServerClient();
  const updatePayload: ArtworkUpdate = {
    ...artworkInput,
    image_url: nextImageUrl,
  };

  const { data, error } = await supabase
    .from("artworks")
    .update(updatePayload)
    .eq("id", id)
    .select("id, title, description, medium, year, image_url, created_at, dimensions")
    .single();

  if (error) {
    if (nextImageUrl !== existingArtwork.image_url) {
      await deleteStorageFile(nextImageUrl);
    }

    throw buildSupabaseError("Unable to update the artwork row.", error);
  }

  if (nextImageUrl !== existingArtwork.image_url) {
    await deleteStorageFile(existingArtwork.image_url);
  }

  return data as ArtworkRow;
}

export async function deleteArtworkById(id: string) {
  const existingArtwork = await getArtworkById(id);

  if (!existingArtwork) {
    throw new Error("Artwork not found.");
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("artworks").delete().eq("id", id);

  if (error) {
    throw buildSupabaseError("Unable to delete the artwork row.", error);
  }

  await deleteStorageFile(existingArtwork.image_url);
}

function parseArtworkFormData(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const medium = String(formData.get("medium") ?? "").trim();
  const yearValue = String(formData.get("year") ?? "").trim();
  const dimensions = String(formData.get("dimensions") ?? "").trim();

  if (!title || !medium || !yearValue) {
    throw new Error("Please fill in title, medium, and year.");
  }

  const year = Number(yearValue);

  if (!Number.isInteger(year)) {
    throw new Error("Year must be a whole number.");
  }

  return {
    title,
    description: description || null,
    medium,
    year,
    dimensions: dimensions || null,
  };
}

async function uploadImageFile(file: File) {
  const supabase = getSupabaseServerClient();

  // The storage path is generated on the server so the browser never needs direct
  // upload credentials or bucket logic. That keeps the admin UI simple and keeps
  // the storage naming rules in one place.
  const storagePath = `${Date.now()}-${sanitizeFileName(file.name)}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, fileBuffer, {
      cacheControl: "3600",
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    throw buildSupabaseError("Unable to upload image.", error);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);

  return publicUrl;
}

async function deleteStorageFile(publicUrl: string) {
  const storagePath = getStoragePathFromPublicUrl(publicUrl);

  if (!storagePath) {
    return;
  }

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);

  if (error) {
    throw buildSupabaseError("Unable to remove image from storage.", error);
  }
}

function getStoragePathFromPublicUrl(publicUrl: string) {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const markerIndex = publicUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return publicUrl.slice(markerIndex + marker.length);
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function buildSupabaseError(message: string, error: PostgrestError | Error) {
  return new Error(`${message} ${error.message}`);
}
