import { z } from "zod";
import { pgTable, varchar, integer, boolean, text } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Pallet Position (for Porta-Palete)
export const palletPositionSchema = z.object({
  id: z.string(),
  block: z.number().min(1).max(2), // Bloco 1 or Bloco 2
  level: z.number().min(1).max(5), // Níveis 1-5
  position: z.enum(["AP1", "AP2"]), // Posição AP1 or AP2
  productName: z.string().optional(),
  productCode: z.string().optional(),
  clientName: z.string().optional(),
  quantity: z.number().optional(),
  entryDate: z.string().optional(),
  observations: z.string().optional(),
  isEmpty: z.boolean(),
});

export type PalletPosition = z.infer<typeof palletPositionSchema>;

export const insertPalletPositionSchema = palletPositionSchema.omit({ id: true });
export type InsertPalletPosition = z.infer<typeof insertPalletPositionSchema>;

// Kanban Pallet
export const kanbanStatusSchema = z.enum(["green", "yellow", "red"]);
export type KanbanStatus = z.infer<typeof kanbanStatusSchema>;

export const kanbanPalletSchema = z.object({
  id: z.string(),
  status: kanbanStatusSchema,
  productName: z.string(),
  productCode: z.string(),
  clientName: z.string(),
  quantity: z.number(),
  entryDate: z.string(),
  observations: z.string().optional(),
});

export type KanbanPallet = z.infer<typeof kanbanPalletSchema>;

export const insertKanbanPalletSchema = kanbanPalletSchema.omit({ id: true });
export type InsertKanbanPallet = z.infer<typeof insertKanbanPalletSchema>;

// Storage type enum
export const storageTypeSchema = z.enum(["granel", "palete"]);
export type StorageType = z.infer<typeof storageTypeSchema>;

// Product form schema for validation
export const productFormSchema = z.object({
  productName: z.string().min(1, "Nome do produto é obrigatório"),
  productCode: z.string().min(1, "Código do produto é obrigatório"),
  clientName: z.string().min(1, "Nome do cliente é obrigatório"),
  quantity: z.number().min(1, "Quantidade deve ser maior que 0"),
  storageType: storageTypeSchema.default("palete"),
  entryDate: z.string().min(1, "Data de entrada é obrigatória"),
  observations: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

// Dashboard stats
export interface DashboardStats {
  totalPositions: number;
  occupiedPositions: number;
  freePositions: number;
  kanbanGreen: number;
  kanbanYellow: number;
  kanbanRed: number;
}

// Movement History - tracks all warehouse actions
export const movementTypeSchema = z.enum([
  "entry",      // Product added to position
  "exit",       // Product removed/cleared from position
  "edit",       // Product details edited
  "kanban_add", // Pallet added to Kanban
  "kanban_move", // Pallet moved between Kanban statuses
  "kanban_expedite", // Pallet expedited (removed from Kanban)
]);

export type MovementType = z.infer<typeof movementTypeSchema>;

export const movementHistorySchema = z.object({
  id: z.string(),
  timestamp: z.string(), // ISO date string
  type: movementTypeSchema,
  productName: z.string(),
  productCode: z.string(),
  clientName: z.string(),
  quantity: z.number(),
  location: z.string(), // e.g., "Bloco 1, Nível 5, AP1" or "Kanban Verde"
  previousLocation: z.string().optional(), // For moves
  details: z.string().optional(), // Additional info
});

export type MovementHistory = z.infer<typeof movementHistorySchema>;

export const insertMovementHistorySchema = movementHistorySchema.omit({ id: true });
export type InsertMovementHistory = z.infer<typeof insertMovementHistorySchema>;

// Keep user schema for template compatibility
export const users = {
  id: "",
  username: "",
  password: "",
};

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = { id: string; username: string; password: string };

export const palletPositions = pgTable("pallet_positions", {
  id: varchar("id").primaryKey(),
  block: integer("block").notNull(),
  level: integer("level").notNull(),
  position: varchar("position", { length: 10 }).notNull(),
  productName: varchar("product_name", { length: 255 }),
  productCode: varchar("product_code", { length: 100 }),
  clientName: varchar("client_name", { length: 255 }),
  quantity: integer("quantity"),
  entryDate: varchar("entry_date", { length: 50 }),
  observations: text("observations"),
  isEmpty: boolean("is_empty").notNull().default(true),
});

export const kanbanPallets = pgTable("kanban_pallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  status: varchar("status", { length: 20 }).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productCode: varchar("product_code", { length: 100 }).notNull(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  quantity: integer("quantity").notNull(),
  entryDate: varchar("entry_date", { length: 50 }).notNull(),
  observations: text("observations"),
});

export const movementHistory = pgTable("movement_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: varchar("timestamp", { length: 50 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productCode: varchar("product_code", { length: 100 }).notNull(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  quantity: integer("quantity").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  previousLocation: varchar("previous_location", { length: 255 }),
  details: text("details"),
});
