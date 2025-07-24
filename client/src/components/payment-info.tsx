import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Copy, DollarSign, CreditCard, Wallet, Hash, Key, Circle, ChevronDown, Receipt, Users } from "lucide-react";
import { PaymentInfo, UserOp } from "@/types";
import { formatAddress, formatNumber, getTokenInfo, getNetworkIcon, getTokenIcon } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";
import { useChainInfo } from "@/hooks/use-chain-info";
import { fetchTokenInfo } from "@/lib/api";

interface PaymentInfoProps {
  paymentInfo: PaymentInfo;
  feePayerUserOp?: UserOp; // First user operation that pays the fees
}

export default function PaymentInfoComponent({ paymentInfo, feePayerUserOp }: PaymentInfoProps) {
  const { toast } = useToast();
  const { chains } = useChainInfo();
  const [isExpanded, setIsExpanded] = useState(false);
  const [apiTokenInfo, setApiTokenInfo] = useState<{ name: string; symbol: string; decimals: number } | null>(null);
  
  // Fetch token information from API
  useEffect(() => {
    const loadTokenInfo = async () => {
      const tokenData = await fetchTokenInfo(paymentInfo.token, paymentInfo.chainId);
      setApiTokenInfo(tokenData);
    };
    
    loadTokenInfo();
  }, [paymentInfo.token, paymentInfo.chainId]);
  
  // Get token information (use API data if available, fallback to hardcoded)
  const fallbackTokenInfo = getTokenInfo(paymentInfo.token, paymentInfo.chainId);
  const tokenInfo = apiTokenInfo || fallbackTokenInfo;
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
    <div className="bg-white border border-slate-200 p-4">
      <div className="flex items-start space-x-3">
        <Icon className={`h-4 w-4 ${color.replace('bg-', 'text-')}`} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-lg font-semibold text-slate-900">{value || 'Not available'}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
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
    <div className="bg-white border border-slate-200 rounded">
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <CreditCard className="h-4 w-4 text-emerald-500" />
          <h3 className="text-base font-semibold text-slate-900">Fees</h3>
        </div>
      </div>
      <div className="p-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
          <MetricCard
            icon={Receipt}
            label="Gas Fee"
            value={`$${paymentInfo.gasFee || 'Not available'}`}
            subtitle="Paid to blockchain validators"
            color="text-purple-500"
          />
          
          <MetricCard
            icon={Users}
            label="Orchestration Fee"
            value={`$${paymentInfo.orchestrationFee || 'Not available'}`}
            subtitle="Paid to Biconomy network relayers"
            color="text-orange-500"
          />
          
          <MetricCard
            icon={DollarSign}
            label="Total Fees"
            value={`$${totalFees.toFixed(6)}`}
            subtitle="Gas + Orchestration fees"
            color="text-emerald-500"
          />
          
          <div className="bg-white border border-slate-200 p-4">
            <div className="flex items-start space-x-3">
              <Circle className="h-4 w-4 text-blue-500" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Payment Method</p>
                <div className="flex items-center space-x-2 mb-1">
                  {tokenInfo?.symbol && (
                    getTokenIcon(tokenInfo.symbol) ? (
                      <img 
                        src={getTokenIcon(tokenInfo.symbol)!} 
                        alt={tokenInfo.symbol}
                        className="w-4 h-4"
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">
                          {tokenInfo.symbol.charAt(0)}
                        </span>
                      </div>
                    )
                  )}
                  <span className="text-lg font-semibold text-slate-900">{tokenInfo?.symbol || 'Unknown Token'}</span>
                  <span className="text-slate-500">on</span>
                  {getNetworkIcon(paymentInfo.chainId) && (
                    <img 
                      src={getNetworkIcon(paymentInfo.chainId)!} 
                      alt={chainInfo?.name || 'Unknown Network'}
                      className="w-4 h-4"
                    />
                  )}
                  <span className="text-lg font-semibold text-slate-900">{chainInfo?.name || 'Unknown Network'}</span>
                </div>
                <p className="text-xs text-slate-500">Token: {tokenInfo?.name || 'Loading...'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Expandable payment details */}
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 border border-slate-200 rounded"
          >
            <span className="text-sm font-medium text-gray-600">
              {isExpanded ? 'Hide' : 'Show'} detailed payment information
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
          
          {isExpanded && (
            <div className="mt-4 space-y-4">
              {/* Token information */}
              <div className="bg-white border border-gray-100 rounded p-4">
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
                      <div className="flex items-center space-x-1">
                        {getTokenIcon(tokenInfo.symbol) && (
                          <img 
                            src={getTokenIcon(tokenInfo.symbol)!} 
                            alt={tokenInfo.symbol}
                            className="w-4 h-4"
                          />
                        )}
                        <span className="text-sm text-gray-500">{tokenInfo.symbol}</span>
                      </div>
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
                <div className="bg-white border border-gray-100 rounded p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wallet className="h-4 w-4 text-[var(--biconomy-orange)]" />
                    <span className="text-sm font-medium text-gray-600">Fee Payer Operation</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Sender</p>
                      <p className="text-sm font-mono text-gray-900">{formatAddress(feePayerUserOp.userOp.sender)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">User Op Hash</p>
                      <p className="text-sm font-mono text-gray-900">{formatAddress(feePayerUserOp.userOpHash)}</p>
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
                        {getNetworkIcon(paymentInfo.chainId) && (
                          <img 
                            src={getNetworkIcon(paymentInfo.chainId)!} 
                            alt={chainInfo?.name || `Chain ${paymentInfo.chainId}`}
                            className="w-4 h-4"
                          />
                        )}
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
      </div>
    </div>
  );
}
