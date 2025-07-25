import { HashDetails } from "@/types";

const getApiKey = (): string => {
  return localStorage.getItem('biconomy-api-key') || 
         import.meta.env.VITE_BICONOMY_API_KEY || 
         'mee_3ZRMgikCcc3UdwfZkoofBPqs';
};

const getNodeUrl = (): string => {
  return localStorage.getItem('biconomy-network-url') || 
         import.meta.env.VITE_BICONOMY_NODE_URL || 
         'https://network.biconomy.io';
};

export interface ChainInfo {
  chainId: string;
  name: string;
  healthCheck: {
    status: string;
    lastChecked: number;
    modules: Array<{
      type: string;
      data: any;
    }>;
  };
}

export interface BiconomyInfo {
  version: string;
  node: string;
  supportedChains: ChainInfo[];
}

export const getBiconomyInfo = async (): Promise<BiconomyInfo> => {
  const response = await fetch(`${getNodeUrl()}/info`, {
    headers: { 
      'Content-Type': 'application/json'
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch Biconomy info: ${response.status} ${errorText}`);
  }
  
  return await response.json();
};

export const getHashDetails = async (hash: string): Promise<HashDetails> => {
  // Ensure hash is lowercase before sending to server
  const lowercaseHash = hash.toLowerCase();
  
  const response = await fetch(`${getNodeUrl()}/v1/explorer/${lowercaseHash}`, {
    headers: { 
      'X-API-KEY': getApiKey(),
      'Content-Type': 'application/json'
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch hash details: ${response.status} ${errorText}`);
  }
  
  return await response.json();
};

export const isValidSupertransactionHash = (hash: string): boolean => {
  // Validation specifically for Biconomy Supertransaction hash format
  const hashRegex = /^0x[a-fA-F0-9]{64}$/;
  return hashRegex.test(hash);
};

export const fetchTokenInfo = async (tokenAddress: string, chainId: string): Promise<{ name: string; symbol: string; decimals: number } | null> => {
  try {
    const response = await fetch(`${getNodeUrl()}/info?tokenAddress=${tokenAddress}&chainId=${chainId}`, {
      headers: {
        'X-API-KEY': getApiKey(),
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch token info:', error);
    return null;
  }
};
