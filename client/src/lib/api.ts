import { HashDetails } from "@/types";

const API_KEY = import.meta.env.VITE_BICONOMY_API_KEY || 'mee_3ZRMgikCcc3UdwfZkoofBPqs';
const NODE_URL = 'https://network.biconomy.io';

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
  const response = await fetch(`${NODE_URL}/info`, {
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
  const response = await fetch(`${NODE_URL}/v1/explorer/${hash}`, {
    headers: { 
      'X-API-KEY': API_KEY,
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
    const response = await fetch(`${NODE_URL}/info?tokenAddress=${tokenAddress}&chainId=${chainId}`, {
      headers: {
        'X-API-KEY': API_KEY,
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
