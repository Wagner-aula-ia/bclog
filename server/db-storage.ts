import type {
  PalletPosition,
  InsertPalletPosition,
  KanbanPallet,
  InsertKanbanPallet,
  DashboardStats,
  KanbanStatus,
  ProductFormData,
  MovementHistory,
  InsertMovementHistory,
} from "@shared/schema";
import { db } from "./db";
import { palletPositions, kanbanPallets, movementHistory } from "@shared/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { IStorage } from "./storage";

export class DbStorage implements IStorage {
  async initializePositions(): Promise<void> {
    const existingPositions = await db.select().from(palletPositions);
    
    if (existingPositions.length === 0) {
      const positions: any[] = [];
      
      for (let block = 1; block <= 2; block++) {
        for (let level = 1; level <= 5; level++) {
          for (const position of ["AP1", "AP2"] as const) {
            const id = `pos-${block}-${level}-${position}`;
            positions.push({
              id,
              block,
              level,
              position,
              isEmpty: true,
            });
          }
        }
      }
      
      await db.insert(palletPositions).values(positions);
    }
  }

  async getAllPositions(): Promise<PalletPosition[]> {
    const positions = await db.select().from(palletPositions);
    
    return positions
      .map(pos => ({
        id: pos.id,
        block: pos.block,
        level: pos.level,
        position: pos.position as "AP1" | "AP2",
        productName: pos.productName || undefined,
        productCode: pos.productCode || undefined,
        clientName: pos.clientName || undefined,
        quantity: pos.quantity || undefined,
        storageType: (pos.storageType as "granel" | "palete") || undefined,
        entryDate: pos.entryDate || undefined,
        address: pos.address || undefined,
        observations: pos.observations || undefined,
        isEmpty: pos.isEmpty,
      }))
      .sort((a, b) => {
        if (a.block !== b.block) return a.block - b.block;
        if (a.level !== b.level) return b.level - a.level;
        return a.position.localeCompare(b.position);
      });
  }

  async getPositionById(id: string): Promise<PalletPosition | undefined> {
    const result = await db.select().from(palletPositions).where(eq(palletPositions.id, id));
    
    if (result.length === 0) return undefined;
    
    const pos = result[0];
    return {
      id: pos.id,
      block: pos.block,
      level: pos.level,
      position: pos.position as "AP1" | "AP2",
      productName: pos.productName || undefined,
      productCode: pos.productCode || undefined,
      clientName: pos.clientName || undefined,
      quantity: pos.quantity || undefined,
      storageType: (pos.storageType as "granel" | "palete") || undefined,
      entryDate: pos.entryDate || undefined,
      address: pos.address || undefined,
      observations: pos.observations || undefined,
      isEmpty: pos.isEmpty,
    };
  }

  async updatePosition(
    id: string,
    data: Partial<ProductFormData>
  ): Promise<PalletPosition | undefined> {
    await db
      .update(palletPositions)
      .set({
        productName: data.productName,
        productCode: data.productCode,
        clientName: data.clientName,
        quantity: data.quantity,
        storageType: data.storageType,
        entryDate: data.entryDate,
        address: data.address,
        observations: data.observations,
        isEmpty: false,
      })
      .where(eq(palletPositions.id, id));

    return this.getPositionById(id);
  }

  async clearPosition(id: string): Promise<PalletPosition | undefined> {
    await db
      .update(palletPositions)
      .set({
        productName: null,
        productCode: null,
        clientName: null,
        quantity: null,
        storageType: null,
        entryDate: null,
        address: null,
        observations: null,
        isEmpty: true,
      })
      .where(eq(palletPositions.id, id));

    return this.getPositionById(id);
  }

  async getAllKanbanPallets(): Promise<KanbanPallet[]> {
    const pallets = await db.select().from(kanbanPallets);
    
    return pallets.map(pallet => ({
      id: pallet.id,
      status: pallet.status as KanbanStatus,
      productName: pallet.productName,
      productCode: pallet.productCode,
      clientName: pallet.clientName,
      quantity: pallet.quantity,
      storageType: (pallet.storageType as "granel" | "palete") || undefined,
      entryDate: pallet.entryDate,
      address: pallet.address || undefined,
      observations: pallet.observations || undefined,
    }));
  }

  async getKanbanPalletById(id: string): Promise<KanbanPallet | undefined> {
    const result = await db.select().from(kanbanPallets).where(eq(kanbanPallets.id, id));
    
    if (result.length === 0) return undefined;
    
    const pallet = result[0];
    return {
      id: pallet.id,
      status: pallet.status as KanbanStatus,
      productName: pallet.productName,
      productCode: pallet.productCode,
      clientName: pallet.clientName,
      quantity: pallet.quantity,
      storageType: (pallet.storageType as "granel" | "palete") || undefined,
      entryDate: pallet.entryDate,
      address: pallet.address || undefined,
      observations: pallet.observations || undefined,
    };
  }

