import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Home from "@/pages/home";
import HistoryPage from "@/pages/history";
import NotFound from "@/pages/not-found";
import { Warehouse, FileText, BarChart3, Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/history" component={HistoryPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Armazém", icon: Warehouse },
    { path: "/history", label: "Histórico", icon: FileText },
  ];

  return (
    <nav className="border-b bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center gap-2 py-2 overflow-x-auto">
          {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <Button
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn("gap-2 border border-black", isActive && "bg-primary")}
                data-testid={`nav-${item.path.replace("/", "") || "home"}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            </Link>
          );
          })}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <main>
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
