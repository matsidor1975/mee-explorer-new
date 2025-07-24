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
    <div className="bg-white border border-slate-200 rounded">
      <div className="px-6 py-4 border-b border-slate-200">
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
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Supertx Hash */}
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Supertransaction Hash</p>
            <div className="flex items-center space-x-2">
              <code className="text-sm font-mono text-slate-900 bg-slate-50 px-3 py-2 border border-slate-200 flex-1">
                {formatHash(hashDetails.itxHash)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(hashDetails.itxHash, "Supertransaction Hash")}
                className="text-slate-400 hover:text-orange-500 h-8 w-8 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Executing Relayer */}
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Executing Relayer</p>
            <div className="flex items-center space-x-2">
              <code className="text-sm font-mono text-slate-900 bg-slate-50 px-3 py-2 border border-slate-200 flex-1">
                {formatHash(hashDetails.node)}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(hashDetails.node, "Executing Relayer")}
                className="text-slate-400 hover:text-orange-500 h-8 w-8 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
