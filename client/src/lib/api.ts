import { HashDetails } from "@/types";

const API_KEY = import.meta.env.VITE_BICONOMY_API_KEY || 'mee_3ZRMgikCcc3UdwfZkoofBPqs';
const NODE_URL = 'https://network.biconomy.io';

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

export const isValidHash = (hash: string): boolean => {
  // Basic validation for blockchain hash format
  const hashRegex = /^0x[a-fA-F0-9]{64}$/;
  return hashRegex.test(hash);
};
