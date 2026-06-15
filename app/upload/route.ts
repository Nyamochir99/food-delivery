import { put, del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { isVercelBlobUrl } from "@/lib/blob-utils";

const MAX_FILE_SIZE = 4.5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function PUT(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const form = await request.formData();
  const file = form.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { message: "Only JPEG, PNG, WebP, or GIF images are allowed" },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { message: "Image must be smaller than 4.5MB" },
      { status: 400 },
    );
  }

  try {
    const blob = await put(`foods/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Blob upload failed:", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const url = request.nextUrl.searchParams.get("url");

  if (!url || !isVercelBlobUrl(url)) {
    return NextResponse.json({ message: "Invalid blob url" }, { status: 400 });
  }

  try {
    await del(url);
    return NextResponse.json({ message: "Image deleted" });
  } catch (error) {
    console.error("Blob delete failed:", error);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
