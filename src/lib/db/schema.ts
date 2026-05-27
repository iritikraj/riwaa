import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const websites = sqliteTable("websites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  prompt: text("prompt").notNull(),
  siteTitle: text("site_title").notNull(),
  theme: text("theme"),
  // New Asset Columns
  userImages: text("user_images"), // JSON array of Base64 strings
  floorPlan: text("floor_plan"),   // Base64 string
  mapsLink: text("maps_link"),
  brochure: text("brochure"),     // Base64 string
  videoUrl: text("video_url"),
  content: text("content", { mode: "json" }).notNull(),
  createdAt: text("created_at").default(new Date().toISOString()),
});

export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  websiteId: integer("website_id").references(() => websites.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message"),
  createdAt: text("created_at").default(new Date().toISOString()),
});

export const agents = sqliteTable("agents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  prompt: text("prompt").notNull(), // To store the snippet of their CV/bio
  name: text("name").notNull(),
  imageUrl: text("image_url"), // Specifically for their headshot
  content: text("content", { mode: "json" }).notNull(), // The AI-generated JSON
  createdAt: text("created_at").default(new Date().toISOString()),
});

export const agentLeads = sqliteTable("agent_leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  agentId: integer("agent_id").references(() => agents.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message"),
  createdAt: text("created_at").default(new Date().toISOString()),
});