import { z } from "zod";

// Pallet Position (for Porta-Palete)
export const palletPositionSchema = z.object({
  id: z.string(),
  block: z.number().min(1).max(2), // Bloco 1 or Bloco 2
  level: z.number().min(1).max(5), // Níveis 1-5
  position: z.enum(["AP1", "AP2"]), // Posição AP1 or AP2
  productName: z.string().optional(),
  productCode: z.string().optional(),
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
  quantity: z.number(),
  entryDate: z.string(),
  observations: z.string().optional(),
});

export type KanbanPallet = z.infer<typeof kanbanPalletSchema>;

export const insertKanbanPalletSchema = kanbanPalletSchema.omit({ id: true });
export type InsertKanbanPallet = z.infer<typeof insertKanbanPalletSchema>;

// Product form schema for validation
export const productFormSchema = z.object({
  productName: z.string().min(1, "Nome do produto é obrigatório"),
  productCode: z.string().min(1, "Código é obrigatório"),
  quantity: z.number().min(1, "Quantidade deve ser maior que 0"),
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
