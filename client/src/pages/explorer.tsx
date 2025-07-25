import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import HashSearch from "@/components/hash-search";
import { Search, Activity, Clock, X, Trash2, FileText, Menu } from "lucide-react";
import { getSearchHistory, removeFromSearchHistory, clearSearchHistory, type HistoryItem } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/ui/mobile-nav";
import { useMobileNav } from "@/hooks/use-mobile-nav";
import { SettingsButton } from "@/components/settings-dialog";

export default function Explorer() {
  const [searchHash, setSearchHash] = useState<string>("");
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { isOpen, isMobile, toggleNav, closeNav } = useMobileNav();

  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  const handleSearch = (hash: string) => {
    navigate(`/details/${hash}`);
    // History will be updated by the details page when data loads successfully
  };

  const handleHistoryClick = (hash: string) => {
    navigate(`/details/${hash}`);
  };

  const handleRemoveHistoryItem = (hash: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromSearchHistory(hash);
    setHistory(getSearchHistory());
  };

  const handleClearHistory = () => {
    clearSearchHistory();
    setHistory([]);
  };

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-card border-b border-white/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            <div className="flex items-center space-x-2 sm:space-x-4">
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
              
              <SettingsButton />
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
        
        {/* Search History */}
        {history.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <div className="glass-card rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500" />
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900">Recent Searches</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearHistory}
                  className="text-slate-500 hover:text-slate-700 self-end sm:self-auto"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Clear</span>
                </Button>
              </div>
              
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.hash}
                    className="flex items-center justify-between p-2 sm:p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                    onClick={() => handleHistoryClick(item.hash)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-biconomy-orange rounded-full flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-mono text-slate-900 truncate">
                            {item.hash.length > 20 && window.innerWidth < 640 
                              ? `${item.hash.slice(0, 10)}...${item.hash.slice(-8)}`
                              : item.hash
                            }
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatTimestamp(item.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleRemoveHistoryItem(item.hash, e)}
                      className="opacity-70 sm:opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600 p-1 sm:p-2"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
      <footer className="mt-16 py-8 pb-16 border-t border-white/20">
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
