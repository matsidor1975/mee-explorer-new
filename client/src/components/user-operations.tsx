import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ChevronDown, Code } from "lucide-react";
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

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">User Operations</h3>
          <Badge variant="secondary" className="bg-[var(--biconomy-orange)]/10 text-[var(--biconomy-orange)]">
            {userOps.length} operations
          </Badge>
        </div>
        
        <div className="space-y-4">
          {userOps.map((userOp, index) => {
            const isExpanded = expandedOps.has(index);
            const statusColorClass = getExecutionStatusColor(userOp.executionStatus);
            
            return (
              <div key={index} className="border border-gray-200 rounded-lg">
                <div 
                  className="p-4 bg-gray-50 rounded-t-lg cursor-pointer hover:bg-gray-100 transition-colors"
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
                          Hash: <code className="font-mono">{formatHash(userOp.userOpHash)}</code>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={statusColorClass}>
                        {userOp.executionStatus}
                      </Badge>
                      <ChevronDown 
                        className={`h-4 w-4 text-gray-400 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                      />
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Sender</label>
                          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                            <code className="text-xs font-mono text-gray-900 flex-1 break-all">
                              {userOp.userOp.sender}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(userOp.userOp.sender, "Sender address")}
                              className="text-gray-400 hover:text-[var(--biconomy-orange)] text-xs shrink-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Nonce</label>
                          <div className="p-2 bg-gray-50 rounded">
                            <span className="text-sm font-mono">{userOp.userOp.nonce}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Gas Limits</label>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Call Gas:</span>
                              <span className="font-mono">{formatGas(userOp.userOp.callGasLimit)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Verification Gas:</span>
                              <span className="font-mono">{formatGas(userOp.userOp.verificationGasLimit)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Pre-verification Gas:</span>
                              <span className="font-mono">{formatGas(userOp.userOp.preVerificationGas)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Max Fee Per Gas</label>
                          <div className="p-2 bg-gray-50 rounded">
                            <span className="text-sm font-mono">{userOp.userOp.maxFeePerGas}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Max Priority Fee</label>
                          <div className="p-2 bg-gray-50 rounded">
                            <span className="text-sm font-mono">{userOp.userOp.maxPriorityFeePerGas}</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Timestamp Range</label>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Lower Bound:</span>
                              <span className="font-mono">{formatTimestamp(userOp.lowerBoundTimestamp).formatted}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Upper Bound:</span>
                              <span className="font-mono">{formatTimestamp(userOp.upperBoundTimestamp).formatted}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Call Data</label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <code className="text-xs font-mono text-gray-900 break-all block">
                              {userOp.userOp.callData}
                            </code>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-500 mb-1">Paymaster Data</label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <code className="text-xs font-mono text-gray-900 break-all block">
                              {userOp.userOp.paymasterAndData}
                            </code>
                          </div>
                        </div>
                      </div>
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
