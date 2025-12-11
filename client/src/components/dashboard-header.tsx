import type { DashboardStats } from "@shared/schema";
import { Package, PackageCheck, PackageX } from "lucide-react";
import bclogLogo from "@assets/bclog_fundo_branco_1764714366379.png";

interface DashboardHeaderProps {
  stats: DashboardStats;
  isLoading?: boolean;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  isLoading,
}: {
  label: string;
  value: number;
  icon: typeof Package;
  color: "blue" | "green" | "yellow" | "red" | "gray";
  isLoading?: boolean;
}) {
  const colorClasses = {
    blue: "bg-blue-500/20 text-blue-200",
    green: "bg-emerald-500/20 text-emerald-200",
    yellow: "bg-amber-500/20 text-amber-200",
    red: "bg-red-500/20 text-red-200",
    gray: "bg-gray-500/20 text-gray-300",
  };

  const isColoredCard = color === "green" || color === "yellow" || color === "red";
  const borderClass = isColoredCard ? "border-2 border-black" : "";
  const labelTextClass = isColoredCard ? "text-lg font-bold uppercase tracking-wide text-black" : "text-lg font-medium uppercase tracking-wide text-white/60";

  return (
    <div
      className={`flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3 backdrop-blur-sm ${borderClass}`}
      data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className={`rounded-md p-2 ${colorClasses[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className={labelTextClass}>
          {label}
        </span>
        {isLoading ? (
          <div className="h-6 w-8 animate-pulse rounded bg-white/10" />
        ) : (
          <span className="text-xl font-semibold text-white">{value}</span>
        )}
      </div>
    </div>
  );
}

export function DashboardHeader({ stats, isLoading }: DashboardHeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 w-full bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 shadow-lg"
      data-testid="dashboard-header"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="flex items-center gap-4">
            <img
              src={bclogLogo}
              alt="BCLog Express"
              className="h-16 w-auto rounded-lg bg-white p-1"
            />
            <div>
              <h1 className="text-xl font-semibold text-white sm:text-2xl">
                BCLOG
              </h1>
              <p className="whitespace-nowrap text-lg text-white/60">
                Sistema de Armazenagem
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 lg:gap-3">
            <StatCard
              label="Ocupadas"
              value={stats.occupiedPositions}
              icon={PackageCheck}
              color="blue"
              isLoading={isLoading}
            />
            <StatCard
              label="Livres"
              value={stats.freePositions}
              icon={PackageX}
              color="gray"
              isLoading={isLoading}
            />
            <div className="flex gap-2">
              <StatCard
                label="Verde"
                value={stats.kanbanGreen}
                icon={Package}
                color="green"
                isLoading={isLoading}
              />
              <StatCard
                label="Amarelo"
                value={stats.kanbanYellow}
                icon={Package}
                color="yellow"
                isLoading={isLoading}
              />
              <StatCard
                label="Vermelho"
                value={stats.kanbanRed}
                icon={Package}
                color="red"
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
