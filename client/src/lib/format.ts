export const formatHash = (hash: string, length = 12): string => {
  if (!hash) return '';
  if (hash.length <= length * 2) return hash;
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
};

export const formatAddress = (address: string): string => {
  return formatHash(address, 6);
};

export const formatNumber = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return value.toString();
  
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  } else if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }
  return num.toLocaleString();
};

export const formatGas = (gas: string): string => {
  const gasValue = parseInt(gas);
  if (isNaN(gasValue)) return gas;
  return gasValue.toLocaleString();
};

export const formatTimestamp = (timestamp: number | string): { formatted: string; relative: string } => {
  try {
    const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
    // Handle both seconds and milliseconds timestamps
    const date = new Date(timestampNum > 1e10 ? timestampNum : timestampNum * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    let relative = '';
    if (diffDays > 0) {
      relative = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      relative = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      relative = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      relative = 'Just now';
    }
    
    return {
      formatted: date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }),
      relative
    };
  } catch {
    return { formatted: timestamp.toString(), relative: '' };
  }
};

// Parse packed gas limits from accountGasLimits hex string
export const parseAccountGasLimits = (accountGasLimits: string): {
  verificationGasLimit: string;
  callGasLimit: string;
} => {
  try {
    if (!accountGasLimits || !accountGasLimits.startsWith('0x')) {
      return { verificationGasLimit: '', callGasLimit: '' };
    }
    
    // Remove 0x prefix and ensure even length
    const hex = accountGasLimits.slice(2).padStart(64, '0');
    
    // Split into two 32-byte parts (64 hex chars each)
    const verificationGasLimit = parseInt(hex.slice(0, 32), 16).toString();
    const callGasLimit = parseInt(hex.slice(32, 64), 16).toString();
    
    return { verificationGasLimit, callGasLimit };
  } catch {
    return { verificationGasLimit: '', callGasLimit: '' };
  }
};

// Parse packed gas fees from gasFees hex string  
export const parseGasFees = (gasFees: string): {
  maxPriorityFeePerGas: string;
  maxFeePerGas: string;
} => {
  try {
    if (!gasFees || !gasFees.startsWith('0x')) {
      return { maxPriorityFeePerGas: '', maxFeePerGas: '' };
    }
    
    // Remove 0x prefix and ensure even length
    const hex = gasFees.slice(2).padStart(64, '0');
    
    // Split into two 32-byte parts
    const maxPriorityFeePerGas = parseInt(hex.slice(0, 32), 16).toString();
    const maxFeePerGas = parseInt(hex.slice(32, 64), 16).toString();
    
    return { maxPriorityFeePerGas, maxFeePerGas };
  } catch {
    return { maxPriorityFeePerGas: '', maxFeePerGas: '' };
  }
};

// Cache for chain information
let chainInfoCache: Record<string, string> = {};

export const getChainName = (chainId: string): string => {
  // Return cached value if available
  if (chainInfoCache[chainId]) {
    return chainInfoCache[chainId];
  }
  
  // Fallback mapping for common chains
  const fallbackChains: Record<string, string> = {
    '1': 'Ethereum',
    '137': 'Polygon', 
    '56': 'BSC',
    '42161': 'Arbitrum',
    '10': 'Optimism',
    '8453': 'Base',
  };
  
  return fallbackChains[chainId] || `Chain ${chainId}`;
};

export const setChainsCache = (chains: Record<string, string>) => {
  chainInfoCache = { ...chainInfoCache, ...chains };
};

// Token information utilities
export const getTokenInfo = (tokenAddress: string, chainId: string): { name: string; symbol: string; icon?: string } => {
  // Common token mappings by chain
  const tokenMappings: Record<string, Record<string, { name: string; symbol: string; icon?: string }>> = {
    '1': {
      '0xA0b86a33E6441c8C546C0C06F5C0D618D7cF6066': { name: 'USD Coin', symbol: 'USDC' },
      '0xdAC17F958D2ee523a2206206994597C13D831ec7': { name: 'Tether USD', symbol: 'USDT' },
    },
    '8453': {
      '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913': { name: 'USD Coin', symbol: 'USDC' },
    },
    '137': {
      '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': { name: 'USD Coin', symbol: 'USDC' },
      '0xc2132D05D31c914a87C6611C10748AEb04B58e8F': { name: 'Tether USD', symbol: 'USDT' },
    }
  };
  
  const chainTokens = tokenMappings[chainId];
  if (chainTokens && chainTokens[tokenAddress]) {
    return chainTokens[tokenAddress];
  }
  
  // Fallback to formatted address
  return {
    name: formatAddress(tokenAddress),
    symbol: 'TOKEN'
  };
};

export const getExecutionStatusColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus.includes('success') || normalizedStatus.includes('executed')) {
    return 'bg-green-100 text-green-800';
  } else if (normalizedStatus.includes('pending') || normalizedStatus.includes('processing')) {
    return 'bg-yellow-100 text-yellow-800';
  } else if (normalizedStatus.includes('failed') || normalizedStatus.includes('error')) {
    return 'bg-red-100 text-red-800';
  }
  return 'bg-gray-100 text-gray-800';
};
