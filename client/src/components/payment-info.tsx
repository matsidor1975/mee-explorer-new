import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Copy, DollarSign, CreditCard, Wallet, Hash, Key, Circle, ChevronDown, Receipt, Users, ExternalLink, User, Database, Settings } from "lucide-react";
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
    icon: any;
    label: string;
    value: string;
    subtitle: string;
    color: string;
  }) => (
    <div className="gradient-card-subtle rounded-lg p-3 border border-black/5">
      <div className="flex items-center space-x-2 mb-1">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
      <div className="text-lg font-semibold text-slate-900 mb-1">
        {value}
      </div>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );

  const TableDataField = ({ icon: Icon, label, value, showCopy = true }: {
    icon: any;
    label: string;
    value: string;
    showCopy?: boolean;
  }) => (
    <tr className="border-b border-gray-100">
      <td className="py-2 pr-4">
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4 text-gray-500 shrink-0" />
          <span className="text-sm text-gray-600 font-medium">{label}</span>
        </div>
      </td>
      <td className="py-2 pl-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-right">
            <code className="text-sm font-mono text-gray-900">
              {value.length > 50 ? `${value.substring(0, 24)}...${value.substring(value.length - 24)}` : value}
            </code>
          </div>
          {showCopy && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(value, label)}
              className="text-gray-400 hover:text-[var(--biconomy-orange)] h-4 w-4 p-0 shrink-0 ml-2"
            >
              <Copy className="h-3 w-3" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="glass-root-card rounded-lg p-6">
      <div className="pb-2 mb-4 border-b border-gray-100 mx-[-12px] px-3">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-4 w-4 text-emerald-500" />
              <h3 className="root-card-title">Payment Information</h3>
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

        {/* Mobile Layout - Stacked */}
        <div className="md:hidden space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-4 w-4 text-emerald-500" />
              <h3 className="root-card-title">Payment Information</h3>
            </div>
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
          
          {/* Payment Transaction Link - Separate Row on Mobile */}
          {feePayerUserOp?.executionData && (
            <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded">
              <span className="text-xs text-slate-500">Payment Transaction:</span>
              <code className="text-xs font-mono text-slate-700 flex-1 truncate">{formatAddress(feePayerUserOp.executionData)}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(feePayerUserOp.executionData!, "Transaction Hash")}
                className="text-gray-400 hover:text-[var(--biconomy-orange)] h-6 w-6 p-0 shrink-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              {hasExplorerSupport(feePayerUserOp.chainId) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(getExplorerUrl(feePayerUserOp.chainId, feePayerUserOp.executionData!)!, '_blank')}
                  className="text-xs px-2 py-1 h-6 flex items-center hover:bg-biconomy-orange hover:text-white shrink-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <div>
        
        {/* Fee Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="gradient-card-subtle rounded-lg p-3 border" style={{ borderColor: 'rgba(0,0,0,0.03)' }}>
            <div className="flex items-center space-x-2 mb-1">
              <Receipt className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-slate-600">Gas Fee</span>
            </div>
            <div className="text-lg font-semibold text-slate-900 mb-1 metric-value">
              {paymentInfo.gasFee ? `$${paymentInfo.gasFee}` : 'N/A'}
            </div>
            <p className="text-xs text-slate-500">Paid to blockchain validators</p>
          </div>
          
          <div className="gradient-card-subtle rounded-lg p-3 border" style={{ borderColor: 'rgba(0,0,0,0.03)' }}>
            <div className="flex items-center space-x-2 mb-1">
              <Users className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-slate-600">Orchestration Fee</span>
            </div>
            <div className="text-lg font-semibold text-slate-900 mb-1 metric-value">
              {paymentInfo.orchestrationFee ? `$${paymentInfo.orchestrationFee}` : 'N/A'}
            </div>
            <p className="text-xs text-slate-500">Paid to Biconomy network relayers</p>
          </div>
          
          <div className="gradient-card-subtle rounded-lg p-3 border" style={{ borderColor: 'rgba(0,0,0,0.03)' }}>
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-slate-600">Total Fees</span>
            </div>
            <div className="text-lg font-semibold text-emerald-600 mb-1 metric-value">
              ${totalFees.toFixed(6)}
            </div>
            <p className="text-xs text-slate-500">Gas + Orchestration fees</p>
          </div>
          
          <div className="gradient-card-subtle rounded-lg p-3 border" style={{ borderColor: 'rgba(0,0,0,0.03)' }}>
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
              <span className="text-lg font-semibold text-slate-900 metric-value">{tokenInfo?.symbol || 'Unknown'}</span>
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
          <div className="mt-4 space-y-6 border-t border-slate-100 pt-4">
            {/* Payment Details */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Payment Details</span>
              </h5>
              <table className="w-full text-sm">
                <colgroup>
                  <col className="w-48" />
                  <col className="w-auto" />
                </colgroup>
                <tbody>
                  <TableDataField icon={User} label="Sender" value={paymentInfo.sender} />
                  <TableDataField icon={Hash} label="Nonce" value={paymentInfo.nonce} showCopy={false} />
                  <TableDataField icon={Database} label="Chain ID" value={paymentInfo.chainId} showCopy={false} />
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4">
                      <div className="flex items-center space-x-2">
                        <Settings className="h-4 w-4 text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-600 font-medium">Short Encoding</span>
                      </div>
                    </td>
                    <td className="py-2 pl-4">
                      <div className="text-right">
                        <code className="text-sm font-mono text-gray-900">{paymentInfo.shortEncoding ? 'Yes' : 'No'}</code>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-600 font-medium">Sponsored</span>
                      </div>
                    </td>
                    <td className="py-2 pl-4">
                      <div className="text-right">
                        <code className="text-sm font-mono text-gray-900">{paymentInfo.sponsored ? 'Yes' : 'No'}</code>
                      </div>
                    </td>
                  </tr>
                  {paymentInfo.sponsorshipUrl && (
                    <TableDataField icon={ExternalLink} label="Sponsorship URL" value={paymentInfo.sponsorshipUrl} />
                  )}
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4">
                      <div className="flex items-center space-x-2">
                        <Key className="h-4 w-4 text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-600 font-medium">Init Code</span>
                      </div>
                    </td>
                    <td className="py-2 pl-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 text-right">
                          <code className="text-sm font-mono text-gray-900">
                            {paymentInfo.initCode ? (paymentInfo.initCode.length > 50 ? `${paymentInfo.initCode.substring(0, 24)}...${paymentInfo.initCode.substring(paymentInfo.initCode.length - 24)}` : paymentInfo.initCode) : 'N/A'}
                          </code>
                        </div>
                        {paymentInfo.initCode && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(paymentInfo.initCode, "Init Code")}
                            className="text-gray-400 hover:text-[var(--biconomy-orange)] h-4 w-4 p-0 shrink-0 ml-2"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Token Information */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                <Circle className="h-4 w-4" />
                <span>Token Information</span>
              </h5>
              <table className="w-full text-sm">
                <colgroup>
                  <col className="w-48" />
                  <col className="w-auto" />
                </colgroup>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4">
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-600 font-medium">Token Address</span>
                      </div>
                    </td>
                    <td className="py-2 pl-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 text-right">
                          <code className="text-sm font-mono text-gray-900">
                            {paymentInfo.token.length > 50 ? `${paymentInfo.token.substring(0, 24)}...${paymentInfo.token.substring(paymentInfo.token.length - 24)}` : paymentInfo.token}
                          </code>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(paymentInfo.token, "Token Address")}
                            className="text-gray-400 hover:text-[var(--biconomy-orange)] h-4 w-4 p-0 shrink-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          {getTokenExplorerUrl(paymentInfo.chainId, paymentInfo.token) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(getTokenExplorerUrl(paymentInfo.chainId, paymentInfo.token)!, '_blank')}
                              className="text-sm px-1 py-0.5 h-5 flex items-center hover:bg-biconomy-orange hover:text-white"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4">
                      <div className="flex items-center space-x-2">
                        <Circle className="h-4 w-4 text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-600 font-medium">Token Symbol</span>
                      </div>
                    </td>
                    <td className="py-2 pl-4">
                      <div className="flex items-center justify-end space-x-2 text-right">
                        <code className="text-sm font-mono text-gray-900">{tokenInfo?.symbol || 'Unknown'}</code>
                        {getTokenIcon(tokenInfo.symbol) && (
                          <img 
                            src={getTokenIcon(tokenInfo.symbol)!} 
                            alt={tokenInfo.symbol}
                            className="w-4 h-4 shrink-0"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4">
                      <div className="flex items-center space-x-2">
                        <Circle className="h-3 w-3 text-gray-500 shrink-0" />
                        <span className="text-xs text-gray-600 font-medium">Token Amount</span>
                      </div>
                    </td>
                    <td className="py-2 pl-4">
                      <code className="text-xs font-mono text-gray-900">
                        {paymentInfo.tokenAmount ? formatNumber(paymentInfo.tokenAmount) : 'N/A'}
                      </code>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4">
                      <div className="flex items-center space-x-2">
                        <Circle className="h-3 w-3 text-gray-500 shrink-0" />
                        <span className="text-xs text-gray-600 font-medium">Token Wei Amount</span>
                      </div>
                    </td>
                    <td className="py-2 pl-4">
                      <div className="flex items-center justify-between">
                        <code className="text-xs font-mono text-gray-900">
                          {paymentInfo.tokenWeiAmount ? (paymentInfo.tokenWeiAmount.length > 50 ? `${paymentInfo.tokenWeiAmount.substring(0, 24)}...${paymentInfo.tokenWeiAmount.substring(paymentInfo.tokenWeiAmount.length - 24)}` : paymentInfo.tokenWeiAmount) : 'N/A'}
                        </code>
                        {paymentInfo.tokenWeiAmount && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(paymentInfo.tokenWeiAmount, "Token Wei Amount")}
                            className="text-gray-400 hover:text-[var(--biconomy-orange)] h-4 w-4 p-0 shrink-0 ml-2"
                          >
                            <Copy className="h-2.5 w-2.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 pr-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-3 w-3 text-gray-500 shrink-0" />
                        <span className="text-xs text-gray-600 font-medium">Token Value</span>
                      </div>
                    </td>
                    <td className="py-2 pl-4">
                      <code className="text-xs font-mono text-gray-900">
                        {paymentInfo.tokenValue ? `$${paymentInfo.tokenValue}` : 'N/A'}
                      </code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Fee Payer Operation */}
            {feePayerUserOp && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                  <Wallet className="h-4 w-4" />
                  <span>Fee Payer Operation</span>
                </h5>
                <table className="w-full text-xs">
                  <tbody>
                    {feePayerUserOp.executionData && (
                      <tr className="border-b border-gray-100">
                        <td className="py-2 pr-4">
                          <div className="flex items-center space-x-2">
                            <ExternalLink className="h-3 w-3 text-gray-500 shrink-0" />
                            <span className="text-xs text-gray-600 font-medium">Transaction Hash</span>
                          </div>
                        </td>
                        <td className="py-2 pl-4">
                          <div className="flex items-center justify-between">
                            <code className="text-xs font-mono text-gray-900">
                              {feePayerUserOp.executionData.length > 50 ? `${feePayerUserOp.executionData.substring(0, 24)}...${feePayerUserOp.executionData.substring(feePayerUserOp.executionData.length - 24)}` : feePayerUserOp.executionData}
                            </code>
                            <div className="flex items-center space-x-1 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(feePayerUserOp.executionData!, "Transaction Hash")}
                                className="text-gray-400 hover:text-[var(--biconomy-orange)] h-4 w-4 p-0 shrink-0"
                              >
                                <Copy className="h-2.5 w-2.5" />
                              </Button>
                              {hasExplorerSupport(feePayerUserOp.chainId) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(getExplorerUrl(feePayerUserOp.chainId, feePayerUserOp.executionData!)!, '_blank')}
                                  className="text-xs px-1 py-0.5 h-5 flex items-center hover:bg-biconomy-orange hover:text-white"
                                >
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    <TableDataField icon={User} label="Sender" value={feePayerUserOp.userOp.sender} />
                    <TableDataField icon={Hash} label="User Op Hash" value={feePayerUserOp.userOpHash} />
                    <TableDataField icon={Hash} label="Nonce" value={feePayerUserOp.userOp.nonce} showCopy={false} />
                    <TableDataField icon={Database} label="Chain ID" value={feePayerUserOp.chainId} showCopy={false} />
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}