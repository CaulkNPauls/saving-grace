import { upload } from "@vercel/blob/client";

/** Uploads a raw file straight to Blob storage from the browser, bypassing server body-size limits. */
export async function uploadRawFile(file: File): Promise<string> {
  const blob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/admin/blob-upload",
  });
  return blob.url;
}
