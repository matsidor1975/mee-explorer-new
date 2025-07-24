import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Coins, DollarSign, Fuel, CreditCard, Wallet, Hash, Key } from "lucide-react";
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

  const MetricCard = ({ icon: Icon, label, value, subtitle, color }: {
    icon: React.ComponentType<any>;
    label: string;
    value: string;
    subtitle: string;
    color: string;
  }) => (
    <div className="bg-white border border-gray-100 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <Icon className={`h-4 w-4 ${color}`} />
            <p className="text-sm font-medium text-gray-600">{label}</p>
          </div>
          <p className="text-xl font-semibold text-gray-900">{value || 'Not available'}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const DataField = ({ icon: Icon, label, value }: {
    icon: React.ComponentType<any>;
    label: string;
    value: string;
  }) => (
    <div className="bg-white border border-gray-100 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-2">
        <Icon className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <code className={`text-sm font-mono text-gray-900 truncate flex-1 ${!value ? 'text-gray-400' : ''}`}>
          {value || 'Not available'}
        </code>
        {value && (
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
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-[var(--biconomy-orange)]/10 rounded-lg flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-[var(--biconomy-orange)]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Payment Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={Coins}
            label="Token Amount"
            value={paymentInfo.tokenAmount ? formatNumber(paymentInfo.tokenAmount) : ''}
            subtitle={paymentInfo.token || ''}
            color="text-[var(--biconomy-orange)]"
          />
          
          <MetricCard
            icon={DollarSign}
            label="Token Value"
            value={paymentInfo.tokenValue ? `$${paymentInfo.tokenValue}` : ''}
            subtitle="USD"
            color="text-blue-500"
          />
          
          <MetricCard
            icon={Fuel}
            label="Gas Fee"
            value={paymentInfo.gasFee ? `$${paymentInfo.gasFee}` : ''}
            subtitle="USD"
            color="text-purple-500"
          />
          
          <MetricCard
            icon={CreditCard}
            label="Orchestration Fee"
            value={paymentInfo.orchestrationFee ? `$${paymentInfo.orchestrationFee}` : ''}
            subtitle="USD"
            color="text-green-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField
            icon={Wallet}
            label="Master Wallet"
            value={paymentInfo.masterWallet}
          />
          
          <DataField
            icon={Key}
            label="Salt"
            value={paymentInfo.salt}
          />
        </div>
      </CardContent>
    </Card>
  );
}
