import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { ensureAdminRequest } from "@/lib/auth";
import { deleteArtworkById, updateArtwork } from "@/lib/artworks";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const authError = await ensureAdminRequest();

  if (authError) {
    return authError;
  }

  const { id } = await context.params;
  const formData = await request.formData();

  try {
    const artwork = await updateArtwork(id, formData);

    revalidatePath("/");
    revalidatePath(`/art/${id}`);
    revalidatePath("/admin/dashboard");

    return NextResponse.json({ artwork });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to update artwork.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authError = await ensureAdminRequest();

  if (authError) {
    return authError;
  }

  const { id } = await context.params;

  try {
    await deleteArtworkById(id);

    revalidatePath("/");
    revalidatePath(`/art/${id}`);
    revalidatePath("/admin/dashboard");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to delete artwork.",
      },
      { status: 400 },
    );
  }
}
