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
    <div className="gradient-card-subtle rounded-lg p-3 sm:p-4">
      <div className="flex items-center space-x-2 mb-2">
        <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
        <span className="text-xs sm:text-sm font-medium text-slate-600">{label}</span>
      </div>
      <div className="flex items-start justify-between gap-2">
        <code className={`text-xs sm:text-sm font-mono text-gray-900 ${truncate ? 'truncate' : 'break-all'} flex-1 ${!value ? 'text-gray-400' : ''} leading-relaxed`}>
          {!value ? 'Not available' : truncate && value.length > 30 && window.innerWidth < 640 
            ? `${value.slice(0, 12)}...${value.slice(-8)}` 
            : value
          }
        </code>
        {showCopy && value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(value, label)}
            className="text-gray-400 hover:text-[var(--biconomy-orange)] shrink-0 p-1 h-auto"
          >
            <Copy className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="glass-root-card rounded-lg p-6">
      <div className="pb-2 mb-4 border-b border-gray-100 mx-[-12px] px-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Hash className="h-4 w-4 text-orange-500" />
            <h3 className="text-lg sm:text-xl root-card-title">Transaction Overview</h3>
          </div>
          <Badge className={`${statusColorClass} font-medium px-2 py-1 text-xs flex items-center self-start sm:self-auto`}>
            <CheckCircle className="h-3 w-3 mr-1" />
            {overallStatus}
          </Badge>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Supertx Hash */}
          <div className="gradient-card-subtle rounded-lg p-3 sm:p-4 border border-black/5">
            <div className="flex items-center space-x-2 mb-2">
              <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-600">Supertransaction Hash</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <code className="text-xs sm:text-sm font-mono text-gray-900 break-all flex-1 leading-relaxed">
                {hashDetails.itxHash}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(hashDetails.itxHash, "Supertransaction Hash")}
                className="text-gray-400 hover:text-[var(--biconomy-orange)] shrink-0 p-1 h-auto"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Executing Relayer */}
          <div className="gradient-card-subtle rounded-lg p-3 sm:p-4 border border-black/5">
            <div className="flex items-center space-x-2 mb-2">
              <Server className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-600">Executing Relayer</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <code className="text-xs sm:text-sm font-mono text-gray-900 break-all flex-1 leading-relaxed">
                {hashDetails.node}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(hashDetails.node, "Executing Relayer")}
                className="text-gray-400 hover:text-[var(--biconomy-orange)] shrink-0 p-1 h-auto"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
