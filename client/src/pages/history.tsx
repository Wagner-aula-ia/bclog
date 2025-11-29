import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { MovementHistory, MovementType } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeftRight,
  ArrowRightFromLine,
  CalendarDays,
  FileText,
  Package,
  PackagePlus,
  Pencil,
  Search,
  Truck,
} from "lucide-react";

const movementTypeLabels: Record<MovementType, string> = {
  entry: "Entrada",
  exit: "Saída",
  edit: "Edição",
  kanban_add: "Kanban - Adição",
  kanban_move: "Kanban - Movimentação",
  kanban_expedite: "Kanban - Expedição",
};

const movementTypeIcons: Record<MovementType, typeof Package> = {
  entry: PackagePlus,
  exit: ArrowRightFromLine,
  edit: Pencil,
  kanban_add: Package,
  kanban_move: ArrowLeftRight,
  kanban_expedite: Truck,
};

function getMovementTypeBadgeVariant(type: MovementType): "default" | "secondary" | "destructive" | "outline" {
  switch (type) {
    case "entry":
    case "kanban_add":
      return "default";
    case "exit":
    case "kanban_expedite":
      return "destructive";
    case "edit":
    case "kanban_move":
      return "secondary";
    default:
      return "outline";
  }
}

export default function HistoryPage() {
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const {
    data: history = [],
    isLoading,
    refetch,
  } = useQuery<MovementHistory[]>({
    queryKey: ["/api/history", startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      const response = await fetch(`/api/history?${params}`);
      if (!response.ok) throw new Error("Failed to fetch history");
      return response.json();
    },
  });

  const filteredHistory = history.filter((entry) => {
    const matchesSearch =
      searchTerm === "" ||
      entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || entry.type === typeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <FileText className="w-5 h-5" />
            Histórico de Movimentações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex items-center gap-2 flex-1">
                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1"
                  data-testid="input-start-date"
                />
                <span className="text-muted-foreground">até</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1"
                  data-testid="input-end-date"
                />
              </div>
              <Button
                onClick={() => refetch()}
                variant="outline"
                data-testid="button-filter-date"
              >
                Filtrar
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por produto, código ou localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-history"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48" data-testid="select-type-filter">
                  <SelectValue placeholder="Tipo de movimento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="entry">Entrada</SelectItem>
                  <SelectItem value="exit">Saída</SelectItem>
                  <SelectItem value="edit">Edição</SelectItem>
                  <SelectItem value="kanban_add">Kanban - Adição</SelectItem>
                  <SelectItem value="kanban_move">Kanban - Movimentação</SelectItem>
                  <SelectItem value="kanban_expedite">Kanban - Expedição</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhuma movimentação encontrada</p>
              <p className="text-sm">
                {history.length === 0
                  ? "O histórico está vazio. Adicione produtos para começar a registrar movimentações."
                  : "Tente ajustar os filtros para encontrar o que procura."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-40">Data/Hora</TableHead>
                    <TableHead className="w-32">Tipo</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead className="w-24">Qtd</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Detalhes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((entry) => {
                    const Icon = movementTypeIcons[entry.type];
                    return (
                      <TableRow key={entry.id} data-testid={`history-row-${entry.id}`}>
                        <TableCell className="font-mono text-sm">
                          {format(parseISO(entry.timestamp), "dd/MM/yyyy HH:mm", {
                            locale: ptBR,
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getMovementTypeBadgeVariant(entry.type)} className="gap-1">
                            <Icon className="w-3 h-3" />
                            {movementTypeLabels[entry.type]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{entry.productName}</span>
                            <span className="text-sm text-muted-foreground">
                              {entry.productCode}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {entry.quantity}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{entry.location}</span>
                            {entry.previousLocation && (
                              <span className="text-sm text-muted-foreground">
                                De: {entry.previousLocation}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-48 truncate">
                          {entry.details}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground text-center">
        Total de registros: {filteredHistory.length}
        {filteredHistory.length !== history.length && ` (de ${history.length} total)`}
      </div>
    </div>
  );
}
