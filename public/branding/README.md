# /public/branding

- `saving-grace-logo.png` — the original supplied file, untouched. (Note:
  despite the `.png` extension it's actually JPEG-encoded — black ink /
  grayscale shading on a plain white background, no alpha channel.)
- `saving-grace-logo-transparent.png` — a mechanically derived transparent
  version used by the site. It was produced by reconstructing an alpha
  channel from luminance (`alpha = 255 − brightness`, ink color set to
  near-black) and cropping the dead white margin. No linework, shading, or
  composition was redrawn, stylized, or altered — this is the same
  artwork, just knocked out of its white background so it composites onto
  the paper/parchment sections instead of showing a white box. Regenerate
  it any time with `scratchpad`-style Pillow script if a new source file
  is supplied; do not hand-edit the pixels.

The homepage Hero displays the transparent logo once, at full size, on a
paper-toned panel. Do not add additional copies of the full logo
elsewhere in the site.
