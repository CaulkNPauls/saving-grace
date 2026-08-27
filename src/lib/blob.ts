import { put, del } from "@vercel/blob";
import sharp from "sharp";

const MAX_WIDTH = 1800;
const JPEG_QUALITY = 85;

/**
 * Takes a raw, just-uploaded blob URL, re-compresses it to a sane web size,
 * stores the optimized version under `folder/`, deletes the raw upload, and
 * returns the final public URL + pathname to persist on the DB row.
 */
export async function optimizeAndStoreBlob(
  rawUrl: string,
  folder: "tattoos" | "flash"
): Promise<{ url: string; pathname: string }> {
  const response = await fetch(rawUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch uploaded image: ${response.status}`);
  }
  const inputBuffer = Buffer.from(await response.arrayBuffer());
  const inputMeta = await sharp(inputBuffer).metadata();

  // Line-art/flash uploads usually arrive as PNG — keep them lossless so
  // JPEG ringing doesn't degrade crisp linework. Photos (JPEG in) stay JPEG.
  const preservePng = inputMeta.format === "png";

  const pipeline = sharp(inputBuffer)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true });

  const optimizedBuffer = preservePng
    ? await pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer()
    : await pipeline.jpeg({ quality: JPEG_QUALITY }).toBuffer();

  const extension = preservePng ? "png" : "jpg";
  const contentType = preservePng ? "image/png" : "image/jpeg";
  const filename = `${folder}/${crypto.randomUUID()}.${extension}`;
  const blob = await put(filename, optimizedBuffer, {
    access: "public",
    contentType,
    addRandomSuffix: false,
  });

  await del(rawUrl).catch(() => {
    // best-effort cleanup of the raw upload; not fatal if it fails
  });

  return { url: blob.url, pathname: blob.pathname };
}

export async function deleteBlobIfPresent(pathname: string | null) {
  if (!pathname) return;
  await del(pathname).catch(() => {
    // already gone or never existed — nothing to do
  });
}