  async createKanbanPallet(data: InsertKanbanPallet): Promise<KanbanPallet> {
    const id = randomUUID();
    
    await db.insert(kanbanPallets).values({
      id,
      status: data.status,
      productName: data.productName,
      productCode: data.productCode,
      clientName: data.clientName,
      quantity: data.quantity,
      storageType: data.storageType,
      entryDate: data.entryDate,
      address: data.address,
      observations: data.observations,
    });

    const pallet = await this.getKanbanPalletById(id);
    if (!pallet) throw new Error("Failed to create kanban pallet");
    
    return pallet;
  }

  async updateKanbanPallet(
    id: string,
    data: Partial<ProductFormData & { status: KanbanStatus }>
  ): Promise<KanbanPallet | undefined> {
    const updates: any = {};
    
    if (data.status !== undefined) updates.status = data.status;
    if (data.productName !== undefined) updates.productName = data.productName;
    if (data.productCode !== undefined) updates.productCode = data.productCode;
    if (data.clientName !== undefined) updates.clientName = data.clientName;
    if (data.quantity !== undefined) updates.quantity = data.quantity;
    if (data.storageType !== undefined) updates.storageType = data.storageType;
    if (data.entryDate !== undefined) updates.entryDate = data.entryDate;
    if (data.address !== undefined) updates.address = data.address;
    if (data.observations !== undefined) updates.observations = data.observations;

    await db
      .update(kanbanPallets)
      .set(updates)
      .where(eq(kanbanPallets.id, id));

    return this.getKanbanPalletById(id);
  }

  async deleteKanbanPallet(id: string): Promise<boolean> {
    const result = await db.delete(kanbanPallets).where(eq(kanbanPallets.id, id));
    return true;
  }

  async getStats(): Promise<DashboardStats> {
    const positions = await db.select().from(palletPositions);
    const pallets = await db.select().from(kanbanPallets);

    const occupiedPositions = positions.filter((p) => !p.isEmpty).length;

    return {
      totalPositions: positions.length,
      occupiedPositions,
      freePositions: positions.length - occupiedPositions,
      kanbanGreen: pallets.filter((p) => p.status === "green").length,
      kanbanYellow: pallets.filter((p) => p.status === "yellow").length,
      kanbanRed: pallets.filter((p) => p.status === "red").length,
    };
  }

  async getAllHistory(): Promise<MovementHistory[]> {
    const history = await db.select().from(movementHistory);
    
    return history
      .map(entry => ({
        id: entry.id,
        timestamp: entry.timestamp,
        type: entry.type as any,
        productName: entry.productName,
        productCode: entry.productCode,
        clientName: entry.clientName,
        quantity: entry.quantity,
        location: entry.location,
        previousLocation: entry.previousLocation || undefined,
        details: entry.details || undefined,
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async getHistoryByDateRange(
    startDate: string,
    endDate: string
  ): Promise<MovementHistory[]> {
    const history = await db.select().from(movementHistory);
    
    // Use UTC dates for consistent comparison with stored timestamps
    // Subtract 1 day from start and add 1 day to end to account for timezone differences
    const startDateObj = new Date(startDate + 'T00:00:00.000Z');
    startDateObj.setUTCDate(startDateObj.getUTCDate() - 1);
    const start = startDateObj;
    
    const endDateObj = new Date(endDate + 'T23:59:59.999Z');
    endDateObj.setUTCDate(endDateObj.getUTCDate() + 1);
    const end = endDateObj;

    return history
      .filter((entry) => {
        const timestamp = new Date(entry.timestamp).getTime();
        return timestamp >= start.getTime() && timestamp <= end.getTime();
      })
      .map(entry => ({
        id: entry.id,
        timestamp: entry.timestamp,
        type: entry.type as any,
        productName: entry.productName,
        productCode: entry.productCode,
        clientName: entry.clientName,
        quantity: entry.quantity,
        location: entry.location,
        previousLocation: entry.previousLocation || undefined,
        details: entry.details || undefined,
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async addHistoryEntry(entry: InsertMovementHistory): Promise<MovementHistory> {
    const id = randomUUID();
    
    await db.insert(movementHistory).values({
      id,
      timestamp: entry.timestamp,
      type: entry.type,
      productName: entry.productName,
      productCode: entry.productCode,
      clientName: entry.clientName,
      quantity: entry.quantity,
      location: entry.location,
      previousLocation: entry.previousLocation,
      details: entry.details,
    });

    const historyEntry = {
      id,
      ...entry,
    };

    return historyEntry;
  }
}
