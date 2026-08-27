/**
 * Developer-side utility for cropping individual flash designs out of a
 * multi-design flash sheet photo, without redrawing/altering the artwork.
 *
 * Not part of the public admin — this is a one-time-per-sheet-batch import
 * step. Workflow for a new batch of sheets:
 *   1. Drop the sheet photos in a folder (e.g. source-assets/flash-sheets/originals).
 *   2. Generate grid-overlay previews (see scripts history / git log for the
 *      grid-overlay helper) and visually read off each design's bounding
 *      box in the 900px-wide coordinate space.
 *   3. Fill in SRC_DIR/OUT_DIR and the SHEETS table below with the new
 *      filenames + boxes, then run: node scripts/extract-flash-designs.js
 *   4. Review the crops, adjust boxes for anything clipped, re-run.
 *   5. Run scripts/import-flash-designs.js to upload + create DB rows.
 *
 * The SHEETS table below reflects the specific 2026-08-27 import batch —
 * replace it for a new batch rather than appending, to avoid re-cropping.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join("source-assets", "flash-sheets", "originals");
const OUT_DIR = path.join("source-assets", "flash-sheets", "cropped-designs");
const DISPLAY_WIDTH = 900; // matches the grid-overlay preview width used to eyeball boxes
const MARGIN_DISPLAY_PX = 14; // small natural margin, in the same 900px-wide coordinate space

fs.mkdirSync(OUT_DIR, { recursive: true });

// Boxes are [x0, y0, x1, y1] in the 900px-wide grid-overlay coordinate space.
const SHEETS = {
  "IMG_0635.JPG": {
    prefix: "flash-page-01",
    designs: [
      ["design-01-scorpion-skull", 60, 50, 420, 465],
      ["design-02-moth-beetle-skull", 435, 90, 805, 475],
      ["design-03-fly-skull-small", 45, 490, 245, 655],
      ["design-04-spider-skull", 290, 495, 615, 835],
      ["design-05-skull-chain", 675, 410, 830, 1035],
      ["design-06-moth-skull-large", 5, 760, 412, 1215],
      ["design-07-fly-skull-bottom", 590, 1070, 805, 1235],
    ],
  },
  "IMG_0707.jpeg": {
    prefix: "flash-page-02",
    designs: [["design-01-dagger-mouse", 40, 120, 855, 1210]],
  },
  "IMG_0733.JPG": {
    prefix: "flash-page-03",
    designs: [
      ["design-01-boot-skull-flames", 60, 50, 290, 400],
      ["design-02-lighter-flame-web", 275, 90, 535, 455],
      ["design-03-spiderweb-bow", 600, 30, 805, 275],
      ["design-04-pinup-face", 595, 315, 835, 595],
      ["design-05-wishbone-sparkler", 60, 445, 280, 630],
      ["design-06-raisin-hell-text", 285, 465, 615, 835],
      ["design-07-lucky-777-text", 685, 620, 835, 705],
      ["design-08-skeleton-cowboy", 60, 660, 290, 1010],
      ["design-09-cactus-sun", 585, 755, 735, 980],
      ["design-10-dice", 60, 1040, 275, 1235],
      ["design-11-matchbox-rose", 270, 980, 545, 1235],
      ["design-12-eightball-flames", 560, 930, 865, 1235],
    ],
  },
  "IMG_0739.JPG": {
    prefix: "flash-page-04",
    designs: [
      ["design-01-cowgirl-heart-glasses", 25, 60, 415, 505],
      ["design-02-cowgirl-red-hat", 455, 35, 855, 605],
      ["design-03-longhorn-pinup", 0, 480, 585, 1045],
      ["design-04-whip-cowgirl", 485, 710, 865, 1235],
    ],
  },
  "IMG_6364.png": {
    prefix: "flash-page-05",
    designs: [
      ["design-01-pumpkin-vampiress", 90, 550, 445, 1175],
      ["design-02-bat-devil-pinup", 460, 445, 835, 905],
      ["design-03-witch-broom-pinup", 295, 1040, 705, 1565],
    ],
  },
  "IMG_6365.png": {
    prefix: "flash-page-06",
    designs: [
      ["design-01-bride-frankenstein-pinup", 70, 380, 395, 1095],
      ["design-02-elvira-pinup", 485, 380, 795, 1040],
      ["design-03-morticia-pinup", 285, 830, 665, 1495],
    ],
  },
};

async function main() {
  const manifest = [];

  for (const [filename, sheet] of Object.entries(SHEETS)) {
    const srcPath = path.join(SRC_DIR, filename);
    const rotatedBuffer = await sharp(srcPath).rotate().toBuffer();
    const meta = await sharp(rotatedBuffer).metadata();
    const scale = meta.width / DISPLAY_WIDTH;
    const margin = Math.round(MARGIN_DISPLAY_PX * scale);

    for (const [name, x0, y0, x1, y1] of sheet.designs) {
      const left = Math.max(0, Math.round(x0 * scale) - margin);
      const top = Math.max(0, Math.round(y0 * scale) - margin);
      const right = Math.min(meta.width, Math.round(x1 * scale) + margin);
      const bottom = Math.min(meta.height, Math.round(y1 * scale) + margin);
      const width = right - left;
      const height = bottom - top;

      const outName = `${sheet.prefix}-${name}.png`;
      const outPath = path.join(OUT_DIR, outName);

      await sharp(rotatedBuffer)
        .extract({ left, top, width, height })
        .png()
        .toFile(outPath);

      manifest.push({
        file: outName,
        sourceSheet: filename,
        width,
        height,
      });
      console.log("cropped", outName, `${width}x${height}`, "from", filename);
    }
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  console.log(`\nDone. ${manifest.length} designs extracted.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
