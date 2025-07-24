import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, Hash, Server, Link, Clock, Network } from "lucide-react";
import { HashDetails } from "@/types";
import { formatHash, formatTimestamp, getChainName, getExecutionStatusColor } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";
import { useChainInfo } from "@/hooks/use-chain-info";

interface HashOverviewProps {
  hashDetails: HashDetails;
}

export default function HashOverview({ hashDetails }: HashOverviewProps) {
  const { toast } = useToast();
  const { chains } = useChainInfo();
  
  // Get chain information
  const chainInfo = chains.find(c => c.chainId === hashDetails.paymentInfo.chainId);

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

  // Get execution status from first user operation for overall status
  const overallStatus = hashDetails.userOps[0]?.executionStatus || "Unknown";
  const statusColorClass = getExecutionStatusColor(overallStatus);

  const DataField = ({ icon: Icon, label, value, showCopy = true, truncate = true }: {
    icon: React.ComponentType<any>;
    label: string;
    value: string;
    showCopy?: boolean;
    truncate?: boolean;
  }) => (
    <div className="p-4 bg-white border border-gray-100 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <Icon className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <code className={`text-sm font-mono text-gray-900 ${truncate ? 'truncate' : 'break-all'} flex-1 ${!value ? 'text-gray-400' : ''}`}>
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

  return (
    <div className="bg-white rounded-2xl border border-gray-100/50 shadow-sm">
      <div className="p-6 border-b border-gray-100/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Supertx Hash and Node Inline */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Hash className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Supertransaction</p>
                <div className="flex items-center space-x-2">
                  <code className="text-sm font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded-lg">
                    {formatHash(hashDetails.itxHash)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(hashDetails.itxHash, "Supertransaction Hash")}
                    className="text-gray-400 hover:text-orange-500 h-7 w-7 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Server className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Node</p>
                <div className="flex items-center space-x-2">
                  <code className="text-sm font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded-lg">
                    {formatHash(hashDetails.node)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(hashDetails.node, "Node")}
                    className="text-gray-400 hover:text-orange-500 h-7 w-7 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center space-x-3">
            <Badge className={`${statusColorClass} font-medium px-3 py-1 rounded-full`}>
              <CheckCircle className="h-3 w-3 mr-1" />
              {overallStatus}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
