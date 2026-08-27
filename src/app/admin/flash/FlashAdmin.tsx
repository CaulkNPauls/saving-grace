"use client";

import { useState } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { FlashPageWithItems } from "@/lib/data/flash";
import type { FlashItem } from "@/db/schema";
import { uploadRawFile } from "@/lib/admin-upload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function FlashAdmin({ initialPages }: { initialPages: FlashPageWithItems[] }) {
  const [pages, setPages] = useState(initialPages);
  const [creatingPage, setCreatingPage] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<
    { type: "page" | "item"; id: number } | null
  >(null);

  const pageSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function addPage() {
    setCreatingPage(true);
    const response = await fetch("/api/admin/flash-pages", { method: "POST" });
    const { page } = await response.json();
    setPages((current) => [...current, { ...page, items: [] }]);
    setCreatingPage(false);
  }

  async function deletePage(id: number) {
    setPendingDelete(null);
    const response = await fetch(`/api/admin/flash-pages/${id}`, { method: "DELETE" });
    if (response.ok) {
      setPages((current) => current.filter((page) => page.id !== id));
    }
  }

  async function deleteItem(pageId: number, itemId: number) {
    setPendingDelete(null);
    setPages((current) =>
      current.map((page) =>
        page.id === pageId ? { ...page, items: page.items.filter((item) => item.id !== itemId) } : page
      )
    );
    await fetch(`/api/admin/flash-items/${itemId}`, { method: "DELETE" });
  }

  async function patchItem(pageId: number, itemId: number, data: Partial<FlashItem>) {
    setPages((current) =>
      current.map((page) =>
        page.id === pageId
          ? {
              ...page,
              items: page.items.map((item) => (item.id === itemId ? { ...item, ...data } : item)),
            }
          : page
      )
    );
    await fetch(`/api/admin/flash-items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function moveItemToPage(fromPageId: number, itemId: number, toPageId: number) {
    if (fromPageId === toPageId) return;
    const fromPage = pages.find((page) => page.id === fromPageId);
    const item = fromPage?.items.find((entry) => entry.id === itemId);
    if (!item) return;
    const toPage = pages.find((page) => page.id === toPageId);
    const newSortOrder = toPage?.items.length ?? 0;

    setPages((current) =>
      current.map((page) => {
        if (page.id === fromPageId) {
          return { ...page, items: page.items.filter((entry) => entry.id !== itemId) };
        }
        if (page.id === toPageId) {
          return { ...page, items: [...page.items, { ...item, pageId: toPageId, sortOrder: newSortOrder }] };
        }
        return page;
      })
    );

    await fetch("/api/admin/flash-items/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: itemId, pageId: toPageId, sortOrder: newSortOrder }] }),
    });
  }

  async function reorderItemsWithinPage(pageId: number, event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const page = pages.find((entry) => entry.id === pageId);
    if (!page) return;

    const oldIndex = page.items.findIndex((item) => item.id === active.id);
    const newIndex = page.items.findIndex((item) => item.id === over.id);
    const reordered = arrayMove(page.items, oldIndex, newIndex);

    setPages((current) => current.map((entry) => (entry.id === pageId ? { ...entry, items: reordered } : entry)));

    await fetch("/api/admin/flash-items/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: reordered.map((item, index) => ({ id: item.id, pageId, sortOrder: index })),
      }),
    });
  }

  async function reorderPages(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = pages.findIndex((page) => page.id === active.id);
    const newIndex = pages.findIndex((page) => page.id === over.id);
    const reordered = arrayMove(pages, oldIndex, newIndex);
    setPages(reordered);

    await fetch("/api/admin/flash-pages/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: reordered.map((page) => page.id) }),
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wide text-bone">Flash Book</h1>
          <p className="mt-2 max-w-xl font-serif text-sm text-parchment/70">
            Organize flash into pages. Drag page headers to reorder pages, drag artwork to reorder within a page.
          </p>
        </div>
        <button
          type="button"
          onClick={addPage}
          disabled={creatingPage}
          className="shrink-0 border border-oxblood-bright bg-oxblood px-5 py-2.5 font-sans text-sm font-semibold uppercase tracking-wide text-bone hover:bg-oxblood-bright disabled:opacity-60"
        >
          {creatingPage ? "Adding…" : "+ New Page"}
        </button>
      </div>

      <DndContext
        id="flash-pages-dnd"
        sensors={pageSensors}
        collisionDetection={closestCenter}
        onDragEnd={reorderPages}
      >
        <SortableContext items={pages.map((page) => page.id)} strategy={verticalListSortingStrategy}>
          <div className="mt-8 flex flex-col gap-8">
            {pages.map((page, pageIndex) => (
              <PageBlock
                key={page.id}
                page={page}
                pageNumber={pageIndex + 1}
                otherPages={pages
                  .map((p, index) => ({ id: p.id, number: index + 1 }))
                  .filter((p) => p.id !== page.id)}
                onDeletePage={() => setPendingDelete({ type: "page", id: page.id })}
                onReorderItems={(event) => reorderItemsWithinPage(page.id, event)}
                onDeleteItem={(itemId) => setPendingDelete({ type: "item", id: itemId })}
                onPatchItem={(itemId, data) => patchItem(page.id, itemId, data)}
                onMoveItem={(itemId, toPageId) => moveItemToPage(page.id, itemId, toPageId)}
                onUploaded={(item) =>
                  setPages((current) =>
                    current.map((entry) =>
                      entry.id === page.id ? { ...entry, items: [...entry.items, item] } : entry
                    )
                  )
                }
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {pages.length === 0 && (
        <p className="mt-8 font-serif text-sm text-parchment/60">
          No pages yet — click &ldquo;New Page&rdquo; to start the flash book.
        </p>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={pendingDelete?.type === "page" ? "Delete this page?" : "Delete this flash?"}
        message={
          pendingDelete?.type === "page"
            ? "This only works on an empty page. This can't be undone."
            : "This removes the artwork and its record permanently. This can't be undone."
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return;
          if (pendingDelete.type === "page") {
            deletePage(pendingDelete.id);
          } else {
            const page = pages.find((p) => p.items.some((item) => item.id === pendingDelete.id));
            if (page) deleteItem(page.id, pendingDelete.id);
          }
        }}
      />
    </div>
  );
}

function PageBlock({
  page,
  pageNumber,
  otherPages,
  onDeletePage,
  onReorderItems,
  onDeleteItem,
  onPatchItem,
  onMoveItem,
  onUploaded,
}: {
  page: FlashPageWithItems;
  pageNumber: number;
  otherPages: { id: number; number: number }[];
  onDeletePage: () => void;
  onReorderItems: (event: DragEndEvent) => void;
  onDeleteItem: (itemId: number) => void;
  onPatchItem: (itemId: number, data: Partial<FlashItem>) => void;
  onMoveItem: (itemId: number, toPageId: number) => void;
  onUploaded: (item: FlashItem) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: page.id,
  });
  const itemSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const titleInput = form.elements.namedItem("title") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) {
      setUploadError("Choose a photo.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    try {
      const rawUrl = await uploadRawFile(file);
      const response = await fetch("/api/admin/flash-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawUrl, pageId: page.id, title: titleInput.value }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Upload failed");
      }
      const { item } = await response.json();
      onUploaded(item);
      form.reset();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="border border-bone/15 bg-ink p-5">
      <div className="flex items-center justify-between border-b border-bone/10 pb-3">
        <div {...attributes} {...listeners} className="flex cursor-grab items-center gap-3 active:cursor-grabbing">
          <span aria-hidden="true" className="text-metal">⠿</span>
          <h2 className="font-display text-lg uppercase tracking-wide text-bone">Page {pageNumber}</h2>
          <span className="font-sans text-xs uppercase tracking-wide text-metal">
            {page.items.length} {page.items.length === 1 ? "piece" : "pieces"}
          </span>
        </div>
        <button
          type="button"
          onClick={onDeletePage}
          disabled={page.items.length > 0}
          title={page.items.length > 0 ? "Move or delete all flash on this page first" : "Delete empty page"}
          className="border border-oxblood/50 px-3 py-1 font-sans text-xs uppercase tracking-wide text-oxblood-bright hover:bg-oxblood/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Delete Page
        </button>
      </div>

      <form onSubmit={handleUpload} className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="font-sans text-xs uppercase tracking-wide text-metal">Photo</span>
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="border border-bone/20 bg-charcoal px-2 py-2 text-xs text-bone file:mr-2 file:border-0 file:bg-oxblood file:px-2 file:py-1 file:text-xs file:uppercase file:text-bone"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-sans text-xs uppercase tracking-wide text-metal">Title (optional)</span>
          <input name="title" className="border border-bone/20 bg-charcoal px-2 py-2 text-sm text-bone" />
        </label>
        <button
          type="submit"
          disabled={uploading}
          className="border border-oxblood-bright bg-oxblood px-4 py-2 font-sans text-xs font-semibold uppercase tracking-wide text-bone disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Add to Page"}
        </button>
        {uploadError && <p role="alert" className="font-sans text-xs text-oxblood-bright">{uploadError}</p>}
      </form>

      <DndContext
        id={`flash-items-page-${page.id}`}
        sensors={itemSensors}
        collisionDetection={closestCenter}
        onDragEnd={onReorderItems}
      >
        <SortableContext items={page.items.map((item) => item.id)} strategy={rectSortingStrategy}>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {page.items.map((item) => (
              <FlashCard
                key={item.id}
                item={item}
                otherPages={otherPages}
                onPatch={(data) => onPatchItem(item.id, data)}
                onDelete={() => onDeleteItem(item.id)}
                onMove={(toPageId) => onMoveItem(item.id, toPageId)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function FlashCard({
  item,
  otherPages,
  onPatch,
  onDelete,
  onMove,
}: {
  item: FlashItem;
  otherPages: { id: number; number: number }[];
  onPatch: (data: Partial<FlashItem>) => void;
  onDelete: () => void;
  onMove: (toPageId: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="border border-bone/15 bg-charcoal p-2">
      <div
        {...attributes}
        {...listeners}
        className="mb-1.5 flex cursor-grab items-center justify-between text-metal active:cursor-grabbing"
      >
        <span className="font-sans text-[0.6rem] uppercase tracking-widest">Drag</span>
        <span aria-hidden="true">⠿</span>
      </div>
      <div className="relative aspect-square w-full overflow-hidden bg-ink">
        <Image src={item.imageUrl} alt={item.title ?? "Flash artwork"} fill sizes="200px" className="object-contain p-1" />
      </div>
      {item.sourceSheet && (
        <p className="mt-1 truncate font-sans text-[0.6rem] uppercase tracking-wide text-metal" title={item.sourceSheet}>
          From: {item.sourceSheet}
        </p>
      )}
      <input
        defaultValue={item.title ?? ""}
        onBlur={(event) => onPatch({ title: event.target.value || null })}
        placeholder="Title"
        className="mt-2 w-full border border-bone/20 bg-ink px-2 py-1 text-xs text-bone"
      />
      <textarea
        defaultValue={item.description ?? ""}
        onBlur={(event) => onPatch({ description: event.target.value || null })}
        placeholder="Notes (optional)"
        rows={2}
        className="mt-1.5 w-full border border-bone/20 bg-ink px-2 py-1 text-xs text-bone"
      />
      <div className="mt-2 flex flex-col gap-1.5">
        <label className="flex items-center gap-1.5 font-sans text-[0.65rem] uppercase tracking-wide text-bone/80">
          <input
            type="checkbox"
            checked={item.available}
            onChange={(event) => onPatch({ available: event.target.checked })}
            className="h-3.5 w-3.5 accent-[#5a161b]"
          />
          Available
        </label>
        <label className="flex items-center gap-1.5 font-sans text-[0.65rem] uppercase tracking-wide text-bone/80">
          <input
            type="checkbox"
            checked={item.visible}
            onChange={(event) => onPatch({ visible: event.target.checked })}
            className="h-3.5 w-3.5 accent-[#5a161b]"
          />
          Visible
        </label>
      </div>
      {otherPages.length > 0 && (
        <select
          onChange={(event) => {
            const toPageId = Number(event.target.value);
            if (toPageId) onMove(toPageId);
            event.target.value = "";
          }}
          defaultValue=""
          className="mt-2 w-full border border-bone/20 bg-ink px-1.5 py-1 text-[0.65rem] text-bone"
        >
          <option value="" disabled>
            Move to page…
          </option>
          {otherPages.map((page) => (
            <option key={page.id} value={page.id}>
              Page {page.number}
            </option>
          ))}
        </select>
      )}
      <button
        type="button"
        onClick={onDelete}
        className="mt-2 w-full border border-oxblood/50 px-2 py-1 font-sans text-[0.65rem] uppercase tracking-wide text-oxblood-bright hover:bg-oxblood/10"
      >
        Delete
      </button>
    </div>
  );
}
