import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBiconomyInfo, BiconomyInfo } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Network, Server, Zap, Activity, ChevronDown, ChevronRight, Search, FileText, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { getNetworkIcon } from "@/lib/format";
import { Link, useLocation } from "wouter";
import { MobileNav } from "@/components/ui/mobile-nav";
import { useMobileNav } from "@/hooks/use-mobile-nav";

export default function NetworkInfo() {
  const [expandedChains, setExpandedChains] = useState<Set<string>>(new Set());
  const [location] = useLocation();
  const { isOpen, isMobile, toggleNav, closeNav } = useMobileNav();
  
  const { data: networkInfo, isLoading, error } = useQuery<BiconomyInfo>({
    queryKey: ['/info'],
    queryFn: getBiconomyInfo,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const toggleChain = (chainId: string) => {
    const newExpanded = new Set(expandedChains);
    if (newExpanded.has(chainId)) {
      newExpanded.delete(chainId);
    } else {
      newExpanded.add(chainId);
    }
    setExpandedChains(newExpanded);
  };

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  if (isLoading) {
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
                  className={`flex items-center space-x-1.5 px-2 py-1 rounded-md transition-all duration-200 ${
                    isActive("/") 
                      ? "bg-biconomy-orange text-white shadow-sm" 
                      : "text-slate-700 hover:text-white hover:bg-biconomy-orange/80"
                  }`}
                >
                  <Search className="h-3 w-3" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Explorer</span>
                </Link>
                
                <Link 
                  href="/network-info" 
                  className={`flex items-center space-x-1.5 px-2 py-1 rounded-md transition-all duration-200 ${
                    isActive("/network-info") 
                      ? "bg-biconomy-orange text-white shadow-sm" 
                      : "text-slate-700 hover:text-white hover:bg-biconomy-orange/80"
                  }`}
                >
                  <Activity className="h-3 w-3" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Network Status</span>
                </Link>
                
                <a 
                  href="https://docs.biconomy.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 px-2 py-1 text-slate-700 hover:text-white hover:bg-biconomy-orange/80 transition-all duration-200 rounded-md"
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
        
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-biconomy-orange mx-auto mb-4"></div>
            <p className="text-slate-600 text-sm sm:text-base">Loading network information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
                  className={`flex items-center space-x-1.5 px-2 py-1 rounded-md transition-all duration-200 ${
                    isActive("/") 
                      ? "bg-biconomy-orange text-white shadow-sm" 
                      : "text-slate-700 hover:text-white hover:bg-biconomy-orange/80"
                  }`}
                >
                  <Search className="h-3 w-3" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Explorer</span>
                </Link>
                
                <Link 
                  href="/network-info" 
                  className={`flex items-center space-x-1.5 px-2 py-1 rounded-md transition-all duration-200 ${
                    isActive("/network-info") 
                      ? "bg-biconomy-orange text-white shadow-sm" 
                      : "text-slate-700 hover:text-white hover:bg-biconomy-orange/80"
                  }`}
                >
                  <Activity className="h-3 w-3" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Network Status</span>
                </Link>
                
                <a 
                  href="https://docs.biconomy.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 px-2 py-1 text-slate-700 hover:text-white hover:bg-biconomy-orange/80 transition-all duration-200 rounded-md"
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
        
        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="text-center">
            <XCircle className="h-8 w-8 sm:h-12 sm:w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">Failed to load network info</h2>
            <p className="text-slate-600 text-sm sm:text-base">Unable to fetch Biconomy network information</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    return status === 'healthy' ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusColor = (status: string) => {
    return status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
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
                className="flex items-center space-x-1.5 px-2 py-1 rounded-md transition-all duration-200 text-slate-700 hover:text-white hover:bg-biconomy-orange/80 pl-[16px] pr-[16px] pt-[10px] pb-[10px]"
              >
                <Search className="h-3 w-3" />
                <span className="text-xs font-semibold uppercase tracking-wider">Explorer</span>
              </Link>
              
              <Link 
                href="/network-info" 
                className="flex items-center space-x-1.5 px-2 py-1 rounded-md transition-all duration-200 bg-biconomy-orange text-white shadow-sm pt-[10px] pb-[10px] pl-[16px] pr-[16px]"
              >
                <Activity className="h-3 w-3" />
                <span className="text-xs font-semibold uppercase tracking-wider">Network Status</span>
              </Link>
              
              <a 
                href="https://docs.biconomy.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 px-2 py-1 text-slate-700 hover:text-white hover:bg-biconomy-orange/80 transition-all duration-200 rounded-md"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Biconomy Network Status</h1>
        <p className="text-base text-slate-600">Real-time network health and supported chains</p>
      </div>

      {/* Network Overview */}
      <div className="mb-6 p-4 bg-white border border-slate-200 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <Server className="h-6 w-6 text-biconomy-orange mx-auto mb-1" />
            <h3 className="text-sm font-semibold text-slate-900">Version</h3>
            <p className="text-lg font-bold text-biconomy-orange">{networkInfo?.version}</p>
          </div>
          <div className="text-center">
            <Network className="h-6 w-6 text-blue-500 mx-auto mb-1" />
            <h3 className="text-sm font-semibold text-slate-900">Node Type</h3>
            <p className="text-lg font-bold text-blue-600">{networkInfo?.node}</p>
          </div>
          <div className="text-center">
            <Zap className="h-6 w-6 text-green-500 mx-auto mb-1" />
            <h3 className="text-sm font-semibold text-slate-900">Supported Chains</h3>
            <p className="text-lg font-bold text-green-600">{networkInfo?.supportedChains?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Supported Chains */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Supported Chains</h2>
        
        {networkInfo?.supportedChains?.map((chain) => {
          const isExpanded = expandedChains.has(chain.chainId);
          const chainModule = chain.healthCheck.modules?.find(m => m.type === 'chain');
          
          return (
            <div key={chain.chainId} className="bg-white border border-slate-200 rounded-lg">
              {/* Chain Header - Always Visible */}
              <div 
                className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => toggleChain(chain.chainId)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getNetworkIcon(chain.chainId) ? (
                      <img 
                        src={getNetworkIcon(chain.chainId)!} 
                        alt={chain.name}
                        className="w-6 h-6"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {chain.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{chain.name}</h3>
                      <p className="text-xs text-slate-600">Chain ID: {chain.chainId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Chain Health Check Summary */}
                    {chainModule?.data.checks && (
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-slate-600">RPC:</span>
                        <span className={chainModule.data.checks.rpcCall ? 'text-green-600' : 'text-red-600'}>
                          {chainModule.data.checks.rpcCall ? '✓' : '✗'}
                        </span>
                        <span className="text-slate-600">Debug:</span>
                        <span className={chainModule.data.checks.debugTraceCall ? 'text-green-600' : 'text-red-600'}>
                          {chainModule.data.checks.debugTraceCall ? '✓' : '✗'}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(chain.healthCheck.status)}
                      <Badge className={`${getStatusColor(chain.healthCheck.status)} border-0 text-xs`}>
                        {chain.healthCheck.status}
                      </Badge>
                    </div>
                    
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-500" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-slate-200 p-4">
                  {/* Health Check Info */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span className="text-xs text-slate-600">
                        Last checked: {formatDistanceToNow(new Date(chain.healthCheck.lastChecked), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  {/* Modules Table */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-2">Module Status</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-slate-200 rounded">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left p-2 text-xs font-medium text-slate-700">Module</th>
                            <th className="text-left p-2 text-xs font-medium text-slate-700">Status</th>
                            <th className="text-left p-2 text-xs font-medium text-slate-700">Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chain.healthCheck.modules?.map((module, index) => (
                            <tr key={index} className="border-b border-slate-200 last:border-b-0">
                              <td className="p-2">
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(module.data.status)}
                                  <span className="text-xs font-medium text-slate-700 capitalize">{module.type}</span>
                                </div>
                              </td>
                              <td className="p-2">
                                <Badge className={`${getStatusColor(module.data.status)} border-0 text-xs`}>
                                  {module.data.status}
                                </Badge>
                              </td>
                              <td className="p-2">
                                <div className="text-xs text-slate-600">
                                  {/* Module-specific data */}
                                  {module.type === 'chain' && module.data.checks && (
                                    <div className="space-y-1">
                                      <div className="flex items-center space-x-2">
                                        <span>RPC Call:</span>
                                        <span className={module.data.checks.rpcCall ? 'text-green-600' : 'text-red-600'}>
                                          {module.data.checks.rpcCall ? '✓' : '✗'}
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <span>Debug Trace:</span>
                                        <span className={module.data.checks.debugTraceCall ? 'text-green-600' : 'text-red-600'}>
                                          {module.data.checks.debugTraceCall ? '✓' : '✗'}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {(module.type === 'simulator' || module.type === 'executor') && module.data.totalJobs && (
                                    <div className="space-y-1">
                                      <div>Active: {module.data.totalJobs.active}</div>
                                      <div>Waiting: {module.data.totalJobs.waiting}</div>
                                      <div>Delayed: {module.data.totalJobs.delayed}</div>
                                      <div>Paused: {module.data.totalJobs.paused}</div>
                                    </div>
                                  )}

                                  {module.type === 'node' && module.data.master && (
                                    <div className="space-y-1">
                                      <div>Master Active: {module.data.master.active ? '✓' : '✗'}</div>
                                      <div>Workers: {Object.keys(module.data.workers || {}).length}</div>
                                      <div>Paymaster Deployed: {module.data.paymaster?.deployed ? '✓' : '✗'}</div>
                                    </div>
                                  )}

                                  {module.type === 'workers' && module.data.workers && (
                                    <div className="space-y-1">
                                      <div>Simulator: {module.data.workers.simulator?.length || 0} online</div>
                                      <div>Executor: {module.data.workers.executor?.length || 0} online</div>
                                    </div>
                                  )}

                                  {module.type === 'redis' && module.data.clients && (
                                    <div>Total Clients: {module.data.clients.totalClients}</div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}