import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ChevronDown, Code, User, Hash, Fuel, Clock, Zap, Layers, Settings, AlertTriangle, CheckCircle, ExternalLink, Wallet, CreditCard } from "lucide-react";
import { UserOp } from "@/types";
import { formatHash, formatGas, formatTimestamp, getExecutionStatusColor, parseAccountGasLimits, parseGasFees, getExplorerUrl, getExplorerName } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";
import { useChainInfo } from "@/hooks/use-chain-info";

interface UserOperationsProps {
  userOps: UserOp[];
}

export default function UserOperations({ userOps }: UserOperationsProps) {
  const [expandedOps, setExpandedOps] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const { chains } = useChainInfo();

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedOps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedOps(newExpanded);
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(explorerUrl, '_blank')}
              className="text-xs flex items-center space-x-1 hover:bg-[var(--biconomy-orange)] hover:text-white"
            >
              <ExternalLink className="h-3 w-3" />
              <span>{explorerName}</span>
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">View transaction details on blockchain explorer</p>
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

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[var(--biconomy-orange)]/10 rounded-lg flex items-center justify-center">
              <Layers className="h-5 w-5 text-[var(--biconomy-orange)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">User Operations</h3>
          </div>
          <Badge variant="secondary" className="bg-[var(--biconomy-orange)]/10 text-[var(--biconomy-orange)] border-0">
            {userOps.length} operation{userOps.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="space-y-4">
          {userOps.map((userOp, index) => {
            const isExpanded = expandedOps.has(index);
            const { verificationGasLimit, callGasLimit } = parseAccountGasLimits(userOp.userOp.accountGasLimits);
            const { maxPriorityFeePerGas, maxFeePerGas } = parseGasFees(userOp.userOp.gasFees);
            const executionTime = formatTimestamp(userOp.minedTimestamp || userOp.miningTimestamp);
            const chainInfo = chains.find(c => c.chainId === parseInt(userOp.chainId));

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
                        <h4 className="font-medium text-gray-900">Operation #{index + 1}</h4>
                        <p className="text-sm text-gray-500">{chainInfo?.name || `Chain ${userOp.chainId}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getExecutionStatusColor(userOp.executionStatus)}>
                        {userOp.executionStatus}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(index)}
                        className="text-gray-500 hover:text-[var(--biconomy-orange)]"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Operation Details */}
                <div className="p-4">
                  {/* Always visible: Essential info only */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {/* Execution Data - Transaction Hash with Explorer Link */}
                    {userOp.executionData ? (
                      <ExplorerLink txHash={userOp.executionData} chainId={userOp.chainId} />
                    ) : (
                      <div className="p-3 bg-white border border-gray-100 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <ExternalLink className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-600">On-Chain Transaction</span>
                        </div>
                        <p className="text-xs text-gray-400">No execution data available</p>
                      </div>
                    )}
                    
                    <DataField
                      icon={Clock}
                      label="Mined Time"
                      value={executionTime.formatted}
                      showCopy={false}
                    />
                  </div>

                  {/* Expandable Details */}
                  {isExpanded && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      {/* User Operation Details */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                          <Settings className="h-4 w-4" />
                          <span>Operation Details</span>
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <DataField icon={User} label="Sender" value={userOp.userOp.sender} />
                          <DataField icon={Hash} label="Nonce" value={userOp.userOp.nonce} />
                          <DataField icon={Fuel} label="Pre-verification Gas" value={formatGas(userOp.userOp.preVerificationGas)} />
                          <DataField icon={Zap} label="Chain ID" value={userOp.chainId} />
                          <DataField icon={CreditCard} label="Max Gas Limit" value={formatGas(userOp.maxGasLimit)} />
                          <DataField icon={Fuel} label="Max Fee Per Gas" value={formatGas(userOp.maxFeePerGas)} />
                        </div>
                      </div>

                      {/* Gas Information */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                          <Fuel className="h-4 w-4" />
                          <span>Gas Information</span>
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <DataField icon={Fuel} label="Verification Gas Limit" value={formatGas(verificationGasLimit)} />
                          <DataField icon={Fuel} label="Call Gas Limit" value={formatGas(callGasLimit)} />
                          <DataField icon={Zap} label="Max Priority Fee Per Gas" value={formatGas(maxPriorityFeePerGas)} />
                          <DataField icon={Zap} label="Max Fee Per Gas" value={formatGas(maxFeePerGas)} />
                        </div>
                      </div>

                      {/* Timing Information */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>Timing Information</span>
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {userOp.lowerBoundTimestamp > 0 && (
                            <DataField 
                              icon={Clock} 
                              label="Lower Bound" 
                              value={formatTimestamp(userOp.lowerBoundTimestamp).formatted}
                              showCopy={false}
                            />
                          )}
                          <DataField 
                            icon={Clock} 
                            label="Upper Bound" 
                            value={formatTimestamp(userOp.upperBoundTimestamp).formatted}
                            showCopy={false}
                          />
                          <DataField 
                            icon={Clock} 
                            label="Simulation Finished" 
                            value={formatTimestamp(userOp.simulationFinishedAt).formatted}
                            showCopy={false}
                          />
                          <DataField 
                            icon={Clock} 
                            label="Mining Time" 
                            value={formatTimestamp(userOp.miningTimestamp).formatted}
                            showCopy={false}
                          />
                        </div>
                      </div>

                      {/* Code Fields */}
                      <div className="space-y-3">
                        <CodeField icon={Code} label="Init Code" value={userOp.userOp.initCode} />
                        <CodeField icon={Code} label="Call Data" value={userOp.userOp.callData} />
                        <CodeField icon={Settings} label="Paymaster and Data" value={userOp.userOp.paymasterAndData} />
                        <CodeField icon={Settings} label="Signature" value={userOp.userOp.signature} />
                      </div>

                      {/* Additional Flags */}
                      {userOp.shortEncoding !== undefined && (
                        <div className="flex items-center space-x-4 pt-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Short Encoding:</span>
                            <Badge variant={userOp.shortEncoding ? "default" : "secondary"}>
                              {userOp.shortEncoding ? "Enabled" : "Disabled"}
                            </Badge>
                          </div>
                          {userOp.isCleanUpUserOp !== undefined && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">Cleanup Operation:</span>
                              <Badge variant={userOp.isCleanUpUserOp ? "default" : "secondary"}>
                                {userOp.isCleanUpUserOp ? "Yes" : "No"}
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}