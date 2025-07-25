import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { X, Search, Activity, FileText } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

export function MobileNav({ isOpen, onClose, currentPath }: MobileNavProps) {
  if (!isOpen) return null;

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Mobile Menu */}
      <div className="fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Navigation</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          <Link 
            href="/" 
            onClick={onClose}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ${
              isActive("/") 
                ? "bg-biconomy-orange/90 text-white shadow-sm" 
                : "text-slate-600 hover:text-biconomy-orange hover:bg-white/60"
            }`}
          >
            <Search className="h-4 w-4" />
            <span className="font-medium uppercase tracking-wider">Explorer</span>
          </Link>
          
          <Link 
            href="/network-info" 
            onClick={onClose}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 ${
              isActive("/network-info") 
                ? "bg-biconomy-orange/90 text-white shadow-sm" 
                : "text-slate-600 hover:text-biconomy-orange hover:bg-white/60"
            }`}
          >
            <Activity className="h-4 w-4" />
            <span className="font-medium uppercase tracking-wider">Network Status</span>
          </Link>
          
          <a 
            href="https://docs.biconomy.io" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center space-x-3 px-3 py-2 text-slate-600 hover:text-biconomy-orange hover:bg-white/60 transition-all duration-200 rounded-md"
          >
            <FileText className="h-4 w-4" />
            <span className="font-medium uppercase tracking-wider">Docs</span>
          </a>
        </nav>
      </div>
    </div>
  );
}