import { createPublicClient, http, erc20Abi, type Address, type PublicClient } from 'viem';
import { mainnet, base, polygon, arbitrum, optimism, bsc } from 'viem/chains';

// Chain configuration mapping
const chainConfigs = {
  '1': { chain: mainnet, rpcUrl: 'https://ethereum.publicnode.com' },
  '8453': { chain: base, rpcUrl: 'https://base.publicnode.com' },
  '137': { chain: polygon, rpcUrl: 'https://polygon.publicnode.com' },
  '42161': { chain: arbitrum, rpcUrl: 'https://arbitrum.publicnode.com' },
  '10': { chain: optimism, rpcUrl: 'https://optimism.publicnode.com' },
  '56': { chain: bsc, rpcUrl: 'https://bsc.publicnode.com' },
};

// Cache for public clients
const clientCache = new Map<string, PublicClient>();

// Get or create a public client for a specific chain
function getPublicClient(chainId: string): PublicClient | null {
  const config = chainConfigs[chainId as keyof typeof chainConfigs];
  if (!config) return null;

  if (clientCache.has(chainId)) {
    return clientCache.get(chainId)!;
  }

  try {
    const client = createPublicClient({
      chain: config.chain,
      transport: http(config.rpcUrl),
    });
    
    clientCache.set(chainId, client);
    return client;
  } catch (error) {
    console.warn(`Failed to create viem client for chain ${chainId}:`, error);
    return null;
  }
}

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
}

// Fetch token information using viem
export async function fetchTokenInfoViem(tokenAddress: string, chainId: string): Promise<TokenInfo | null> {
  try {
    const client = getPublicClient(chainId);
    if (!client) {
      console.warn(`No viem client available for chain ${chainId}`);
      return null;
    }

    // Handle native token (0x0 address)
    if (tokenAddress === '0x0000000000000000000000000000000000000000' || !tokenAddress) {
      const nativeTokenInfo = getNativeTokenInfo(chainId);
      return nativeTokenInfo ? { ...nativeTokenInfo, address: tokenAddress } : null;
    }

    // Fetch token data sequentially to avoid type issues
    const name = await client.readContract({
      address: tokenAddress as Address,
      abi: erc20Abi,
      functionName: 'name',
    });
    
    const symbol = await client.readContract({
      address: tokenAddress as Address,
      abi: erc20Abi,
      functionName: 'symbol',
    });
    
    const decimals = await client.readContract({
      address: tokenAddress as Address,
      abi: erc20Abi,
      functionName: 'decimals',
    });

    return {
      name: name as string,
      symbol: symbol as string,
      decimals: decimals as number,
      address: tokenAddress,
    };
  } catch (error) {
    console.warn(`Failed to fetch token info via viem for ${tokenAddress} on chain ${chainId}:`, error);
    return null;
  }
}

// Get native token information for supported chains
function getNativeTokenInfo(chainId: string): Omit<TokenInfo, 'address'> | null {
  const nativeTokens: Record<string, Omit<TokenInfo, 'address'>> = {
    '1': { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    '8453': { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    '137': { name: 'Polygon', symbol: 'MATIC', decimals: 18 },
    '42161': { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    '10': { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    '56': { name: 'Binance Coin', symbol: 'BNB', decimals: 18 },
  };

  return nativeTokens[chainId] || null;
}

// Check if viem support is available for a chain
export function hasViemSupport(chainId: string): boolean {
  return chainId in chainConfigs;
}