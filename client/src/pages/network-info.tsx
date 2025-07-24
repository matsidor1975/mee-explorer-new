import { useQuery } from "@tanstack/react-query";
import { getBiconomyInfo, BiconomyInfo } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Network, Server, Zap, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function NetworkInfo() {
  const { data: networkInfo, isLoading, error } = useQuery<BiconomyInfo>({
    queryKey: ['/info'],
    queryFn: getBiconomyInfo,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-biconomy-orange mx-auto mb-4"></div>
            <p className="text-slate-600">Loading network information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Failed to load network info</h2>
            <p className="text-slate-600">Unable to fetch Biconomy network information</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Biconomy Network Status</h1>
          <p className="text-lg text-slate-600">Real-time network health and supported chains</p>
        </div>

        {/* Network Overview */}
        <Card className="mb-8 p-6 bg-white shadow-lg border-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Server className="h-8 w-8 text-biconomy-orange mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-slate-900">Version</h3>
              <p className="text-2xl font-bold text-biconomy-orange">{networkInfo?.version}</p>
            </div>
            <div className="text-center">
              <Network className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-slate-900">Node Type</h3>
              <p className="text-2xl font-bold text-blue-600">{networkInfo?.node}</p>
            </div>
            <div className="text-center">
              <Zap className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-slate-900">Supported Chains</h3>
              <p className="text-2xl font-bold text-green-600">{networkInfo?.supportedChains?.length || 0}</p>
            </div>
          </div>
        </Card>

        {/* Supported Chains */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Supported Chains</h2>
          
          {networkInfo?.supportedChains?.map((chain) => (
            <Card key={chain.chainId} className="p-6 bg-white shadow-lg border-0">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-1">{chain.name}</h3>
                  <p className="text-slate-600">Chain ID: {chain.chainId}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(chain.healthCheck.status)}
                  <Badge className={`${getStatusColor(chain.healthCheck.status)} border-0`}>
                    {chain.healthCheck.status}
                  </Badge>
                </div>
              </div>

              {/* Health Check Info */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600">
                    Last checked: {formatDistanceToNow(new Date(chain.healthCheck.lastChecked), { addSuffix: true })}
                  </span>
                </div>
              </div>

              {/* Modules */}
              <div>
                <h4 className="text-lg font-medium text-slate-900 mb-3">Module Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {chain.healthCheck.modules?.map((module, index) => (
                    <div key={index} className="bg-slate-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 capitalize">{module.type}</span>
                        {getStatusIcon(module.data.status)}
                      </div>
                      <Badge className={`${getStatusColor(module.data.status)} border-0 text-xs`}>
                        {module.data.status}
                      </Badge>
                      
                      {/* Module-specific data */}
                      {module.type === 'chain' && module.data.checks && (
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600">RPC Call:</span>
                            <span className={module.data.checks.rpcCall ? 'text-green-600' : 'text-red-600'}>
                              {module.data.checks.rpcCall ? '✓' : '✗'}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600">Debug Trace:</span>
                            <span className={module.data.checks.debugTraceCall ? 'text-green-600' : 'text-red-600'}>
                              {module.data.checks.debugTraceCall ? '✓' : '✗'}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {(module.type === 'simulator' || module.type === 'executor') && module.data.totalJobs && (
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600">Active:</span>
                            <span className="text-slate-700">{module.data.totalJobs.active}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600">Waiting:</span>
                            <span className="text-slate-700">{module.data.totalJobs.waiting}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}