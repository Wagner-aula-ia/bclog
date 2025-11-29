import type { KanbanPallet, KanbanStatus } from "@shared/schema";
import { KanbanPalletCard } from "./kanban-pallet-card";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KanbanColumnProps {
  status: KanbanStatus;
  pallets: KanbanPallet[];
  onAddPallet: () => void;
  onViewPallet: (pallet: KanbanPallet) => void;
  onEditPallet: (pallet: KanbanPallet) => void;
  onMovePallet: (pallet: KanbanPallet, newStatus: KanbanStatus) => void;
  onExpeditePallet: (pallet: KanbanPallet) => void;
  onDeletePallet: (pallet: KanbanPallet) => void;
  isLoading?: boolean;
}

const columnConfig: Record<
  KanbanStatus,
  { title: string; subtitle: string; bgColor: string; headerBg: string; textColor: string }
> = {
  green: {
    title: "Verde",
    subtitle: "Pronto / Disponivel",
    bgColor: "bg-emerald-500/5",
    headerBg: "bg-emerald-500",
    textColor: "text-white",
  },
  yellow: {
    title: "Amarelo",
    subtitle: "Atencao / Pre-saida",
    bgColor: "bg-amber-500/5",
    headerBg: "bg-amber-500",
    textColor: "text-white",
  },
  red: {
    title: "Vermelho",
    subtitle: "Urgente / Saida imediata",
    bgColor: "bg-red-500/5",
    headerBg: "bg-red-500",
    textColor: "text-white",
  },
};

export function KanbanColumn({
  status,
  pallets,
  onAddPallet,
  onViewPallet,
  onEditPallet,
  onMovePallet,
  onExpeditePallet,
  onDeletePallet,
  isLoading,
}: KanbanColumnProps) {
  const config = columnConfig[status];

  if (isLoading) {
    return (
      <div
        className={`flex h-full flex-col rounded-lg ${config.bgColor} overflow-hidden`}
        data-testid={`kanban-column-${status}-loading`}
      >
        <div className={`${config.headerBg} px-4 py-3`}>
          <div className="h-5 w-20 animate-pulse rounded bg-white/20" />
        </div>
        <div className="flex-1 space-y-3 p-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-[140px] animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-full flex-col rounded-lg ${config.bgColor} overflow-hidden border`}
      data-testid={`kanban-column-${status}`}
    >
      <div className={`${config.headerBg} ${config.textColor} px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{config.title}</h3>
            <p className="text-xs opacity-80">{config.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-medium">
              {pallets.length}
            </span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-3 p-3">
          {pallets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <Package className="mb-2 h-8 w-8 opacity-50" />
              <p className="text-sm">Nenhum palete nesta fase</p>
            </div>
          ) : (
            pallets.map((pallet) => (
              <KanbanPalletCard
                key={pallet.id}
                pallet={pallet}
                onView={() => onViewPallet(pallet)}
                onEdit={() => onEditPallet(pallet)}
                onMove={(newStatus) => onMovePallet(pallet, newStatus)}
                onExpedite={() => onExpeditePallet(pallet)}
                onDelete={() => onDeletePallet(pallet)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-3">
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={onAddPallet}
          data-testid={`button-add-kanban-${status}`}
        >
          <Plus className="h-4 w-4" />
          Adicionar Palete
        </Button>
      </div>
    </div>
  );
}
