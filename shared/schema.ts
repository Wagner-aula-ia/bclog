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
