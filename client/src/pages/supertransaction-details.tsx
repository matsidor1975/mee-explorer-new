import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getHashDetails } from "@/lib/api";
import { HashDetails } from "@/types";
import HashOverview from "@/components/hash-overview";
import PaymentInfo from "@/components/payment-info";
import UserOperations from "@/components/user-operations";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TriangleAlert, Search, Activity, FileText } from "lucide-react";
import { addToSearchHistory } from "@/lib/storage";
import { useEffect } from "react";

export default function SupertransactionDetails() {
  const { hash } = useParams();
  const [location] = useLocation();

  const { data: hashDetails, isLoading, error } = useQuery<HashDetails>({
    queryKey: ['/api/hash-details', hash],
    queryFn: () => getHashDetails(hash!),
    enabled: !!hash,
    retry: false,
  });

  const showErrorState = error && !isLoading;
  const showHashDetails = hashDetails && !isLoading && !error;

  // Save successful searches to history
  useEffect(() => {
    if (hash && hashDetails && !error) {
      // Save to history with hash as identifier
      addToSearchHistory(hash);
    }
  }, [hash, hashDetails, error]);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Search</span>
                </Button>
              </Link>
              <img 
                src={new URL('@/assets/biconomy-explorer.webp', import.meta.url).href} 
                alt="Biconomy Explorer"
                className="h-8"
              />
            </div>
            <nav className="flex items-center space-x-1">
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
              
              <a 
                href="https://docs.biconomy.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors rounded-lg"
              >
                <FileText className="h-4 w-4" />
                <span className="font-medium">Docs</span>
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-3 text-[var(--biconomy-orange)]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--biconomy-orange)]"></div>
              <span className="text-lg font-medium">Loading Supertransaction details...</span>
            </div>
          </div>
        )}

        {/* Hash Details */}
        {showHashDetails && (
          <div className="space-y-6">
            <HashOverview hashDetails={hashDetails} />
            <PaymentInfo 
              paymentInfo={hashDetails.paymentInfo} 
              feePayerUserOp={hashDetails.userOps[0]} 
            />
            <UserOperations userOps={hashDetails.userOps.slice(1)} />
          </div>
        )}

        {/* Error State */}
        {showErrorState && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TriangleAlert className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Supertransaction Not Found</h3>
              <p className="text-gray-600 mb-6">
                {error instanceof Error ? error.message : 'The Supertransaction hash you requested could not be found on the Biconomy Network.'}
              </p>
              <Link href="/">
                <Button className="bg-biconomy-orange hover:bg-biconomy-orange-dark text-white font-medium">
                  Back to Search
                </Button>
              </Link>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-biconomy-orange rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded transform rotate-45"></div>
                </div>
                <h3 className="text-lg font-bold">Biconomy Explorer</h3>
              </div>
              <p className="text-gray-400 max-w-md">Explore and analyze transactions on the Biconomy Network with our comprehensive blockchain explorer.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[var(--biconomy-orange)] transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-[var(--biconomy-orange)] transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-[var(--biconomy-orange)] transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-[var(--biconomy-orange)] transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Network</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[var(--biconomy-orange)] transition-colors">Statistics</a></li>
                <li><a href="#" className="hover:text-[var(--biconomy-orange)] transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-[var(--biconomy-orange)] transition-colors">Validators</a></li>
                <li><a href="#" className="hover:text-[var(--biconomy-orange)] transition-colors">Charts</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>&copy; 2024 Biconomy Network Explorer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}