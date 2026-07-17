type PreviewOptions = {
  height?: number;
  quality?: number;
  resize?: "contain" | "cover" | "fill";
  width?: number;
};

export function getAdminPreviewUrl(
  publicUrl: string,
  {
    width = 360,
    height = 360,
    quality = 70,
    resize = "contain",
  }: PreviewOptions = {},
) {
  if (!publicUrl) {
    return publicUrl;
  }

  const objectMarker = "/storage/v1/object/public/";

  if (!publicUrl.includes(objectMarker)) {
    return publicUrl;
  }

  // Supabase documents transformed public URLs via getPublicUrl(..., { transform }).
  // Here we derive the equivalent render endpoint from an existing public URL so
  // the admin dashboard can request lighter previews without touching the stored
  // original or the public gallery URL.
  const renderUrl = publicUrl.replace(
    objectMarker,
    "/storage/v1/render/image/public/",
  );

  const previewUrl = new URL(renderUrl);

  previewUrl.searchParams.set("width", String(width));
  previewUrl.searchParams.set("height", String(height));
  previewUrl.searchParams.set("quality", String(quality));
  previewUrl.searchParams.set("resize", resize);

  return previewUrl.toString();
}
