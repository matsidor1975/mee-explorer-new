import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Copy, DollarSign, CreditCard, Wallet, Hash, Key, Circle, ChevronDown, Receipt, Users, ExternalLink } from "lucide-react";
import { PaymentInfo, UserOp } from "@/types";
import { formatAddress, formatNumber, getTokenInfo, getNetworkIcon, getTokenIcon, getTokenExplorerUrl, getExplorerName, getExplorerUrl, hasExplorerSupport } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";
import { useChainInfo } from "@/hooks/use-chain-info";
import { fetchTokenInfo } from "@/lib/api";
import { fetchTokenInfoViem, hasViemSupport, type TokenInfo } from "@/lib/viem";

interface PaymentInfoProps {
  paymentInfo: PaymentInfo;
  feePayerUserOp?: UserOp; // First user operation that pays the fees
}

export default function PaymentInfoComponent({ paymentInfo, feePayerUserOp }: PaymentInfoProps) {
  const { toast } = useToast();
  const { chains } = useChainInfo();
  const [isExpanded, setIsExpanded] = useState(false);
  const [apiTokenInfo, setApiTokenInfo] = useState<{ name: string; symbol: string; decimals: number } | null>(null);
  const [viemTokenInfo, setViemTokenInfo] = useState<TokenInfo | null>(null);
  const [isLoadingViem, setIsLoadingViem] = useState(false);
  
  // Fetch token information from API and viem
  useEffect(() => {
    const loadTokenInfo = async () => {
      // Always try API first
      const tokenData = await fetchTokenInfo(paymentInfo.token, paymentInfo.chainId);
      setApiTokenInfo(tokenData);
      
      // If viem is supported for this chain, also fetch via viem
      if (hasViemSupport(paymentInfo.chainId)) {
        setIsLoadingViem(true);
        try {
          const viemData = await fetchTokenInfoViem(paymentInfo.token, paymentInfo.chainId);
          setViemTokenInfo(viemData);
        } catch (error) {
          console.warn('Failed to fetch token info via viem:', error);
        } finally {
          setIsLoadingViem(false);
        }
      }
    };
    
    loadTokenInfo();
  }, [paymentInfo.token, paymentInfo.chainId]);
  
  // Get token information (prioritize viem, then API, then fallback)
  const fallbackTokenInfo = getTokenInfo(paymentInfo.token, paymentInfo.chainId);
  const tokenInfo = viemTokenInfo || apiTokenInfo || fallbackTokenInfo;
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
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-4 w-4 text-emerald-500" />
              <h3 className="text-base font-semibold text-slate-900">Fees</h3>
            </div>
            
            {/* Payment UserOp Transaction Link - Inline with Separator */}
            {feePayerUserOp?.executionData && (
              <>
                <span className="text-slate-300">|</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500">Payment Transaction:</span>
                  <code className="text-xs font-mono text-slate-700">{formatAddress(feePayerUserOp.executionData)}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(feePayerUserOp.executionData!, "Transaction Hash")}
                    className="text-gray-400 hover:text-[var(--biconomy-orange)] h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  {hasExplorerSupport(feePayerUserOp.chainId) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getExplorerUrl(feePayerUserOp.chainId, feePayerUserOp.executionData!)!, '_blank')}
                      className="text-xs px-2 py-1 h-6 flex items-center space-x-1 hover:bg-biconomy-orange hover:text-white"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>{getExplorerName(feePayerUserOp.chainId)}</span>
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-slate-300">|</span>
            {/* Detailed Payment Information Button - Inline in Header */}
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 px-3 py-1 h-7 text-xs hover:bg-slate-50 hover:text-slate-900 border border-slate-200 rounded"
            >
              <span className="text-xs font-medium text-slate-600">
                {isExpanded ? 'Hide' : 'Show'} details
              </span>
              <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
      <div className="px-3 py-3">
        
        {/* Fee Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 p-3 rounded">
            <div className="flex items-center space-x-2 mb-1">
              <Receipt className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-slate-600">Gas Fee</span>
            </div>
            <div className="text-lg font-semibold text-slate-900 mb-1">
              {paymentInfo.gasFee ? `$${paymentInfo.gasFee}` : 'N/A'}
            </div>
            <p className="text-xs text-slate-500">Paid to blockchain validators</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-3 rounded">
            <div className="flex items-center space-x-2 mb-1">
              <Users className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-slate-600">Orchestration Fee</span>
            </div>
            <div className="text-lg font-semibold text-slate-900 mb-1">
              {paymentInfo.orchestrationFee ? `$${paymentInfo.orchestrationFee}` : 'N/A'}
            </div>
            <p className="text-xs text-slate-500">Paid to Biconomy network relayers</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-3 rounded">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-slate-600">Total Fees</span>
            </div>
            <div className="text-lg font-semibold text-emerald-600 mb-1">
              ${totalFees.toFixed(6)}
            </div>
            <p className="text-xs text-slate-500">Gas + Orchestration fees</p>
          </div>
          
          <div className="bg-white border border-slate-200 p-3 rounded">
            <div className="flex items-center space-x-2 mb-1">
              <CreditCard className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-slate-600">Payment Method</span>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              {tokenInfo?.symbol && getTokenIcon(tokenInfo.symbol) && (
                <img 
                  src={getTokenIcon(tokenInfo.symbol)!} 
                  alt={tokenInfo.symbol}
                  className="w-4 h-4"
                />
              )}
              <span className="text-lg font-semibold text-slate-900">{tokenInfo?.symbol || 'Unknown'}</span>
            </div>
            <div className="flex items-center space-x-1">
              {getNetworkIcon(paymentInfo.chainId) && (
                <img 
                  src={getNetworkIcon(paymentInfo.chainId)!} 
                  alt={chainInfo?.name || 'Unknown Network'}
                  className="w-3 h-3"
                />
              )}
              <span className="text-xs text-slate-500">{chainInfo?.name || 'Unknown'}</span>
            </div>
          </div>
        </div>
        
        {/* Expandable payment details */}
        {isExpanded && (
          <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
            <div className="space-y-4">
              {/* Token information */}
              <div className="bg-white border border-gray-100 rounded p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Circle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-600">Token Information</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                
                {/* Token Address with Explorer Link */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">Token Address</p>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm font-mono text-gray-900 truncate">
                          {paymentInfo.token}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(paymentInfo.token, "Token Address")}
                          className="text-gray-400 hover:text-biconomy-orange shrink-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {getTokenExplorerUrl(paymentInfo.chainId, paymentInfo.token) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(getTokenExplorerUrl(paymentInfo.chainId, paymentInfo.token)!, '_blank')}
                        className="ml-3 text-xs flex items-center space-x-1 hover:bg-biconomy-orange hover:text-white shrink-0"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>View on {getExplorerName(paymentInfo.chainId)}</span>
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getTokenExplorerUrl(paymentInfo.chainId, paymentInfo.token) 
                      ? "View token details on blockchain explorer"
                      : "Copy the address above to view in your preferred explorer"
                    }
                  </p>
                </div>
              </div>
              
              {/* Fee payer user operation */}
              {feePayerUserOp && (
                <div className="bg-white border border-gray-100 rounded p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wallet className="h-4 w-4 text-[var(--biconomy-orange)]" />
                    <span className="text-sm font-medium text-gray-600">Fee Payer Operation</span>
                  </div>
                  
                  {/* Transaction Hash with Explorer Link */}
                  {feePayerUserOp.executionData && (
                    <div className="mb-4 bg-white border border-gray-100 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <ExternalLink className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-600">Transaction</span>
                      </div>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <code className="text-sm font-mono text-gray-900 truncate flex-1">
                          {feePayerUserOp.executionData}
                        </code>
                        <div className="flex items-center space-x-2 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(feePayerUserOp.executionData!, "Transaction Hash")}
                            className="text-gray-400 hover:text-[var(--biconomy-orange)] h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          {hasExplorerSupport(feePayerUserOp.chainId) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(getExplorerUrl(feePayerUserOp.chainId, feePayerUserOp.executionData!)!, '_blank')}
                              className="text-xs flex items-center space-x-1 hover:bg-biconomy-orange hover:text-white"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>View on {getExplorerName(feePayerUserOp.chainId)}</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-100 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Wallet className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-600">Sender</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono text-gray-900 truncate flex-1">
                          {feePayerUserOp.userOp.sender}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(feePayerUserOp.userOp.sender, "Sender Address")}
                          className="text-gray-400 hover:text-[var(--biconomy-orange)] shrink-0 ml-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Hash className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-600">User Op Hash</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-mono text-gray-900 truncate flex-1">
                          {feePayerUserOp.userOpHash}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(feePayerUserOp.userOpHash, "User Op Hash")}
                          className="text-gray-400 hover:text-[var(--biconomy-orange)] shrink-0 ml-2"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
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
          </div>
        )}
      </div>
    </div>
  );
}
