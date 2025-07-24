import { useState } from "react";
import { useLocation } from "wouter";
import HashSearch from "@/components/hash-search";
import { Search } from "lucide-react";

export default function Explorer() {
  const [searchHash, setSearchHash] = useState<string>("");
  const [, navigate] = useLocation();

  const handleSearch = (hash: string) => {
    navigate(`/details/${hash}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="w-5 h-5 bg-white rounded-lg transform rotate-45"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Biconomy Explorer</h1>
                  <p className="text-xs text-slate-500">Blockchain Transaction Analytics</p>
                </div>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-2">
              <a href="#" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">Dashboard</a>
              <a href="#" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">Transactions</a>
              <a href="#" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">Analytics</a>
              <a href="#" className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors">Documentation</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-blue-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-white/80">Live Network Status</span>
            </div>
            <h2 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Explore Biconomy Network
            </h2>
            <p className="text-white/70 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Search for Supertransaction hashes and discover detailed blockchain analytics with real-time insights
            </p>
            
            <div className="max-w-3xl mx-auto">
              <HashSearch 
                value={searchHash}
                onChange={setSearchHash}
                onSearch={handleSearch}
                isLoading={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-8 text-center shadow-sm hover:shadow-md transition-all duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Search</h3>
            <p className="text-slate-600">Instantly search and explore Supertransaction details with comprehensive blockchain data</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-8 text-center shadow-sm hover:shadow-md transition-all duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <div className="w-8 h-8 border-4 border-white rounded-lg"></div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Multi-chain Support</h3>
            <p className="text-slate-600">Support for Ethereum, Polygon, Base, Arbitrum, and other major blockchain networks</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-8 text-center shadow-sm hover:shadow-md transition-all duration-200">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <div className="w-8 h-8 bg-white rounded-lg transform rotate-45"></div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Detailed Analytics</h3>
            <p className="text-slate-600">In-depth transaction analysis with gas fees, user operations, and execution data</p>
          </div>
        </div>

        {/* How to Use */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">How to Use Biconomy Explorer</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">Follow these simple steps to explore Supertransactions on the Biconomy Network</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <div className="flex items-center space-x-2 bg-slate-100 rounded-full px-4 py-2">
              <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <span className="text-slate-700">Enter Supertransaction hash</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-100 rounded-full px-4 py-2">
              <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <span className="text-slate-700">View transaction details</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-100 rounded-full px-4 py-2">
              <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span className="text-slate-700">Explore user operations</span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <span className="text-sm font-medium text-orange-800">Supertransaction Hash Format</span>
            </div>
            <code className="text-sm font-mono text-orange-700 bg-orange-100 px-3 py-1 rounded-lg">0x1a2b3c4d5e6f... (64 hex characters)</code>
          </div>
        </div>

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
