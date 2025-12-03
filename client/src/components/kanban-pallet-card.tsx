import type { KanbanPallet, KanbanStatus } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package,
  ArrowRight,
  CheckCircle2,
  Eye,
  Edit2,
  MoreVertical,
  Trash2,
} from "lucide-react";

interface KanbanPalletCardProps {
  pallet: KanbanPallet;
  onView: () => void;
  onEdit: () => void;
  onMove: (newStatus: KanbanStatus) => void;
  onExpedite: () => void;
  onDelete: () => void;
}

const statusConfig: Record<
  KanbanStatus,
  { label: string; borderColor: string; bgColor: string; nextStatus: KanbanStatus | null }
> = {
  green: {
    label: "Disponivel",
    borderColor: "border-l-emerald-500",
    bgColor: "bg-emerald-500/10",
    nextStatus: "yellow",
  },
  yellow: {
    label: "Pre-saida",
    borderColor: "border-l-amber-500",
    bgColor: "bg-amber-500/10",
    nextStatus: "red",
  },
  red: {
    label: "Urgente",
    borderColor: "border-l-red-500",
    bgColor: "bg-red-500/10",
    nextStatus: null,
  },
};

const nextStatusLabels: Record<KanbanStatus, string> = {
  green: "Pre-saida",
  yellow: "Urgente",
  red: "Expedido",
};

export function KanbanPalletCard({
  pallet,
  onView,
  onEdit,
  onMove,
  onExpedite,
  onDelete,
}: KanbanPalletCardProps) {
  const config = statusConfig[pallet.status];
  const formattedDate = (() => {
    const [year, month, day] = pallet.entryDate.split("-");
    return `${day}/${month}/${year}`;
  })();

  const handleMoveNext = () => {
    if (config.nextStatus) {
      onMove(config.nextStatus);
    } else {
      onExpedite();
    }
  };

  return (
    <Card
      className={`group relative border-l-4 ${config.borderColor} overflow-visible p-3 transition-all hover-elevate`}
      data-testid={`kanban-pallet-${pallet.id}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded ${config.bgColor}`}
          >
            <Package className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold" data-testid={`text-name-${pallet.id}`}>
              {pallet.productName}
            </p>
            <p
              className="max-w-[140px] truncate text-xs text-muted-foreground"
              title={pallet.productCode}
            >
              {pallet.productCode}
            </p>
            <p
              className="max-w-[140px] truncate text-xs text-muted-foreground"
              title={pallet.clientName}
            >
              {pallet.clientName}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
              data-testid={`button-menu-${pallet.id}`}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onView} data-testid={`menu-view-${pallet.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit} data-testid={`menu-edit-${pallet.id}`}>
              <Edit2 className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
              data-testid={`menu-delete-${pallet.id}`}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remover
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
        <span><span className="font-bold text-foreground">Quantidade:</span> {pallet.quantity}</span>
        <span>{formattedDate}</span>
      </div>

      {pallet.observations && (
        <p
          className="mb-3 truncate text-xs italic text-muted-foreground/70"
          title={pallet.observations}
        >
          {pallet.observations}
        </p>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant={pallet.status === "red" ? "default" : "secondary"}
            className="w-full gap-2"
            onClick={handleMoveNext}
            data-testid={`button-move-${pallet.id}`}
          >
            {pallet.status === "red" ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Marcar Expedido
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4" />
                Mover para {nextStatusLabels[pallet.status]}
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {pallet.status === "red"
            ? "Marcar como expedido e liberar posicao"
            : `Mover para ${nextStatusLabels[pallet.status]}`}
        </TooltipContent>
      </Tooltip>
    </Card>
  );
}
