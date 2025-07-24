import { useState } from "react";
import { useLocation, Link } from "wouter";
import HashSearch from "@/components/hash-search";
import { Search, Activity } from "lucide-react";

export default function Explorer() {
  const [searchHash, setSearchHash] = useState<string>("");
  const [, navigate] = useLocation();
  const [location] = useLocation();

  const handleSearch = (hash: string) => {
    navigate(`/details/${hash}`);
  };

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
                className="px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors rounded-lg"
              >
                Documentation
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="bg-slate-900 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Explore Biconomy Network
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Search for Supertransaction hashes and discover detailed blockchain analytics
            </p>
            
            <div className="max-w-2xl mx-auto">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        


        {/* How to Use */}
        <div className="bg-white border border-slate-200 p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">How to Use Biconomy Explorer</h3>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm">Follow these simple steps to explore Supertransactions on the Biconomy Network</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 text-sm mb-6">
            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2">
              <span className="w-5 h-5 bg-orange-500 text-white flex items-center justify-center text-xs font-semibold">1</span>
              <span className="text-slate-700">Enter Supertransaction hash</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2">
              <span className="w-5 h-5 bg-orange-500 text-white flex items-center justify-center text-xs font-semibold">2</span>
              <span className="text-slate-700">View transaction details</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2">
              <span className="w-5 h-5 bg-orange-500 text-white flex items-center justify-center text-xs font-semibold">3</span>
              <span className="text-slate-700">Explore user operations</span>
            </div>
          </div>
          
          <div className="p-4 bg-orange-50 border border-orange-200">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-4 h-4 bg-orange-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <span className="text-sm font-medium text-orange-800">Supertransaction Hash Format</span>
            </div>
            <code className="text-sm font-mono text-orange-700 bg-orange-100 px-2 py-1">0x1a2b3c4d5e6f... (64 hex characters)</code>
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
