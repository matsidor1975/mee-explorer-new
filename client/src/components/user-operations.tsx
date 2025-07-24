import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ChevronDown, Code, User, Hash, Fuel, Clock, Zap, Layers, Settings, AlertTriangle, CheckCircle, ExternalLink, Wallet, CreditCard, Play } from "lucide-react";
import { UserOp } from "@/types";
import { formatHash, formatGas, formatTimestamp, getExecutionStatusColor, parseAccountGasLimits, parseGasFees, getExplorerUrl, getExplorerName, hasExplorerSupport, getNetworkIcon } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";
import { useChainInfo } from "@/hooks/use-chain-info";
import { simulateUserOperation } from "@/lib/tenderly";

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

  const handleTenderlySimulation = async (userOp: UserOp) => {
    try {
      toast({
        title: "Starting simulation...",
        description: "Creating Tenderly simulation for this operation.",
      });
      
      const simulationUrl = await simulateUserOperation(userOp);
      
      // Open the simulation in a new tab
      window.open(simulationUrl, '_blank');
      
      toast({
        title: "Simulation created!",
        description: "Tenderly simulation opened in new tab.",
      });
    } catch (error) {
      console.error('Tenderly simulation error:', error);
      toast({
        title: "Simulation failed",
        description: error instanceof Error ? error.message : "Failed to create Tenderly simulation",
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
    <div className="p-3 bg-white border border-gray-100 rounded">
      <div className="flex items-center space-x-2 mb-2">
        <Icon className="h-4 w-4 text-gray-500" />
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

  const CompactDataField = ({ icon: Icon, label, value, showCopy = true }: {
    icon: React.ComponentType<any>;
    label: string;
    value: string;
    showCopy?: boolean;
  }) => (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <Icon className="h-3 w-3 text-gray-500 shrink-0" />
        <span className="text-xs text-gray-600 shrink-0">{label}:</span>
        <code className={`text-xs font-mono text-gray-900 truncate ${!value ? 'text-gray-400' : ''}`}>
          {value ? (value.length > 12 ? `${value.substring(0, 6)}...${value.substring(value.length - 6)}` : value) : 'N/A'}
        </code>
      </div>
      {showCopy && value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(value, label)}
          className="text-gray-400 hover:text-[var(--biconomy-orange)] h-4 w-4 p-0 shrink-0 ml-1"
        >
          <Copy className="h-2.5 w-2.5" />
        </Button>
      )}
    </div>
  );

  const ExplorerLink = ({ txHash, chainId }: { txHash: string; chainId: string }) => {
    const explorerUrl = getExplorerUrl(chainId, txHash);
    const explorerName = getExplorerName(chainId);
    const hasExplorer = hasExplorerSupport(chainId);
    
    return (
      <div className="p-3 bg-white border border-gray-100 rounded">
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
    <div className="p-3 bg-white border border-gray-100 rounded">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4 text-gray-500" />

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
      <div key={index} className="border border-gray-200 rounded overflow-hidden">
        {/* Compact Operation Header */}
        <div className="p-2 bg-gray-50/50">
          {/* Desktop Layout - Everything Inline */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              {/* Operation number and chain */}
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-[var(--biconomy-orange)]" />
                <h4 className="font-medium text-gray-900 text-sm">
                  {isCleanup ? 'Cleanup Operation' : `#${index + 1}`}
                </h4>
                {!isCleanup && (
                  <>
                    <span className="text-gray-400">•</span>
                    {getNetworkIcon(userOp.chainId) && (
                      <img 
                        src={getNetworkIcon(userOp.chainId)!} 
                        alt={chainInfo?.name || `Chain ${userOp.chainId}`}
                        className="w-4 h-4"
                      />
                    )}
                    <span className="font-medium text-gray-900 text-sm">{chainInfo?.name || `Chain ${userOp.chainId}`}</span>
                  </>
                )}
                {isCleanup && (
                  <Badge variant="outline" className="text-xs badge">
                    Cleanup
                  </Badge>
                )}
              </div>
              
              {/* Transaction Hash - only show if simulate button is not available */}
              {userOp.executionData && userOp.executionStatus === "MINED_SUCCESS" && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">•</span>
                  <ExternalLink className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600">Tx:</span>
                  <code className="text-xs font-mono text-gray-900">{formatHash(userOp.executionData)}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(userOp.executionData, "Transaction Hash")}
                    className="text-gray-400 hover:text-[var(--biconomy-orange)] h-4 w-4 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  {hasExplorerSupport(userOp.chainId) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getExplorerUrl(userOp.chainId, userOp.executionData)!, '_blank')}
                      className="text-xs px-1 py-0.5 h-5 flex items-center hover:bg-[var(--biconomy-orange)] hover:text-white"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
              
              {/* Status and Time - show status always, time only for mined operations */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">•</span>
                <Badge className={`${getExecutionStatusColor(userOp.executionStatus)} badge text-xs`}>
                  {userOp.executionStatus}
                </Badge>
                {userOp.executionStatus === "MINED_SUCCESS" && (
                  <>
                    <span className="text-gray-400">•</span>
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600">{executionTime.formatted}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {userOp.executionStatus !== "MINED_SUCCESS" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTenderlySimulation(userOp)}
                  className="text-xs pt-[14px] pb-[14px] pl-[16px] pr-[16px] flex items-center space-x-1 hover:bg-blue-500 hover:text-white"
                >
                  <Play className="h-3 w-3" />
                  <span>Simulate with Tenderly</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFunction(index)}
                className="text-gray-500 hover:text-[var(--biconomy-orange)] h-6 w-6 p-0"
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Mobile Layout - Stacked */}
          <div className="md:hidden space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-[var(--biconomy-orange)]" />
                <h4 className="font-medium text-gray-900 text-sm">
                  {isCleanup ? 'Cleanup Operation' : `#${index + 1}`}
                </h4>
                {!isCleanup && (
                  <>
                    {getNetworkIcon(userOp.chainId) && (
                      <img 
                        src={getNetworkIcon(userOp.chainId)!} 
                        alt={chainInfo?.name || `Chain ${userOp.chainId}`}
                        className="w-4 h-4"
                      />
                    )}
                    <span className="font-medium text-gray-900 text-sm">{chainInfo?.name || `Chain ${userOp.chainId}`}</span>
                  </>
                )}
                {isCleanup && (
                  <Badge variant="outline" className="text-xs badge">
                    Cleanup
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {userOp.executionStatus !== "MINED_SUCCESS" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTenderlySimulation(userOp)}
                    className="text-xs pt-[14px] pb-[14px] pl-[16px] pr-[16px] flex items-center hover:bg-blue-500 hover:text-white"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    <span>Simulate with Tenderly</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFunction(index)}
                  className="text-gray-500 hover:text-[var(--biconomy-orange)] h-6 w-6 p-0"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Status and Time Row - show status always, time only for mined operations */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className={`${getExecutionStatusColor(userOp.executionStatus)} badge text-xs`}>
                  {userOp.executionStatus}
                </Badge>
                {userOp.executionStatus === "MINED_SUCCESS" && (
                  <>
                    <Clock className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600">{executionTime.formatted}</span>
                  </>
                )}
              </div>
            </div>

            {/* Transaction Hash Row - only show if simulate button is not available */}
            {userOp.executionData && userOp.executionStatus === "MINED_SUCCESS" && (
              <div className="flex items-center space-x-2 bg-white p-2 rounded border">
                <ExternalLink className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-600">Tx:</span>
                <code className="text-xs font-mono text-gray-900 flex-1 truncate">{formatHash(userOp.executionData)}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(userOp.executionData, "Transaction Hash")}
                  className="text-gray-400 hover:text-[var(--biconomy-orange)] h-5 w-5 p-0 shrink-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                {hasExplorerSupport(userOp.chainId) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(getExplorerUrl(userOp.chainId, userOp.executionData)!, '_blank')}
                    className="text-xs px-1 py-0.5 h-5 flex items-center hover:bg-[var(--biconomy-orange)] hover:text-white shrink-0"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
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
                {/* Desktop: Compact 3-column layout */}
                <div className="hidden md:grid md:grid-cols-3 gap-x-6 gap-y-1 text-xs">
                  <CompactDataField icon={Hash} label="Op Hash" value={userOp.userOpHash} />
                  <CompactDataField icon={User} label="Sender" value={userOp.userOp.sender} />
                  <CompactDataField icon={Hash} label="Nonce" value={userOp.userOp.nonce} />
                  <CompactDataField icon={CreditCard} label="Paymaster" value={userOp.userOp.paymasterAndData} />
                  <CompactDataField icon={Fuel} label="Verify Gas" value={formatGas(verificationGasLimit)} showCopy={false} />
                  <CompactDataField icon={Fuel} label="Call Gas" value={formatGas(callGasLimit)} showCopy={false} />
                  <CompactDataField icon={Zap} label="Priority Fee" value={formatGas(maxPriorityFeePerGas)} showCopy={false} />
                  <CompactDataField icon={Zap} label="Max Fee" value={formatGas(maxFeePerGas)} showCopy={false} />
                </div>
                {/* Mobile: Original card layout */}
                <div className="md:hidden grid grid-cols-1 gap-4">
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
        <div className="bg-white border border-slate-200 rounded">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Layers className="h-4 w-4 text-blue-500" />
                <h3 className="text-base font-semibold text-slate-900">User Operations</h3>
              </div>
              <Badge className="px-3 py-1 text-xs bg-blue-100 text-blue-800 border border-blue-200 badge">
                {regularOperations.length} operation{regularOperations.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
          <div className="p-6 pl-[16px] pr-[16px] pt-[8px] pb-[8px]">
            <div className="space-y-4">
              {regularOperations.map((userOp, index) => renderOperation(userOp, index, false))}
            </div>
          </div>
        </div>
      )}
      {/* Cleanup Operations Toggle */}
      {cleanupOperations.length > 0 && (
        <div className="bg-white border border-slate-200 rounded">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings className="h-4 w-4 text-slate-500" />
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Cleanup Operations</h3>
                  <p className="text-sm text-slate-500">
                    {cleanupOperations.length} cleanup operation{cleanupOperations.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCleanupOperations(!showCleanupOperations)}
                className="flex items-center space-x-2 hover:bg-slate-50 border-slate-200 pt-[14px] pb-[14px] pl-[16px] pr-[16px]"
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
        <div className="bg-blue-50 border border-slate-200 rounded">
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
        <div className="bg-white border border-slate-200 rounded">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Layers className="h-4 w-4 text-orange-500" />
              <div>
                <h3 className="text-base font-semibold text-slate-900">User Operations</h3>
                <p className="text-sm text-slate-500">No operations found</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}