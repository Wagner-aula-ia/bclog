import type { KanbanPallet, KanbanStatus } from "@shared/schema";
import { KanbanColumn } from "./kanban-column";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Kanban } from "lucide-react";

interface KanbanSectionProps {
  pallets: KanbanPallet[];
  onAddPallet: (status: KanbanStatus) => void;
  onViewPallet: (pallet: KanbanPallet) => void;
  onEditPallet: (pallet: KanbanPallet) => void;
  onMovePallet: (pallet: KanbanPallet, newStatus: KanbanStatus) => void;
  onExpeditePallet: (pallet: KanbanPallet) => void;
  onDeletePallet: (pallet: KanbanPallet) => void;
  isLoading?: boolean;
}

export function KanbanSection({
  pallets,
  onAddPallet,
  onViewPallet,
  onEditPallet,
  onMovePallet,
  onExpeditePallet,
  onDeletePallet,
  isLoading,
}: KanbanSectionProps) {
  const greenPallets = pallets.filter((p) => p.status === "green");
  const yellowPallets = pallets.filter((p) => p.status === "yellow");
  const redPallets = pallets.filter((p) => p.status === "red");

  return (
    <Card data-testid="kanban-section">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 via-amber-500 to-red-500 text-white">
            <Kanban className="h-4 w-4" />
          </div>
          Kanban - Saida Rapida
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid min-h-[400px] gap-4 md:grid-cols-3">
          <KanbanColumn
            status="green"
            pallets={greenPallets}
            onAddPallet={() => onAddPallet("green")}
            onViewPallet={onViewPallet}
            onEditPallet={onEditPallet}
            onMovePallet={onMovePallet}
            onExpeditePallet={onExpeditePallet}
            onDeletePallet={onDeletePallet}
            isLoading={isLoading}
          />
          <KanbanColumn
            status="yellow"
            pallets={yellowPallets}
            onAddPallet={() => onAddPallet("yellow")}
            onViewPallet={onViewPallet}
            onEditPallet={onEditPallet}
            onMovePallet={onMovePallet}
            onExpeditePallet={onExpeditePallet}
            onDeletePallet={onDeletePallet}
            isLoading={isLoading}
          />
          <KanbanColumn
            status="red"
            pallets={redPallets}
            onAddPallet={() => onAddPallet("red")}
            onViewPallet={onViewPallet}
            onEditPallet={onEditPallet}
            onMovePallet={onMovePallet}
            onExpeditePallet={onExpeditePallet}
            onDeletePallet={onDeletePallet}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
