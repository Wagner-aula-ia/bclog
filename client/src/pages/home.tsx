import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type {
  PalletPosition,
  KanbanPallet,
  KanbanStatus,
  DashboardStats,
  ProductFormData,
} from "@shared/schema";
import { DashboardHeader } from "@/components/dashboard-header";
import { WarehouseBlock } from "@/components/warehouse-block";
import { KanbanSection } from "@/components/kanban-section";
import { ProductFormModal } from "@/components/product-form-modal";
import { ProductDetailModal } from "@/components/product-detail-modal";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Kanban } from "lucide-react";

type ModalMode = "add" | "edit" | null;
type DetailType = "position" | "kanban";

export default function Home() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("warehouse");

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formModalMode, setFormModalMode] = useState<ModalMode>(null);
  const [selectedPosition, setSelectedPosition] = useState<PalletPosition | null>(null);
  const [selectedKanban, setSelectedKanban] = useState<KanbanPallet | null>(null);
  const [kanbanAddStatus, setKanbanAddStatus] = useState<KanbanStatus>("green");

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<PalletPosition | KanbanPallet | null>(null);
  const [detailType, setDetailType] = useState<DetailType>("position");

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  const [confirmDialogConfig, setConfirmDialogConfig] = useState({
    title: "",
    description: "",
    confirmText: "",
  });

  const {
    data: positions = [],
    isLoading: positionsLoading,
  } = useQuery<PalletPosition[]>({
    queryKey: ["/api/positions"],
  });

  const {
    data: kanbanPallets = [],
    isLoading: kanbanLoading,
  } = useQuery<KanbanPallet[]>({
    queryKey: ["/api/kanban"],
  });

  const {
    data: stats = {
      totalPositions: 40,
      occupiedPositions: 0,
      freePositions: 40,
      kanbanGreen: 0,
      kanbanYellow: 0,
      kanbanRed: 0,
    },
    isLoading: statsLoading,
  } = useQuery<DashboardStats>({
    queryKey: ["/api/stats"],
  });

  const updatePositionMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: ProductFormData;
    }) => {
      return apiRequest("PATCH", `/api/positions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/positions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Produto salvo com sucesso!" });
      closeFormModal();
    },
    onError: () => {
      toast({ title: "Erro ao salvar produto", variant: "destructive" });
    },
  });

  const clearPositionMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/positions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/positions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Posicao esvaziada com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao esvaziar posicao", variant: "destructive" });
    },
  });

  const addKanbanMutation = useMutation({
    mutationFn: async (data: ProductFormData & { status: KanbanStatus }) => {
      return apiRequest("POST", "/api/kanban", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kanban"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Palete adicionado com sucesso!" });
      closeFormModal();
    },
    onError: () => {
      toast({ title: "Erro ao adicionar palete", variant: "destructive" });
    },
  });

  const updateKanbanMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ProductFormData & { status: KanbanStatus }>;
    }) => {
      return apiRequest("PATCH", `/api/kanban/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kanban"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Palete atualizado com sucesso!" });
      closeFormModal();
    },
    onError: () => {
      toast({ title: "Erro ao atualizar palete", variant: "destructive" });
    },
  });

  const deleteKanbanMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/kanban/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kanban"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Palete removido com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao remover palete", variant: "destructive" });
    },
  });

  const closeFormModal = useCallback(() => {
    setFormModalOpen(false);
    setFormModalMode(null);
    setSelectedPosition(null);
    setSelectedKanban(null);
  }, []);

  const handleAddToPosition = (position: PalletPosition) => {
    setSelectedPosition(position);
    setFormModalMode("add");
    setFormModalOpen(true);
  };

  const handleEditPosition = (position: PalletPosition) => {
    setSelectedPosition(position);
    setFormModalMode("edit");
    setFormModalOpen(true);
  };

  const handleViewPosition = (position: PalletPosition) => {
    setDetailProduct(position);
    setDetailType("position");
    setDetailModalOpen(true);
  };

  const handleClearPosition = (position: PalletPosition) => {
    setConfirmDialogConfig({
      title: "Esvaziar Posicao",
      description: `Tem certeza que deseja esvaziar a posicao N${position.level}-${position.position} do Bloco ${position.block}?`,
      confirmText: "Esvaziar",
    });
    setConfirmAction(() => () => {
      clearPositionMutation.mutate(position.id);
      setConfirmDialogOpen(false);
    });
    setConfirmDialogOpen(true);
  };

  const handleAddKanban = (status: KanbanStatus) => {
    setKanbanAddStatus(status);
    setSelectedKanban(null);
    setFormModalMode("add");
    setFormModalOpen(true);
  };

  const handleViewKanban = (pallet: KanbanPallet) => {
    setDetailProduct(pallet);
    setDetailType("kanban");
    setDetailModalOpen(true);
  };

  const handleEditKanban = (pallet: KanbanPallet) => {
    setSelectedKanban(pallet);
    setFormModalMode("edit");
    setFormModalOpen(true);
  };

  const handleMoveKanban = (pallet: KanbanPallet, newStatus: KanbanStatus) => {
    updateKanbanMutation.mutate({
      id: pallet.id,
      data: { status: newStatus },
    });
  };

  const handleExpediteKanban = (pallet: KanbanPallet) => {
    setConfirmDialogConfig({
      title: "Marcar como Expedido",
      description: `Confirma a expedicao do palete "${pallet.productCode}"? Ele sera removido do sistema.`,
      confirmText: "Confirmar Expedicao",
    });
    setConfirmAction(() => () => {
      deleteKanbanMutation.mutate(pallet.id);
      setConfirmDialogOpen(false);
    });
    setConfirmDialogOpen(true);
  };

  const handleDeleteKanban = (pallet: KanbanPallet) => {
    setConfirmDialogConfig({
      title: "Remover Palete",
      description: `Tem certeza que deseja remover o palete "${pallet.productCode}"?`,
      confirmText: "Remover",
    });
    setConfirmAction(() => () => {
      deleteKanbanMutation.mutate(pallet.id);
      setConfirmDialogOpen(false);
    });
    setConfirmDialogOpen(true);
  };

  const handleFormSubmit = (data: ProductFormData) => {
    if (selectedPosition) {
      updatePositionMutation.mutate({ id: selectedPosition.id, data });
    } else if (selectedKanban) {
      updateKanbanMutation.mutate({ id: selectedKanban.id, data });
    } else {
      addKanbanMutation.mutate({ ...data, status: kanbanAddStatus });
    }
  };

  const getFormInitialData = (): Partial<ProductFormData> | undefined => {
    if (formModalMode === "edit") {
      if (selectedPosition && !selectedPosition.isEmpty) {
        return {
          productName: selectedPosition.productName,
          productCode: selectedPosition.productCode,
          clientName: selectedPosition.clientName,
          quantity: selectedPosition.quantity,
          storageType: selectedPosition.storageType,
          entryDate: selectedPosition.entryDate,
          address: selectedPosition.address,
          observations: selectedPosition.observations,
        };
      }
      if (selectedKanban) {
        return {
          productName: selectedKanban.productName,
          productCode: selectedKanban.productCode,
          clientName: selectedKanban.clientName,
          quantity: selectedKanban.quantity,
          storageType: selectedKanban.storageType,
          entryDate: selectedKanban.entryDate,
          address: selectedKanban.address,
          observations: selectedKanban.observations,
        };
      }
    }
    return undefined;
  };

  const getFormTitle = (): string => {
    if (selectedPosition) {
      return formModalMode === "add"
        ? `Adicionar Produto - N${selectedPosition.level}-${selectedPosition.position}`
        : `Editar Produto - N${selectedPosition.level}-${selectedPosition.position}`;
    }
    if (selectedKanban) {
      return "Editar Palete Kanban";
    }
    const statusLabels = { green: "Verde", yellow: "Amarelo", red: "Vermelho" };
    return `Adicionar Palete - ${statusLabels[kanbanAddStatus]}`;
  };

  const block1Positions = positions.filter((p) => p.block === 1);
  const block2Positions = positions.filter((p) => p.block === 2);

  return (
    <div className="min-h-screen bg-background" data-testid="home-page">
      <DashboardHeader stats={stats} isLoading={statsLoading} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-xs grid-cols-2 bg-transparent">
            <TabsTrigger 
              value="warehouse" 
              className="gap-2 text-black dark:text-white border border-black rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none data-[state=active]:underline data-[state=active]:decoration-yellow-400 data-[state=active]:decoration-2 data-[state=active]:underline-offset-4" 
              data-testid="tab-warehouse"
            >
              <Layers className="h-4 w-4" />
              Porta-Palete
            </TabsTrigger>
            <TabsTrigger 
              value="kanban" 
              className="gap-2 text-black dark:text-white border border-black rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none data-[state=active]:underline data-[state=active]:decoration-yellow-400 data-[state=active]:decoration-2 data-[state=active]:underline-offset-4" 
              data-testid="tab-kanban"
            >
              <Kanban className="h-4 w-4" />
              Kanban
            </TabsTrigger>
          </TabsList>

          <TabsContent value="warehouse" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <WarehouseBlock
                blockNumber={1}
                positions={block1Positions}
                onAddProduct={handleAddToPosition}
                onEditProduct={handleEditPosition}
                onViewProduct={handleViewPosition}
                onClearPosition={handleClearPosition}
                isLoading={positionsLoading}
              />
              <WarehouseBlock
                blockNumber={2}
                positions={block2Positions}
                onAddProduct={handleAddToPosition}
                onEditProduct={handleEditPosition}
                onViewProduct={handleViewPosition}
                onClearPosition={handleClearPosition}
                isLoading={positionsLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value="kanban">
            <KanbanSection
              pallets={kanbanPallets}
              onAddPallet={handleAddKanban}
              onViewPallet={handleViewKanban}
              onEditPallet={handleEditKanban}
              onMovePallet={handleMoveKanban}
              onExpeditePallet={handleExpediteKanban}
              onDeletePallet={handleDeleteKanban}
              isLoading={kanbanLoading}
            />
          </TabsContent>
        </Tabs>
      </main>

      <ProductFormModal
        open={formModalOpen}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
        initialData={getFormInitialData()}
        title={getFormTitle()}
        isLoading={
          updatePositionMutation.isPending ||
          addKanbanMutation.isPending ||
          updateKanbanMutation.isPending
        }
      />

      <ProductDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        product={detailProduct}
        type={detailType}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmAction}
        title={confirmDialogConfig.title}
        description={confirmDialogConfig.description}
        confirmText={confirmDialogConfig.confirmText}
        variant="destructive"
      />
    </div>
  );
}
