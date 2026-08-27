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
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TattooItem } from "@/db/schema";
import { uploadRawFile } from "@/lib/admin-upload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function TattoosAdmin({ initialItems }: { initialItems: TattooItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const altInput = form.elements.namedItem("alt") as HTMLInputElement;
    const titleInput = form.elements.namedItem("title") as HTMLInputElement;
    const descriptionInput = form.elements.namedItem("description") as HTMLTextAreaElement;
    const file = fileInput.files?.[0];

    if (!file || !altInput.value) {
      setUploadError("Choose a photo and describe it in the alt text.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const rawUrl = await uploadRawFile(file);
      const response = await fetch("/api/admin/tattoos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawUrl,
          alt: altInput.value,
          title: titleInput.value,
          description: descriptionInput.value,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Upload failed");
      }

      const { item } = await response.json();
      setItems((current) => [...current, item]);
      form.reset();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function patchItem(id: number, data: Partial<TattooItem>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...data } : item)));
    await fetch(`/api/admin/tattoos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function handleDelete(id: number) {
    setPendingDeleteId(null);
    setItems((current) => current.filter((item) => item.id !== id));
    await fetch(`/api/admin/tattoos/${id}`, { method: "DELETE" });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    await fetch("/api/admin/tattoos/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: reordered.map((item) => item.id) }),
    });
  }

  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-wide text-bone">Tattoo Gallery</h1>
      <p className="mt-2 max-w-xl font-serif text-sm text-parchment/70">
        Upload photos, mark work as Featured to show it on the homepage, and drag to reorder.
      </p>

      <form
        onSubmit={handleUpload}
        className="mt-8 grid gap-4 border border-bone/15 bg-ink p-6 sm:grid-cols-2"
      >
        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="font-sans text-xs uppercase tracking-wide text-metal">Photo</span>
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="border border-bone/20 bg-charcoal px-3 py-3 text-xs text-bone file:mr-3 file:border-0 file:bg-oxblood file:px-3 file:py-2 file:text-xs file:uppercase file:text-bone"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-sans text-xs uppercase tracking-wide text-metal">Alt text *</span>
          <input
            type="text"
            name="alt"
            required
            placeholder="What's shown in the photo"
            className="border border-bone/20 bg-charcoal px-3 py-2 text-bone"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-sans text-xs uppercase tracking-wide text-metal">Title</span>
          <input
            type="text"
            name="title"
            placeholder="Optional"
            className="border border-bone/20 bg-charcoal px-3 py-2 text-bone"
          />
        </label>
        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className="font-sans text-xs uppercase tracking-wide text-metal">Description</span>
          <textarea
            name="description"
            rows={2}
            placeholder="Optional"
            className="border border-bone/20 bg-charcoal px-3 py-2 text-bone"
          />
        </label>
        {uploadError && (
          <p role="alert" className="font-sans text-sm text-oxblood-bright sm:col-span-2">
            {uploadError}
          </p>
        )}
        <button
          type="submit"
          disabled={uploading}
          className="justify-self-start border border-oxblood-bright bg-oxblood px-6 py-2.5 font-sans text-sm font-semibold uppercase tracking-wide text-bone hover:bg-oxblood-bright disabled:cursor-wait disabled:opacity-60 sm:col-span-2"
        >
          {uploading ? "Uploading…" : "Add Tattoo"}
        </button>
      </form>

      <DndContext
        id="tattoos-dnd"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <TattooCard
                key={item.id}
                item={item}
                onPatch={(data) => patchItem(item.id, data)}
                onDelete={() => setPendingDeleteId(item.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {items.length === 0 && (
        <p className="mt-8 font-serif text-sm text-parchment/60">No tattoos yet — add one above.</p>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete this tattoo?"
        message="This removes the photo and its record permanently. This can't be undone."
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => pendingDeleteId !== null && handleDelete(pendingDeleteId)}
      />
    </div>
  );
}

function TattooCard({
  item,
  onPatch,
  onDelete,
}: {
  item: TattooItem;
  onPatch: (data: Partial<TattooItem>) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });
  const [title, setTitle] = useState(item.title ?? "");
  const [alt, setAlt] = useState(item.alt);
  const [description, setDescription] = useState(item.description ?? "");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const dirty = title !== (item.title ?? "") || alt !== item.alt || description !== (item.description ?? "");

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border border-bone/15 bg-ink p-3"
    >
      <div
        {...attributes}
        {...listeners}
        className="mb-2 flex cursor-grab items-center justify-between text-metal active:cursor-grabbing"
      >
        <span className="font-sans text-[0.65rem] uppercase tracking-widest">Drag to reorder</span>
        <span aria-hidden="true">⠿</span>
      </div>

      <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal">
        <Image src={item.imageUrl} alt={item.alt} fill sizes="300px" className="object-cover" />
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          className="border border-bone/20 bg-charcoal px-2 py-1.5 text-sm text-bone"
        />
        <input
          value={alt}
          onChange={(event) => setAlt(event.target.value)}
          placeholder="Alt text"
          className="border border-bone/20 bg-charcoal px-2 py-1.5 text-sm text-bone"
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description"
          rows={2}
          className="border border-bone/20 bg-charcoal px-2 py-1.5 text-sm text-bone"
        />
        {dirty && (
          <button
            type="button"
            onClick={() => onPatch({ title: title || null, alt, description: description || null })}
            className="border border-oxblood-bright bg-oxblood px-3 py-1.5 font-sans text-xs uppercase tracking-wide text-bone"
          >
            Save Changes
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-bone/10 pt-3">
        <label className="flex items-center gap-2 font-sans text-xs uppercase tracking-wide text-bone/80">
          <input
            type="checkbox"
            checked={item.featured}
            onChange={(event) => onPatch({ featured: event.target.checked })}
            className="h-4 w-4 accent-[#5a161b]"
          />
          Featured
        </label>
        <label className="flex items-center gap-2 font-sans text-xs uppercase tracking-wide text-bone/80">
          <input
            type="checkbox"
            checked={item.visible}
            onChange={(event) => onPatch({ visible: event.target.checked })}
            className="h-4 w-4 accent-[#5a161b]"
          />
          Visible
        </label>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="mt-3 w-full border border-oxblood/50 px-3 py-1.5 font-sans text-xs uppercase tracking-wide text-oxblood-bright hover:bg-oxblood/10"
      >
        Delete
      </button>
    </div>
  );
}
