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
    <div className="p-3 glass-card-subtle border border-white/20 rounded-lg">
      <div className="flex items-center space-x-2 mb-1">
        <Icon className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-slate-600">{label}</span>
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
    <div className="glass-card rounded">
      <div className="px-6 py-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Hash className="h-4 w-4 text-orange-500" />
            <h3 className="text-base font-semibold text-slate-900">Supertransaction Details</h3>
          </div>
          <Badge className={`${statusColorClass} font-medium px-2 py-1 text-xs`}>
            <CheckCircle className="h-3 w-3 mr-1" />
            {overallStatus}
          </Badge>
        </div>
      </div>
      <div className="p-6 pl-[12px] pr-[12px] pt-[12px] pb-[12px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Supertx Hash */}
          <div className="glass-card-subtle border border-white/20 p-3 rounded">
            <div className="flex items-center space-x-2 mb-1">
              <Hash className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-slate-600">Supertransaction Hash</span>
            </div>
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono text-gray-900 truncate flex-1">
                {hashDetails.itxHash}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(hashDetails.itxHash, "Supertransaction Hash")}
                className="text-gray-400 hover:text-[var(--biconomy-orange)] shrink-0 ml-2"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Executing Relayer */}
          <div className="glass-card-subtle border border-white/20 p-3 rounded">
            <div className="flex items-center space-x-2 mb-1">
              <Server className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-slate-600">Executing Relayer</span>
            </div>
            <div className="flex items-center justify-between">
              <code className="text-sm font-mono text-gray-900 truncate flex-1">
                {hashDetails.node}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(hashDetails.node, "Executing Relayer")}
                className="text-gray-400 hover:text-[var(--biconomy-orange)] shrink-0 ml-2"
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
