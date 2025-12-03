import type { PalletPosition, KanbanPallet } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, Hash, FileText, Layers } from "lucide-react";

interface ProductDetailModalProps {
  open: boolean;
  onClose: () => void;
  product: PalletPosition | KanbanPallet | null;
  type: "position" | "kanban";
}

const kanbanStatusLabels = {
  green: { label: "Disponivel", color: "bg-emerald-500" },
  yellow: { label: "Pre-saida", color: "bg-amber-500" },
  red: { label: "Urgente", color: "bg-red-500" },
};

export function ProductDetailModal({
  open,
  onClose,
  product,
  type,
}: ProductDetailModalProps) {
  if (!product) return null;

  const isKanban = type === "kanban";
  const kanbanProduct = product as KanbanPallet;
  const positionProduct = product as PalletPosition;

  const productName = isKanban ? kanbanProduct.productName : positionProduct.productName;
  const productCode = isKanban ? kanbanProduct.productCode : positionProduct.productCode;
  const quantity = isKanban ? kanbanProduct.quantity : positionProduct.quantity;
  const entryDate = isKanban ? kanbanProduct.entryDate : positionProduct.entryDate;
  const observations = isKanban
    ? kanbanProduct.observations
    : positionProduct.observations;

  const formattedDate = entryDate
    ? (() => {
        const [year, month, day] = entryDate.split("-");
        const monthNames = [
          "janeiro", "fevereiro", "março", "abril", "maio", "junho",
          "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
        ];
        return `${parseInt(day)} de ${monthNames[parseInt(month) - 1]} de ${year}`;
      })()
    : "Nao informada";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]" data-testid="product-detail-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Package className="h-4 w-4" />
            </div>
            Detalhes do Produto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isKanban && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Badge
                className={`${kanbanStatusLabels[kanbanProduct.status].color} text-white`}
              >
                {kanbanStatusLabels[kanbanProduct.status].label}
              </Badge>
            </div>
          )}

          {!isKanban && (
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
              <Layers className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="text-muted-foreground">Posicao:</span>{" "}
                <span className="font-medium">
                  Bloco {positionProduct.block}, Nivel {positionProduct.level},{" "}
                  {positionProduct.position}
                </span>
              </span>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border p-3">
              <Package className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Nome do Produto</p>
                <p className="font-medium" data-testid="text-detail-name">{productName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-3">
              <Hash className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Codigo</p>
                <p className="font-medium font-mono" data-testid="text-detail-code">{productCode}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-3 rounded-lg border p-3">
                <Package className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Quantidade</p>
                  <p className="font-medium" data-testid="text-detail-quantity">{quantity}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border p-3">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Entrada</p>
                  <p className="text-sm font-medium" data-testid="text-detail-date">{formattedDate}</p>
                </div>
              </div>
            </div>

            {observations && (
              <div className="flex items-start gap-3 rounded-lg border p-3">
                <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Observacoes</p>
                  <p className="text-sm" data-testid="text-detail-observations">{observations}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} data-testid="button-close-detail">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
