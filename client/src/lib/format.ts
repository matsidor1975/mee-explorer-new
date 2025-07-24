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

export const formatTimestamp = (timestamp: string): { formatted: string; relative: string } => {
  try {
    const date = new Date(parseInt(timestamp) * 1000);
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
    return { formatted: timestamp, relative: '' };
  }
};

export const getChainName = (chainId: string): string => {
  const chains: Record<string, string> = {
    '1': 'Ethereum',
    '137': 'Polygon',
    '56': 'BSC',
    '42161': 'Arbitrum',
    '10': 'Optimism',
  };
  return chains[chainId] || `Chain ${chainId}`;
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
