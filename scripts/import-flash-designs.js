/**
 * One-time import: uploads the cropped individual flash designs (produced by
 * _extract-flash.js from public/work/Flash pages/_designs) to Vercel Blob and
 * creates flash_pages/flash_items rows. Groups one page per source sheet.
 *
 * Run once per new batch of extracted designs: `node scripts/import-flash-designs.js`
 */
const { config } = require("dotenv");
config({ path: ".env.local" });

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { put } = require("@vercel/blob");
const { neon } = require("@neondatabase/serverless");

const DESIGNS_DIR = path.join("source-assets", "flash-sheets", "cropped-designs");
const MANIFEST_PATH = path.join(DESIGNS_DIR, "manifest.json");

function titleFromFilename(file) {
  // flash-page-03-design-06-raisin-hell-text.png -> "Raisin Hell Text"
  const match = file.match(/design-\d+-(.+)\.png$/);
  const slug = match ? match[1] : file.replace(/\.png$/, "");
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const sql = neon(process.env.DATABASE_URL);

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));

  // Group by source sheet, preserving manifest order within each group.
  const bySheet = new Map();
  for (const entry of manifest) {
    if (!bySheet.has(entry.sourceSheet)) bySheet.set(entry.sourceSheet, []);
    bySheet.get(entry.sourceSheet).push(entry);
  }

  const [{ n: existingPageCount }] = await sql`select count(*)::int as n from flash_pages`;
  let pageSortOrder = existingPageCount;
  let totalImported = 0;

  for (const [sourceSheet, entries] of bySheet) {
    const [page] = await sql`
      insert into flash_pages (sort_order) values (${pageSortOrder}) returning id
    `;
    pageSortOrder++;

    let itemSortOrder = 0;
    for (const entry of entries) {
      const filePath = path.join(DESIGNS_DIR, entry.file);
      const buffer = fs.readFileSync(filePath);

      const optimized = await sharp(buffer)
        .resize({ width: 1800, withoutEnlargement: true })
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toBuffer();

      const blobFilename = `flash/${crypto.randomUUID()}.png`;
      const blob = await put(blobFilename, optimized, {
        access: "public",
        contentType: "image/png",
        addRandomSuffix: false,
      });

      const title = titleFromFilename(entry.file);

      await sql`
        insert into flash_items
          (page_id, image_url, image_pathname, title, source_sheet, sort_order)
        values
          (${page.id}, ${blob.url}, ${blob.pathname}, ${title}, ${sourceSheet}, ${itemSortOrder})
      `;
      itemSortOrder++;
      totalImported++;
      console.log(`  + ${entry.file} -> page ${page.id} as "${title}"`);
    }
    console.log(`Page ${page.id}: ${entries.length} designs from ${sourceSheet}`);
  }

  console.log(`\nDone. Imported ${totalImported} flash designs across ${bySheet.size} pages.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
