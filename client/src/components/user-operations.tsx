import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ChevronDown, Code, User, Hash, Fuel, Clock, Zap, Layers, Settings, AlertTriangle, CheckCircle, ExternalLink, Wallet, CreditCard } from "lucide-react";
import { UserOp } from "@/types";
import { formatHash, formatGas, formatTimestamp, getExecutionStatusColor, parseAccountGasLimits, parseGasFees, getExplorerUrl, getExplorerName, hasExplorerSupport, getNetworkIcon } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";
import { useChainInfo } from "@/hooks/use-chain-info";

interface UserOperationsProps {
  userOps: UserOp[];
}

export default function UserOperations({ userOps }: UserOperationsProps) {
  const [expandedOps, setExpandedOps] = useState<Set<number>>(new Set());
  const [expandedCleanupOps, setExpandedCleanupOps] = useState<Set<number>>(new Set());
  const [showCleanupOperations, setShowCleanupOperations] = useState<boolean>(false);
  const { toast } = useToast();
  const { chains } = useChainInfo();

  const regularOperations = userOps.filter(op => !op.isCleanUpUserOp);
  const cleanupOperations = userOps.filter(op => op.isCleanUpUserOp);

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedOps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedOps(newExpanded);
  };

  const toggleCleanupExpanded = (index: number) => {
    const newExpanded = new Set(expandedCleanupOps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCleanupOps(newExpanded);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `${label} has been copied to your clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const DataField = ({ icon: Icon, label, value, showCopy = true }: {
    icon: React.ComponentType<any>;
    label: string;
    value: string;
    showCopy?: boolean;
  }) => (
    <div className="p-3 bg-white border border-gray-100 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <Icon className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <code className={`text-xs font-mono text-gray-900 truncate flex-1 ${!value ? 'text-gray-400' : ''}`}>
          {value || 'Not available'}
        </code>
        {showCopy && value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(value, label)}
            className="text-gray-400 hover:text-[var(--biconomy-orange)] shrink-0 ml-2"
          >
            <Copy className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );

  const ExplorerLink = ({ txHash, chainId }: { txHash: string; chainId: string }) => {
    const explorerUrl = getExplorerUrl(chainId, txHash);
    const explorerName = getExplorerName(chainId);
    const hasExplorer = hasExplorerSupport(chainId);
    
    return (
      <div className="p-3 bg-white border border-gray-100 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <ExternalLink className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">On-Chain Transaction</span>
        </div>
        <div className="flex items-center justify-between">
          <code className="text-xs font-mono text-gray-900 truncate flex-1">
            {formatHash(txHash)}
          </code>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(txHash, "Transaction Hash")}
              className="text-gray-400 hover:text-[var(--biconomy-orange)] shrink-0"
            >
              <Copy className="h-3 w-3" />
            </Button>
            {hasExplorer ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(explorerUrl!, '_blank')}
                className="text-xs flex items-center space-x-1 hover:bg-[var(--biconomy-orange)] hover:text-white"
              >
                <ExternalLink className="h-3 w-3" />
                <span>{explorerName}</span>
              </Button>
            ) : (
              <span className="text-xs text-gray-500 px-2">
                No explorer available
              </span>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {hasExplorer 
            ? "View transaction details on blockchain explorer"
            : "Copy the transaction hash above to view in your preferred explorer"
          }
        </p>
      </div>
    );
  };

  const CodeField = ({ icon: Icon, label, value }: {
    icon: React.ComponentType<any>;
    label: string;
    value: string;
  }) => (
    <div className="p-3 bg-white border border-gray-100 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">{label}</span>
        </div>
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(value, label)}
            className="text-gray-400 hover:text-[var(--biconomy-orange)]"
          >
            <Copy className="h-3 w-3" />
          </Button>
        )}
      </div>
      <div className="bg-gray-50 p-2 rounded border max-h-32 overflow-y-auto">
        <code className={`text-xs font-mono text-gray-900 break-all block ${!value ? 'text-gray-400' : ''}`}>
          {value || 'Not available'}
        </code>
      </div>
    </div>
  );

  const renderOperation = (userOp: UserOp, index: number, isCleanup: boolean = false) => {
    const isExpanded = isCleanup ? expandedCleanupOps.has(index) : expandedOps.has(index);
    const toggleFunction = isCleanup ? toggleCleanupExpanded : toggleExpanded;
    const { verificationGasLimit, callGasLimit } = parseAccountGasLimits(userOp.userOp.accountGasLimits);
    const { maxPriorityFeePerGas, maxFeePerGas } = parseGasFees(userOp.userOp.gasFees);
    const executionTime = formatTimestamp(userOp.minedTimestamp || userOp.miningTimestamp);
    const chainInfo = chains.find(c => c.chainId.toString() === userOp.chainId);

    return (
      <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Operation Header */}
        <div className="p-4 bg-gray-50/50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[var(--biconomy-orange)]/10 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-[var(--biconomy-orange)]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">
                    {isCleanup ? 'Cleanup Operation' : `Operation #${index + 1}`}
                  </h4>
                  {isCleanup && (
                    <Badge variant="outline" className="text-xs">
                      Cleanup
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  {getNetworkIcon(userOp.chainId) && (
                    <img 
                      src={getNetworkIcon(userOp.chainId)!} 
                      alt={chainInfo?.name || `Chain ${userOp.chainId}`}
                      className="w-4 h-4"
                    />
                  )}
                  <p className="text-sm text-gray-500">{chainInfo?.name || `Chain ${userOp.chainId}`}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getExecutionStatusColor(userOp.executionStatus)}>
                {userOp.executionStatus}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFunction(index)}
                className="text-gray-500 hover:text-[var(--biconomy-orange)]"
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Operation Details - Always visible inline */}
        <div className="p-4 bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Transaction Hash with Explorer Link */}
            <div className="flex-1">
              {userOp.executionData ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">Transaction:</span>
                  </div>
                  <code className="text-sm font-mono text-gray-900">
                    {formatHash(userOp.executionData)}
                  </code>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(userOp.executionData, "Transaction Hash")}
                      className="text-gray-400 hover:text-[var(--biconomy-orange)] h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {hasExplorerSupport(userOp.chainId) ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(getExplorerUrl(userOp.chainId, userOp.executionData)!, '_blank')}
                        className="text-xs h-6 px-2 flex items-center space-x-1 hover:bg-[var(--biconomy-orange)] hover:text-white"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>{getExplorerName(userOp.chainId)}</span>
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-500 px-2">
                        No explorer available
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">
                    {isCleanup
                      ? "Not executed (no tokens to cleanup)" 
                      : "No transaction data available"
                    }
                  </span>
                </div>
              )}
            </div>

            {/* Mined Time */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Mined:</span>
              <span>{executionTime.relative}</span>
              <span className="text-gray-400">({executionTime.formatted})</span>
            </div>
          </div>
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="px-4 pb-4">
            <div className="space-y-4 pt-4 border-t border-gray-100">
              {/* User Operation Details */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Operation Details</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DataField icon={Hash} label="User Op Hash" value={userOp.userOpHash} />
                  <DataField icon={User} label="Sender" value={userOp.userOp.sender} />
                  <DataField icon={Hash} label="Nonce" value={userOp.userOp.nonce} />
                  <DataField icon={CreditCard} label="Paymaster and Data" value={userOp.userOp.paymasterAndData} />
                  <DataField icon={Fuel} label="Verification Gas Limit" value={formatGas(verificationGasLimit)} showCopy={false} />
                  <DataField icon={Fuel} label="Call Gas Limit" value={formatGas(callGasLimit)} showCopy={false} />
                  <DataField icon={Zap} label="Max Priority Fee Per Gas" value={formatGas(maxPriorityFeePerGas)} showCopy={false} />
                  <DataField icon={Zap} label="Max Fee Per Gas" value={formatGas(maxFeePerGas)} showCopy={false} />
                </div>
              </div>

              {/* Transaction Hash with Explorer Integration */}
              {userOp.executionData && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>On-Chain Transaction</span>
                  </h5>
                  <ExplorerLink txHash={userOp.executionData} chainId={userOp.chainId} />
                </div>
              )}

              {/* Call Data */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                  <Code className="h-4 w-4" />
                  <span>Call Data</span>
                </h5>
                <CodeField icon={Code} label="Call Data" value={userOp.userOp.callData} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Regular Operations Card */}
      {regularOperations.length > 0 && (
        <div className="bg-white border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 flex items-center justify-center">
                  <Layers className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">User Operations</h3>
              </div>
              <Badge className="px-2 py-1 text-xs bg-blue-100 text-blue-800 border border-blue-200">
                {regularOperations.length} operation{regularOperations.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
          <div className="p-6">

            <div className="space-y-4">
              {regularOperations.map((userOp, index) => renderOperation(userOp, index, false))}
            </div>
          </div>
        </div>
      )}

      {/* Cleanup Operations Toggle */}
      {cleanupOperations.length > 0 && (
        <div className="bg-white border border-slate-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-500 flex items-center justify-center">
                  <Settings className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Cleanup Operations</h3>
                  <p className="text-sm text-slate-500">
                    {cleanupOperations.length} cleanup operation{cleanupOperations.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCleanupOperations(!showCleanupOperations)}
                className="flex items-center space-x-2 hover:bg-slate-50 border-slate-200"
              >
                <span>{showCleanupOperations ? 'Hide' : 'Show'} Cleanup Operations</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showCleanupOperations ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Cleanup Operations Card */}
      {cleanupOperations.length > 0 && showCleanupOperations && (
        <div className="bg-blue-50 border border-slate-200">
          <div className="p-6">
            {/* Cleanup Explanation */}
            <div className="p-4 bg-blue-100 border border-blue-200 rounded-lg mb-6">
              <div className="flex items-start space-x-3">
                <Settings className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-2">About Cleanup Operations</h4>
                  <p className="text-sm text-blue-700">
                    Cleanup operations automatically execute after all regular operations complete. They remove any 
                    remaining tokens from the smart account. If there are no tokens to cleanup, these operations 
                    will not execute, which is completely normal behavior.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {cleanupOperations.map((userOp, index) => renderOperation(userOp, index, true))}
            </div>
          </div>
        </div>
      )}

      {/* No Operations Message */}
      {regularOperations.length === 0 && cleanupOperations.length === 0 && (
        <div className="bg-white border border-slate-200">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-orange-500 flex items-center justify-center">
                <Layers className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">User Operations</h3>
                <p className="text-sm text-slate-500">No operations found</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}