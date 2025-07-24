import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, Hash, Server, Link, Clock, Network } from "lucide-react";
import { HashDetails } from "@/types";
import { formatHash, formatTimestamp, getChainName, getExecutionStatusColor } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";

interface HashOverviewProps {
  hashDetails: HashDetails;
}

export default function HashOverview({ hashDetails }: HashOverviewProps) {
  const { toast } = useToast();

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
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[var(--biconomy-orange)]/10 rounded-lg flex items-center justify-center">
              <Hash className="h-5 w-5 text-[var(--biconomy-orange)]" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Supertransaction Details</h3>
          </div>
          <Badge className={`${statusColorClass} px-3 py-1 border-0`}>
            <CheckCircle className="w-4 h-4 mr-2" />
            {overallStatus || 'Unknown'}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <DataField
            icon={Hash}
            label="Supertransaction Hash"
            value={hashDetails.hash}
          />
          
          <DataField
            icon={Server}
            label="Node"
            value={hashDetails.node}
          />
          
          <DataField
            icon={Link}
            label="Commitment"
            value={hashDetails.commitment}
          />
          
          <DataField
            icon={Network}
            label="Chain"
            value={hashDetails.paymentInfo.chainId ? `${hashDetails.paymentInfo.chainId} (${getChainName(hashDetails.paymentInfo.chainId)})` : ''}
            showCopy={false}
            truncate={false}
          />
          
          <DataField
            icon={Clock}
            label="Timestamp"
            value={hashDetails.userOps[0] ? formatTimestamp(hashDetails.userOps[0].lowerBoundTimestamp).formatted : ''}
            showCopy={false}
            truncate={false}
          />
          
          <div className="p-4 bg-white border border-gray-100 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Status</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${overallStatus.toLowerCase().includes('success') ? 'bg-green-500' : overallStatus.toLowerCase().includes('pending') ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${overallStatus.toLowerCase().includes('success') ? 'text-green-700' : overallStatus.toLowerCase().includes('pending') ? 'text-yellow-700' : 'text-red-700'}`}>
                {overallStatus || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
