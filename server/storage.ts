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
  MovementType,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Pallet Positions
  getAllPositions(): Promise<PalletPosition[]>;
  getPositionById(id: string): Promise<PalletPosition | undefined>;
  updatePosition(id: string, data: Partial<ProductFormData>): Promise<PalletPosition | undefined>;
  clearPosition(id: string): Promise<PalletPosition | undefined>;

  // Kanban Pallets
  getAllKanbanPallets(): Promise<KanbanPallet[]>;
  getKanbanPalletById(id: string): Promise<KanbanPallet | undefined>;
  createKanbanPallet(data: InsertKanbanPallet): Promise<KanbanPallet>;
  updateKanbanPallet(
    id: string,
    data: Partial<ProductFormData & { status: KanbanStatus }>
  ): Promise<KanbanPallet | undefined>;
  deleteKanbanPallet(id: string): Promise<boolean>;

  // Stats
  getStats(): Promise<DashboardStats>;

  // Movement History
  getAllHistory(): Promise<MovementHistory[]>;
  getHistoryByDateRange(startDate: string, endDate: string): Promise<MovementHistory[]>;
  addHistoryEntry(entry: InsertMovementHistory): Promise<MovementHistory>;
}

export class MemStorage implements IStorage {
  private positions: Map<string, PalletPosition>;
  private kanbanPallets: Map<string, KanbanPallet>;
  private history: Map<string, MovementHistory>;

  constructor() {
    this.positions = new Map();
    this.kanbanPallets = new Map();
    this.history = new Map();
    this.initializePositions();
  }

  private initializePositions(): void {
    for (let block = 1; block <= 2; block++) {
      for (let level = 1; level <= 5; level++) {
        for (const position of ["AP1", "AP2"] as const) {
          const id = `pos-${block}-${level}-${position}`;
          this.positions.set(id, {
            id,
            block: block as 1 | 2,
            level,
            position,
            isEmpty: true,
          });
        }
      }
    }
  }

  async getAllPositions(): Promise<PalletPosition[]> {
    return Array.from(this.positions.values()).sort((a, b) => {
      if (a.block !== b.block) return a.block - b.block;
      if (a.level !== b.level) return b.level - a.level;
      return a.position.localeCompare(b.position);
    });
  }

  async getPositionById(id: string): Promise<PalletPosition | undefined> {
    return this.positions.get(id);
  }

  async updatePosition(
    id: string,
    data: Partial<ProductFormData>
  ): Promise<PalletPosition | undefined> {
    const position = this.positions.get(id);
    if (!position) return undefined;

    const updated: PalletPosition = {
      ...position,
      productName: data.productName ?? position.productName,
      productCode: data.productCode ?? position.productCode,
      clientName: data.clientName ?? position.clientName,
      quantity: data.quantity ?? position.quantity,
      entryDate: data.entryDate ?? position.entryDate,
      address: data.address ?? position.address,
      observations: data.observations ?? position.observations,
      isEmpty: false,
    };

    this.positions.set(id, updated);
    return updated;
  }

  async clearPosition(id: string): Promise<PalletPosition | undefined> {
    const position = this.positions.get(id);
    if (!position) return undefined;

    const cleared: PalletPosition = {
      id: position.id,
      block: position.block,
      level: position.level,
      position: position.position,
      isEmpty: true,
    };

    this.positions.set(id, cleared);
    return cleared;
  }

  async getAllKanbanPallets(): Promise<KanbanPallet[]> {
    return Array.from(this.kanbanPallets.values());
  }

  async getKanbanPalletById(id: string): Promise<KanbanPallet | undefined> {
    return this.kanbanPallets.get(id);
  }

  async createKanbanPallet(data: InsertKanbanPallet): Promise<KanbanPallet> {
    const id = randomUUID();
    const pallet: KanbanPallet = {
      id,
      status: data.status,
      productName: data.productName,
      productCode: data.productCode,
      clientName: data.clientName,
      quantity: data.quantity,
      entryDate: data.entryDate,
      address: data.address,
      observations: data.observations,
    };

    this.kanbanPallets.set(id, pallet);
    return pallet;
  }

  async updateKanbanPallet(
    id: string,
    data: Partial<ProductFormData & { status: KanbanStatus }>
  ): Promise<KanbanPallet | undefined> {
    const pallet = this.kanbanPallets.get(id);
    if (!pallet) return undefined;

    const updated: KanbanPallet = {
      ...pallet,
      status: data.status ?? pallet.status,
      productName: data.productName ?? pallet.productName,
      productCode: data.productCode ?? pallet.productCode,
      clientName: data.clientName ?? pallet.clientName,
      quantity: data.quantity ?? pallet.quantity,
      entryDate: data.entryDate ?? pallet.entryDate,
      address: data.address ?? pallet.address,
      observations: data.observations ?? pallet.observations,
    };

    this.kanbanPallets.set(id, updated);
    return updated;
  }

  async deleteKanbanPallet(id: string): Promise<boolean> {
    return this.kanbanPallets.delete(id);
  }

  async getStats(): Promise<DashboardStats> {
    const positions = Array.from(this.positions.values());
    const kanbanPallets = Array.from(this.kanbanPallets.values());

    const occupiedPositions = positions.filter((p) => !p.isEmpty).length;

    return {
      totalPositions: positions.length,
      occupiedPositions,
      freePositions: positions.length - occupiedPositions,
      kanbanGreen: kanbanPallets.filter((p) => p.status === "green").length,
      kanbanYellow: kanbanPallets.filter((p) => p.status === "yellow").length,
      kanbanRed: kanbanPallets.filter((p) => p.status === "red").length,
    };
  }

  async getAllHistory(): Promise<MovementHistory[]> {
    return Array.from(this.history.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getHistoryByDateRange(
    startDate: string,
    endDate: string
  ): Promise<MovementHistory[]> {
    // Use UTC dates for consistent comparison with stored timestamps
    // Subtract 1 day from start and add 1 day to end to account for timezone differences
    const startDateObj = new Date(startDate + 'T00:00:00.000Z');
    startDateObj.setUTCDate(startDateObj.getUTCDate() - 1);
    const start = startDateObj.getTime();
    
    const endDateObj = new Date(endDate + 'T23:59:59.999Z');
    endDateObj.setUTCDate(endDateObj.getUTCDate() + 1);
    const end = endDateObj.getTime();

    return Array.from(this.history.values())
      .filter((entry) => {
        const timestamp = new Date(entry.timestamp).getTime();
        return timestamp >= start && timestamp <= end;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async addHistoryEntry(entry: InsertMovementHistory): Promise<MovementHistory> {
    const id = randomUUID();
    const historyEntry: MovementHistory = {
      id,
      ...entry,
    };

    this.history.set(id, historyEntry);
    return historyEntry;
  }
}

import { DbStorage } from "./db-storage";

const dbStorage = new DbStorage();

dbStorage.initializePositions().catch(err => {
  console.error("Failed to initialize database positions:", err);
});

export const storage = dbStorage;
