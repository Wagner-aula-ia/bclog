import type { PalletPosition } from "@shared/schema";
import { PalletPositionCard } from "./pallet-position-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Layers } from "lucide-react";

interface WarehouseBlockProps {
  blockNumber: 1 | 2;
  positions: PalletPosition[];
  onAddProduct: (position: PalletPosition) => void;
  onEditProduct: (position: PalletPosition) => void;
  onViewProduct: (position: PalletPosition) => void;
  onClearPosition: (position: PalletPosition) => void;
  isLoading?: boolean;
}

export function WarehouseBlock({
  blockNumber,
  positions,
  onAddProduct,
  onEditProduct,
  onViewProduct,
  onClearPosition,
  isLoading,
}: WarehouseBlockProps) {
  const levels = [5, 4, 3, 2, 1];

  const getPositionByLevelAndSlot = (level: number, slot: "AP1" | "AP2") => {
    return positions.find((p) => p.level === level && p.position === slot);
  };

  if (isLoading) {
    return (
      <Card className="h-full" data-testid={`warehouse-block-${blockNumber}-loading`}>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {levels.map((level) => (
              <div key={level} className="flex gap-3">
                <div className="h-[120px] flex-1 animate-pulse rounded-lg bg-muted" />
                <div className="h-[120px] flex-1 animate-pulse rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full" data-testid={`warehouse-block-${blockNumber}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Layers className="h-4 w-4" />
          </div>
          BLOCO {blockNumber}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {levels.map((level) => (
            <div key={level} className="flex gap-3">
              <div className="flex w-12 shrink-0 items-center justify-center">
                <span className="text-lg font-medium text-muted-foreground">
                  N{level}
                </span>
              </div>
              <div className="grid flex-1 grid-cols-2 gap-3">
                {(["AP1", "AP2"] as const).map((slot) => {
                  const position = getPositionByLevelAndSlot(level, slot);
                  if (!position) return null;
                  return (
                    <PalletPositionCard
                      key={position.id}
                      position={position}
                      onAdd={() => onAddProduct(position)}
                      onEdit={() => onEditProduct(position)}
                      onView={() => onViewProduct(position)}
                      onClear={() => onClearPosition(position)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
