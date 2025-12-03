import type { PalletPosition } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, Edit2, Trash2, Plus, Package } from "lucide-react";

interface PalletPositionCardProps {
  position: PalletPosition;
  onAdd: () => void;
  onEdit: () => void;
  onView: () => void;
  onClear: () => void;
}

export function PalletPositionCard({
  position,
  onAdd,
  onEdit,
  onView,
  onClear,
}: PalletPositionCardProps) {
  const positionLabel = `N${position.level}-${position.position}`;

  if (position.isEmpty) {
    return (
      <Card
        className="group relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 bg-muted/30 transition-all hover-elevate"
        onClick={onAdd}
        data-testid={`position-empty-${position.block}-${position.level}-${position.position}`}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground transition-colors group-hover:text-foreground">
          <Plus className="h-6 w-6" />
          <span className="text-xs font-medium">{positionLabel}</span>
          <span className="text-[10px] opacity-70">Clique para adicionar</span>
        </div>
      </Card>
    );
  }

  const formattedDate = position.entryDate
    ? (() => {
        const [year, month, day] = position.entryDate.split("-");
        return `${day}/${month}/${year}`;
      })()
    : "";

  return (
    <Card
      className="group relative min-h-[120px] overflow-visible border bg-card p-3 transition-all hover-elevate"
      data-testid={`position-filled-${position.block}-${position.level}-${position.position}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
          {positionLabel}
        </span>
        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                }}
                data-testid={`button-view-${position.id}`}
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ver detalhes</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                data-testid={`button-edit-${position.id}`}
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                data-testid={`button-clear-${position.id}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Esvaziar</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10">
          <Package className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-sm font-semibold"
            title={position.productCode}
          >
            {position.productCode}
          </p>
          <p
            className="truncate text-xs text-muted-foreground"
            title={position.productName}
          >
            {position.productName}
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-medium">Qtd: {position.quantity}</span>
        <span>{formattedDate}</span>
      </div>

      {position.observations && (
        <p
          className="mt-1 truncate text-xs italic text-muted-foreground/70"
          title={position.observations}
        >
          {position.observations}
        </p>
      )}
    </Card>
  );
}
