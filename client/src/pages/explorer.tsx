import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHashDetails } from "@/lib/api";
import { HashDetails } from "@/types";
import HashSearch from "@/components/hash-search";
import HashOverview from "@/components/hash-overview";
import PaymentInfo from "@/components/payment-info";
import UserOperations from "@/components/user-operations";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Search, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Explorer() {
  const [searchHash, setSearchHash] = useState<string>("");
  const [submittedHash, setSubmittedHash] = useState<string>("");

  const { data: hashDetails, isLoading, error, refetch } = useQuery<HashDetails>({
    queryKey: ['/api/hash-details', submittedHash],
    queryFn: () => getHashDetails(submittedHash),
    enabled: !!submittedHash,
    retry: false,
  });

  const handleSearch = (hash: string) => {
    setSubmittedHash(hash);
  };

  const clearSearch = () => {
    setSubmittedHash("");
    setSearchHash("");
  };

  const showEmptyState = !submittedHash && !isLoading;
  const showErrorState = error && !isLoading;
  const showHashDetails = hashDetails && !isLoading && !error;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-biconomy-orange rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded transform rotate-45"></div>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Biconomy Explorer</h1>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-[var(--biconomy-orange)] transition-colors">Dashboard</a>
              <a href="#" className="text-gray-600 hover:text-[var(--biconomy-orange)] transition-colors">Transactions</a>
              <a href="#" className="text-gray-600 hover:text-[var(--biconomy-orange)] transition-colors">Analytics</a>
              <a href="#" className="text-gray-600 hover:text-[var(--biconomy-orange)] transition-colors">Documentation</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="bg-biconomy-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Explore Biconomy Network</h2>
            <p className="text-white/80 text-lg mb-8">Search for Supertransaction hashes on the Biconomy Network</p>
            
            <div className="max-w-2xl mx-auto">
              <HashSearch 
                value={searchHash}
                onChange={setSearchHash}
                onSearch={handleSearch}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
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
            <PaymentInfo paymentInfo={hashDetails.paymentInfo} />
            <UserOperations userOps={hashDetails.userOps} />
          </div>
        )}

        {/* Empty State */}
        {showEmptyState && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Search for a Supertransaction</h3>
              <p className="text-gray-600 mb-6">Enter a Supertransaction hash to explore transactions on the Biconomy Network.</p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">Supertransaction hash format:</span>
                <code className="px-2 py-1 bg-[var(--biconomy-orange)]/10 text-[var(--biconomy-orange)] rounded">0x1a2b3c... (64 hex chars)</code>
              </div>
            </div>
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
                {error instanceof Error ? error.message : 'The Supertransaction hash you searched for could not be found on the Biconomy Network. Please check the hash and try again.'}
              </p>
              <Button 
                onClick={clearSearch}
                className="bg-biconomy-orange hover:bg-biconomy-orange-dark text-white font-medium"
              >
                Try Another Search
              </Button>
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
