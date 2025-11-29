import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { productFormSchema, insertKanbanPalletSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Get all pallet positions
  app.get("/api/positions", async (_req, res) => {
    try {
      const positions = await storage.getAllPositions();
      res.json(positions);
    } catch (error) {
      console.error("Error fetching positions:", error);
      res.status(500).json({ error: "Failed to fetch positions" });
    }
  });

  // Update a pallet position (add/edit product)
  app.patch("/api/positions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = productFormSchema.parse(req.body);

      const position = await storage.updatePosition(id, validatedData);
      if (!position) {
        return res.status(404).json({ error: "Position not found" });
      }

      res.json(position);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error updating position:", error);
      res.status(500).json({ error: "Failed to update position" });
    }
  });

  // Clear a pallet position
  app.delete("/api/positions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const position = await storage.clearPosition(id);

      if (!position) {
        return res.status(404).json({ error: "Position not found" });
      }

      res.json(position);
    } catch (error) {
      console.error("Error clearing position:", error);
      res.status(500).json({ error: "Failed to clear position" });
    }
  });

  // Get all kanban pallets
  app.get("/api/kanban", async (_req, res) => {
    try {
      const pallets = await storage.getAllKanbanPallets();
      res.json(pallets);
    } catch (error) {
      console.error("Error fetching kanban pallets:", error);
      res.status(500).json({ error: "Failed to fetch kanban pallets" });
    }
  });

  // Create a kanban pallet
  app.post("/api/kanban", async (req, res) => {
    try {
      const validatedData = insertKanbanPalletSchema.parse(req.body);
      const pallet = await storage.createKanbanPallet(validatedData);
      res.status(201).json(pallet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error creating kanban pallet:", error);
      res.status(500).json({ error: "Failed to create kanban pallet" });
    }
  });

  // Update a kanban pallet (edit or move)
  app.patch("/api/kanban/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateSchema = productFormSchema.partial().extend({
        status: z.enum(["green", "yellow", "red"]).optional(),
      });
      const validatedData = updateSchema.parse(req.body);

      const pallet = await storage.updateKanbanPallet(id, validatedData);
      if (!pallet) {
        return res.status(404).json({ error: "Kanban pallet not found" });
      }

      res.json(pallet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Error updating kanban pallet:", error);
      res.status(500).json({ error: "Failed to update kanban pallet" });
    }
  });

  // Delete a kanban pallet (expedite or remove)
  app.delete("/api/kanban/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteKanbanPallet(id);

      if (!deleted) {
        return res.status(404).json({ error: "Kanban pallet not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting kanban pallet:", error);
      res.status(500).json({ error: "Failed to delete kanban pallet" });
    }
  });

  // Get dashboard stats
  app.get("/api/stats", async (_req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  return httpServer;
}
