import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ChevronDown, Code, User, Hash, Fuel, Clock, Zap, Layers, Settings } from "lucide-react";
import { UserOp } from "@/types";
import { formatHash, formatGas, formatTimestamp, getExecutionStatusColor } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";

interface UserOperationsProps {
  userOps: UserOp[];
}

export default function UserOperations({ userOps }: UserOperationsProps) {
  const [expandedOps, setExpandedOps] = useState<Set<number>>(new Set());
  const { toast } = useToast();

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
            {userOps.length} operations
          </Badge>
        </div>
        
        <div className="space-y-4">
          {userOps.map((userOp, index) => {
            const isExpanded = expandedOps.has(index);
            const statusColorClass = getExecutionStatusColor(userOp.executionStatus);
            
            return (
              <div key={index} className="border border-gray-100 rounded-lg bg-white">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-lg"
                  onClick={() => toggleExpanded(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-[var(--biconomy-orange)]/10 rounded-lg flex items-center justify-center">
                        <Code className="h-5 w-5 text-[var(--biconomy-orange)]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">User Operation #{index + 1}</h4>
                        <p className="text-sm text-gray-500">
                          Hash: <code className="font-mono">{formatHash(userOp.userOpHash || '')}</code>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${statusColorClass} border-0`}>
                        {userOp.executionStatus || 'Unknown'}
                      </Badge>
                      <ChevronDown 
                        className={`h-4 w-4 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                      />
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <DataField
                        icon={User}
                        label="Sender"
                        value={userOp.userOp.sender}
                      />
                      
                      <DataField
                        icon={Hash}
                        label="Nonce"
                        value={userOp.userOp.nonce}
                        showCopy={false}
                      />
                      
                      <DataField
                        icon={Fuel}
                        label="Call Gas Limit"
                        value={userOp.userOp.callGasLimit ? formatGas(userOp.userOp.callGasLimit) : ''}
                        showCopy={false}
                      />
                      
                      <DataField
                        icon={Zap}
                        label="Verification Gas Limit"
                        value={userOp.userOp.verificationGasLimit ? formatGas(userOp.userOp.verificationGasLimit) : ''}
                        showCopy={false}
                      />
                      
                      <DataField
                        icon={Settings}
                        label="Pre-verification Gas"
                        value={userOp.userOp.preVerificationGas ? formatGas(userOp.userOp.preVerificationGas) : ''}
                        showCopy={false}
                      />
                      
                      <DataField
                        icon={Fuel}
                        label="Max Fee Per Gas"
                        value={userOp.userOp.maxFeePerGas}
                        showCopy={false}
                      />
                      
                      <DataField
                        icon={Zap}
                        label="Max Priority Fee Per Gas"
                        value={userOp.userOp.maxPriorityFeePerGas}
                        showCopy={false}
                      />
                      
                      <DataField
                        icon={Clock}
                        label="Max Gas Limit"
                        value={userOp.maxGasLimit ? formatGas(userOp.maxGasLimit) : ''}
                        showCopy={false}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <DataField
                        icon={Clock}
                        label="Lower Bound Timestamp"
                        value={userOp.lowerBoundTimestamp ? formatTimestamp(userOp.lowerBoundTimestamp).formatted : ''}
                        showCopy={false}
                      />
                      
                      <DataField
                        icon={Clock}
                        label="Upper Bound Timestamp"
                        value={userOp.upperBoundTimestamp ? formatTimestamp(userOp.upperBoundTimestamp).formatted : ''}
                        showCopy={false}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <CodeField
                        icon={Code}
                        label="Init Code"
                        value={userOp.userOp.initCode}
                      />
                      
                      <CodeField
                        icon={Code}
                        label="Call Data"
                        value={userOp.userOp.callData}
                      />
                      
                      <CodeField
                        icon={Code}
                        label="Paymaster and Data"
                        value={userOp.userOp.paymasterAndData}
                      />
                      
                      <CodeField
                        icon={Code}
                        label="Execution Data"
                        value={userOp.executionData}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
