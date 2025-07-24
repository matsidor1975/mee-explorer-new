import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, DollarSign, CreditCard, Wallet, Hash, Key, Circle, ChevronDown, Receipt, Users } from "lucide-react";
import { PaymentInfo, UserOp } from "@/types";
import { formatAddress, formatNumber, getTokenInfo } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";
import { useChainInfo } from "@/hooks/use-chain-info";

interface PaymentInfoProps {
  paymentInfo: PaymentInfo;
  feePayerUserOp?: UserOp; // First user operation that pays the fees
}

export default function PaymentInfoComponent({ paymentInfo, feePayerUserOp }: PaymentInfoProps) {
  const { toast } = useToast();
  const { chains } = useChainInfo();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get token information
  const tokenInfo = getTokenInfo(paymentInfo.token, paymentInfo.chainId);
  const chainInfo = chains.find(c => c.chainId === paymentInfo.chainId);
  
  // Calculate total fees
  const gasFeeNum = parseFloat(paymentInfo.gasFee || '0');
  const orchestrationFeeNum = parseFloat(paymentInfo.orchestrationFee || '0');
  const totalFees = gasFeeNum + orchestrationFeeNum;

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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Receipt className="h-4 w-4 text-purple-500" />
              <p className="text-sm font-medium text-gray-600">Gas Fee</p>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              ${paymentInfo.gasFee || 'Not available'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Paid to blockchain validators</p>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Users className="h-4 w-4 text-[var(--biconomy-orange)]" />
              <p className="text-sm font-medium text-gray-600">Orchestration Fee</p>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              ${paymentInfo.orchestrationFee || 'Not available'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Paid to Biconomy network relayers</p>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <p className="text-sm font-medium text-gray-600">Total Fees</p>
            </div>
            <p className="text-xl font-semibold text-gray-900">
              ${totalFees.toFixed(6)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Gas + Orchestration fees</p>
          </div>
        </div>
        
        {/* Expandable payment details */}
        <div className="mt-4">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 rounded-lg"
          >
            <span className="text-sm font-medium text-gray-600">
              {isExpanded ? 'Hide' : 'Show'} detailed payment information
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
          
          {isExpanded && (
            <div className="mt-4 space-y-4">
              {/* Token information */}
              <div className="bg-white border border-gray-100 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Circle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">Token Information</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Token Amount</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-lg font-semibold text-gray-900">
                        {paymentInfo.tokenAmount ? formatNumber(paymentInfo.tokenAmount) : 'Not available'}
                      </p>
                      <span className="text-sm text-gray-500">{tokenInfo.symbol}</span>
                    </div>
                    <p className="text-xs text-gray-500">{tokenInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Token Value</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {paymentInfo.tokenValue ? `$${paymentInfo.tokenValue}` : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Fee payer user operation */}
              {feePayerUserOp && (
                <div className="bg-white border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wallet className="h-4 w-4 text-[var(--biconomy-orange)]" />
                    <span className="text-sm font-medium text-gray-600">Fee Payer Operation</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Sender</p>
                      <p className="text-sm font-mono text-gray-900">{formatAddress(feePayerUserOp.sender)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Smart Account</p>
                      <p className="text-sm font-mono text-gray-900">{formatAddress(feePayerUserOp.smartAccount)}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Additional payment details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DataField
                  icon={Wallet}
                  label="Sender"
                  value={paymentInfo.sender}
                />
                
                <DataField
                  icon={Hash}
                  label="Nonce"
                  value={paymentInfo.nonce}
                />
                
                <DataField
                  icon={CreditCard}
                  label="Call Gas Limit"  
                  value={paymentInfo.callGasLimit}
                />
                
                <div className="bg-white border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Key className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">Chain</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          chainInfo?.healthCheck?.status === 'healthy' ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <code className="text-sm font-mono text-gray-900">
                          {chainInfo?.name || `Chain ${paymentInfo.chainId}`}
                        </code>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">ID: {paymentInfo.chainId}</p>
                    </div>
                    {paymentInfo.chainId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(paymentInfo.chainId, "Chain ID")}
                        className="text-gray-400 hover:text-[var(--biconomy-orange)] shrink-0 ml-2"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
