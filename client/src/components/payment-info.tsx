import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Coins, DollarSign, Fuel, Percent } from "lucide-react";
import { PaymentInfo } from "@/types";
import { formatAddress, formatNumber } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";

interface PaymentInfoProps {
  paymentInfo: PaymentInfo;
}

export default function PaymentInfoComponent({ paymentInfo }: PaymentInfoProps) {
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

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-biconomy-gradient p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Token Amount</p>
                <p className="text-2xl font-bold">{formatNumber(paymentInfo.tokenAmount)}</p>
                <p className="text-xs opacity-90">{paymentInfo.token}</p>
              </div>
              <Coins className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-blue-500 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Token Value</p>
                <p className="text-2xl font-bold">${formatNumber(paymentInfo.tokenValue)}</p>
                <p className="text-xs opacity-90">USD</p>
              </div>
              <DollarSign className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-purple-500 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Gas Fee</p>
                <p className="text-2xl font-bold">{formatNumber(paymentInfo.gasFee)}</p>
                <p className="text-xs opacity-90">ETH</p>
              </div>
              <Fuel className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-green-500 p-4 rounded-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Orchestration Fee</p>
                <p className="text-2xl font-bold">{paymentInfo.orchestrationFee}</p>
                <p className="text-xs opacity-90">of amount</p>
              </div>
              <Percent className="h-8 w-8 opacity-80" />
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Master Wallet</label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <code className="text-sm font-mono text-gray-900 flex-1 break-all">
                  {paymentInfo.masterWallet}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(paymentInfo.masterWallet, "Master wallet address")}
                  className="text-gray-400 hover:text-[var(--biconomy-orange)] shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Salt</label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <code className="text-sm font-mono text-gray-900 flex-1 break-all">
                  {paymentInfo.salt}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(paymentInfo.salt, "Salt")}
                  className="text-gray-400 hover:text-[var(--biconomy-orange)] shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
