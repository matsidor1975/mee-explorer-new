import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Explorer from "@/pages/explorer";
import SupertransactionDetails from "@/pages/supertransaction-details";
import NetworkInfo from "@/pages/network-info";
import NotFound from "@/pages/not-found";
import { useChainInfo } from "@/hooks/use-chain-info";
import { Activity, Search } from "lucide-react";

function Navigation() {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-biconomy-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Biconomy Explorer</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive("/") 
                  ? "bg-biconomy-orange text-white" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Search className="h-4 w-4" />
              <span className="font-medium">Explorer</span>
            </Link>
            
            <Link 
              href="/network" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive("/network") 
                  ? "bg-biconomy-orange text-white" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Activity className="h-4 w-4" />
              <span className="font-medium">Network Status</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  // Initialize chain info fetching
  useChainInfo();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navigation />
      <Switch>
        <Route path="/" component={Explorer} />
        <Route path="/explorer" component={Explorer} />
        <Route path="/network" component={NetworkInfo} />
        <Route path="/details/:hash" component={SupertransactionDetails} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
