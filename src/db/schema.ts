import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const tattooItems = pgTable("tattoo_items", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  imagePathname: text("image_pathname"),
  alt: text("alt").notNull(),
  title: text("title"),
  description: text("description"),
  featured: boolean("featured").notNull().default(false),
  visible: boolean("visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const flashPages = pgTable("flash_pages", {
  id: serial("id").primaryKey(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const flashItems = pgTable("flash_items", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id")
    .notNull()
    .references(() => flashPages.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  imagePathname: text("image_pathname"),
  title: text("title"),
  description: text("description"),
  sourceSheet: text("source_sheet"),
  available: boolean("available").notNull().default(true),
  visible: boolean("visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type TattooItem = typeof tattooItems.$inferSelect;
export type NewTattooItem = typeof tattooItems.$inferInsert;
export type FlashPage = typeof flashPages.$inferSelect;
export type FlashItem = typeof flashItems.$inferSelect;
export type NewFlashItem = typeof flashItems.$inferInsert;
