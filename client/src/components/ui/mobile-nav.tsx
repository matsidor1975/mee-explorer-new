import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { X, Search, Activity, FileText, Settings } from "lucide-react";
import { SettingsDialog } from "@/components/settings-dialog";
import { useState } from "react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

export function MobileNav({ isOpen, onClose, currentPath }: MobileNavProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  
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
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive("/") 
                ? "bg-biconomy-orange text-white shadow-sm" 
                : "text-slate-700 hover:text-biconomy-orange"
            }`}
          >
            <Search className="h-4 w-4" />
            <span className="font-medium uppercase tracking-wider">Explorer</span>
          </Link>
          
          <Link 
            href="/network-info" 
            onClick={onClose}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive("/network-info") 
                ? "bg-biconomy-orange text-white shadow-sm" 
                : "text-slate-700 hover:text-biconomy-orange"
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
            className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:text-biconomy-orange transition-all duration-200 rounded-lg"
          >
            <FileText className="h-4 w-4" />
            <span className="font-medium uppercase tracking-wider">Docs</span>
          </a>
          
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:text-biconomy-orange transition-all duration-200 rounded-lg w-full text-left"
          >
            <Settings className="h-4 w-4" />
            <span className="font-medium uppercase tracking-wider">Settings</span>
          </button>
        </nav>
        
        <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </div>
  );
}