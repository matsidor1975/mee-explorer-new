import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle } from "lucide-react";
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

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Supertransaction Details</h3>
          <div className="flex items-center space-x-2">
            <Badge className={`${statusColorClass} px-3 py-1`}>
              <CheckCircle className="w-4 h-4 mr-2" />
              {overallStatus}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Supertransaction Hash</label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <code className="text-sm font-mono text-gray-900 flex-1 break-all">
                  {hashDetails.hash}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(hashDetails.hash, "Supertransaction hash")}
                  className="text-gray-400 hover:text-[var(--biconomy-orange)] shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Node</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <code className="text-sm font-mono text-gray-900">{hashDetails.node}</code>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Commitment</label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <code className="text-sm font-mono text-gray-900 flex-1 break-all">
                  {hashDetails.commitment}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(hashDetails.commitment, "Commitment")}
                  className="text-gray-400 hover:text-[var(--biconomy-orange)] shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Chain ID</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{hashDetails.paymentInfo.chainId}</span>
                  <span className="text-xs text-gray-500">({getChainName(hashDetails.paymentInfo.chainId)})</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Timestamp</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                {hashDetails.userOps[0] && (
                  <>
                    <div className="text-sm font-medium text-gray-900">
                      {formatTimestamp(hashDetails.userOps[0].lowerBoundTimestamp).formatted}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTimestamp(hashDetails.userOps[0].lowerBoundTimestamp).relative}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${overallStatus.toLowerCase().includes('success') ? 'bg-green-500' : overallStatus.toLowerCase().includes('pending') ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-medium ${overallStatus.toLowerCase().includes('success') ? 'text-green-700' : overallStatus.toLowerCase().includes('pending') ? 'text-yellow-700' : 'text-red-700'}`}>
                  {overallStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
