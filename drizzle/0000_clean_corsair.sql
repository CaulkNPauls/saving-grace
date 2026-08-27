CREATE TABLE "flash_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_id" integer NOT NULL,
	"image_url" text NOT NULL,
	"image_pathname" text,
	"title" text,
	"description" text,
	"available" boolean DEFAULT true NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flash_pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tattoo_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"image_pathname" text,
	"alt" text NOT NULL,
	"title" text,
	"description" text,
	"featured" boolean DEFAULT false NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "flash_items" ADD CONSTRAINT "flash_items_page_id_flash_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."flash_pages"("id") ON DELETE cascade ON UPDATE no action;