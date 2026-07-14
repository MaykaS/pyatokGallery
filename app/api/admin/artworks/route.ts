import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { ensureAdminRequest } from "@/lib/auth";
import { createArtwork } from "@/lib/artworks";

export async function POST(request: Request) {
  const authError = await ensureAdminRequest();

  if (authError) {
    return authError;
  }

  const formData = await request.formData();

  try {
    const artwork = await createArtwork(formData);

    revalidatePath("/");
    revalidatePath("/admin/dashboard");

    return NextResponse.json({ artwork });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to create artwork.",
      },
      { status: 400 },
    );
  }
}
