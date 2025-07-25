import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getHashDetails } from "@/lib/api";
import { HashDetails } from "@/types";
import HashOverview from "@/components/hash-overview";
import PaymentInfo from "@/components/payment-info";
import UserOperations from "@/components/user-operations";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TriangleAlert, Search, Activity, FileText, Menu } from "lucide-react";
import { addToSearchHistory } from "@/lib/storage";
import { useEffect, useMemo } from "react";
import { MobileNav } from "@/components/ui/mobile-nav";
import { useMobileNav } from "@/hooks/use-mobile-nav";

export default function SupertransactionDetails() {
  const { hash } = useParams();
  const [location] = useLocation();
  const { isOpen, isMobile, toggleNav, closeNav } = useMobileNav();

  const { data: hashDetails, isLoading, error } = useQuery<HashDetails>({
    queryKey: ['/api/hash-details', hash],
    queryFn: () => getHashDetails(hash!),
    enabled: !!hash,
    retry: false,
  });

  // Check if any user operations are in pending state
  const hasPendingOperations = useMemo(() => {
    if (!hashDetails?.userOps) return false;
    return hashDetails.userOps.some(userOp => {
      const status = userOp.executionStatus.toLowerCase();
      return status.includes('pending') || status.includes('processing') || status.includes('submitted');
    });
  }, [hashDetails?.userOps]);

  // Set up polling query with conditional refetch interval
  const { data: pollingHashDetails } = useQuery<HashDetails>({
    queryKey: ['/api/hash-details-polling', hash],
    queryFn: () => getHashDetails(hash!),
    enabled: !!hash && hasPendingOperations,
    refetchInterval: 300,
    refetchIntervalInBackground: true,
  });

  // Use the most recent data
  const currentHashDetails = pollingHashDetails || hashDetails;

  const showErrorState = error && !isLoading;
  const showHashDetails = currentHashDetails && !isLoading && !error;

  // Save successful searches to history
  useEffect(() => {
    if (hash && currentHashDetails && !error) {
      // Save to history with hash as identifier
      addToSearchHistory(hash);
    }
  }, [hash, currentHashDetails, error]);

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-card border-b border-white/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-1 sm:space-x-1.5 text-slate-600 hover:text-biconomy-orange hover:bg-white/60 px-1.5 sm:px-2 py-1 h-6 sm:h-7">
                  <ArrowLeft className="h-3 w-3" />
                  <span className="text-xs font-medium hidden sm:inline">Back</span>
                </Button>
              </Link>
              <img 
                src={new URL('@/assets/biconomy-explorer.webp', import.meta.url).href} 
                alt="Biconomy Explorer"
                className="h-5 sm:h-6"
              />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive("/") 
                    ? "bg-biconomy-orange text-white shadow-sm" 
                    : "text-slate-700 hover:text-biconomy-orange"
                }`}
              >
                <Search className="h-3 w-3" />
                <span className="text-xs font-semibold uppercase tracking-wider">Explorer</span>
              </Link>
              
              <Link 
                href="/network-info" 
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive("/network-info") 
                    ? "bg-biconomy-orange text-white shadow-sm" 
                    : "text-slate-700 hover:text-biconomy-orange"
                }`}
              >
                <Activity className="h-3 w-3" />
                <span className="text-xs font-semibold uppercase tracking-wider">Network Status</span>
              </Link>
              
              <a 
                href="https://docs.biconomy.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 px-4 py-2 text-slate-700 hover:text-biconomy-orange transition-all duration-200 rounded-lg"
              >
                <FileText className="h-3 w-3" />
                <span className="text-xs font-semibold uppercase tracking-wider">Docs</span>
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleNav}
              className="md:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav isOpen={isOpen} onClose={closeNav} currentPath={location} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="space-y-4 sm:space-y-8">
        
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-flex items-center space-x-3 text-[var(--biconomy-orange)]">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[var(--biconomy-orange)]"></div>
              <span className="text-base sm:text-lg font-medium">Loading Supertransaction details...</span>
            </div>
          </div>
        )}

        {/* Hash Details */}
        {showHashDetails && (
          <div className="space-y-4 sm:space-y-6">
            <HashOverview hashDetails={currentHashDetails!} />
            <PaymentInfo 
              paymentInfo={currentHashDetails!.paymentInfo} 
              feePayerUserOp={currentHashDetails!.userOps[0]} 
            />
            <UserOperations userOps={currentHashDetails!.userOps.slice(1)} isPolling={hasPendingOperations} />
          </div>
        )}

        {/* Error State */}
        {showErrorState && (
          <div className="text-center py-12 sm:py-16">
            <div className="max-w-md mx-auto bg-white rounded-lg p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
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
        
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 pb-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <img 
              src={new URL('@/assets/biconomy-explorer.webp', import.meta.url).href} 
              alt="Biconomy"
              className="h-6 opacity-60"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}