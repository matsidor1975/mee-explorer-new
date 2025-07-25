import { HashDetails } from "../shared/schema";

const API_KEY = process.env.VITE_BICONOMY_API_KEY || process.env.BICONOMY_API_KEY || 'mee_3ZRMgikCcc3UdwfZkoofBPqs';
const NODE_URL = 'https://network.biconomy.io';

export const getHashDetails = async (hash: string): Promise<HashDetails> => {
  const lowercaseHash = hash.toLowerCase();
  
  const response = await fetch(`${NODE_URL}/v1/explorer/${lowercaseHash}`, {
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

export const generateMetaTags = (hashDetails: HashDetails, hash: string): string => {
  const chains = hashDetails.userOps
    .map((op: any) => op.chainId)
    .filter((chainId: string, index: number, arr: string[]) => arr.indexOf(chainId) === index);
  
  const chainNames = chains.map((chainId: string) => getChainName(chainId)).join(', ');
  const operationCount = hashDetails.userOps.length;
  
  const title = `Supertransaction ${hash.slice(0, 10)}...${hash.slice(-8)} | Biconomy Explorer`;
  const description = `View details for this Biconomy supertransaction executing ${operationCount} operation${operationCount > 1 ? 's' : ''} across ${chains.length} chain${chains.length > 1 ? 's' : ''}: ${chainNames}`;
  
  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="/assets/biconomy-explorer.webp" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${title}" />
    <meta property="twitter:description" content="${description}" />
    <meta property="twitter:image" content="/assets/biconomy-explorer.webp" />
    
    <!-- Additional meta tags -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <meta charset="UTF-8" />
  `;
};

const getChainName = (chainId: string): string => {
  const chainMap: Record<string, string> = {
    '1': 'Ethereum',
    '56': 'BNB Smart Chain',
    '137': 'Polygon',
    '8453': 'Base',
    '42161': 'Arbitrum One',
    '10': 'Optimism',
    '43114': 'Avalanche',
    '100': 'Gnosis',
    '534352': 'Scroll',
    '64165': 'Sonic',
    '33139': 'Apechain',
    '11155111': 'Sepolia',
    '84532': 'Base Sepolia',
    '421614': 'Arbitrum Sepolia',
    '11155420': 'Optimism Sepolia'
  };
  
  return chainMap[chainId] || `Chain ${chainId}`;
};

export const generateDynamicHTML = (metaTags: string): string => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    ${metaTags}
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
    <script type="text/javascript" src="https://replit.com/public/js/replit-dev-banner.js"></script>
  </body>
</html>`;
};