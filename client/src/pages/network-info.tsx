import { useQuery } from "@tanstack/react-query";
import { getBiconomyInfo, BiconomyInfo } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Network, Server, Zap, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getNetworkIcon } from "@/lib/format";

export default function NetworkInfo() {
  const { data: networkInfo, isLoading, error } = useQuery<BiconomyInfo>({
    queryKey: ['/info'],
    queryFn: getBiconomyInfo,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-biconomy-orange mx-auto mb-4"></div>
          <p className="text-slate-600">Loading network information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Failed to load network info</h2>
          <p className="text-slate-600">Unable to fetch Biconomy network information</p>
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Biconomy Network Status</h1>
        <p className="text-lg text-slate-600">Real-time network health and supported chains</p>
      </div>

      {/* Network Overview */}
      <div className="mb-8 p-6 bg-white border border-slate-200 rounded-xl">
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
      </div>

      {/* Supported Chains */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Supported Chains</h2>
        
        {networkInfo?.supportedChains?.map((chain) => (
          <div key={chain.chainId} className="p-6 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getNetworkIcon(chain.chainId) ? (
                  <img 
                    src={getNetworkIcon(chain.chainId)!} 
                    alt={chain.name}
                    className="w-8 h-8"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {chain.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-1">{chain.name}</h3>
                  <p className="text-slate-600">Chain ID: {chain.chainId}</p>
                </div>
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

            {/* Modules Table */}
            <div>
              <h4 className="text-lg font-medium text-slate-900 mb-3">Module Status</h4>
              <div className="overflow-x-auto">
                <table className="w-full border border-slate-200 rounded-lg">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left p-3 text-sm font-medium text-slate-700">Module</th>
                      <th className="text-left p-3 text-sm font-medium text-slate-700">Status</th>
                      <th className="text-left p-3 text-sm font-medium text-slate-700">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chain.healthCheck.modules?.map((module, index) => (
                      <tr key={index} className="border-b border-slate-200 last:border-b-0">
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(module.data.status)}
                            <span className="text-sm font-medium text-slate-700 capitalize">{module.type}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={`${getStatusColor(module.data.status)} border-0 text-xs`}>
                            {module.data.status}
                          </Badge>
                        </td>
                        <td className="p-3">
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
        ))}
      </div>
    </div>
  );
}