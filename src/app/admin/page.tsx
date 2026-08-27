import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-wide text-bone">Dashboard</h1>
      <p className="mt-3 max-w-xl font-serif text-base text-parchment/80">
        Manage the tattoo gallery and the flash book. Changes show up on the live site right away.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Link
          href="/admin/tattoos"
          className="border border-bone/20 bg-ink p-6 transition-colors hover:border-oxblood-bright"
        >
          <h2 className="font-display text-xl uppercase tracking-wide text-bone">Tattoo Gallery</h2>
          <p className="mt-2 font-serif text-sm text-parchment/70">
            Upload photos, mark work as Featured, reorder, edit captions, and control what&apos;s visible.
          </p>
        </Link>
        <Link
          href="/admin/flash"
          className="border border-bone/20 bg-ink p-6 transition-colors hover:border-oxblood-bright"
        >
          <h2 className="font-display text-xl uppercase tracking-wide text-bone">Flash Book</h2>
          <p className="mt-2 font-serif text-sm text-parchment/70">
            Manage flash pages and artwork — add pieces, assign pages, reorder, mark availability.
          </p>
        </Link>
      </div>
    </div>
  );
}
