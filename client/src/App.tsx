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
import { useEffect } from "react";

function Router() {
  // Initialize chain info fetching
  useChainInfo();
  
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    // Check if we have a stored redirect path from the 404.html fallback
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath && location === '/') {
      // Clear the stored path and navigate to it
      sessionStorage.removeItem('redirectPath');
      setLocation(redirectPath);
    }
  }, [location, setLocation]);
  
  return (
    <Switch>
      <Route path="/" component={Explorer} />
      <Route path="/explorer" component={Explorer} />
      <Route path="/network-info" component={NetworkInfo} />
      <Route path="/details/:hash" component={SupertransactionDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Gradient Background with Floating Circles */}
        <div className="gradient-background">
          <div className="floating-circle-1"></div>
          <div className="floating-circle-2"></div>
          <div className="floating-circle-3"></div>
        </div>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
