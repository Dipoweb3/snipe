
import { TokenData } from '@/components/TokenCard';

// API Endpoints
const SOLSCAN_API_BASE_URL = 'https://api.solscan.io/v2';
const PUMP_FUN_API_URL = 'https://pump.fun/api';
const PUMP_SWAP_API_URL = 'https://pumpswap.xyz/api';
const DEX_SCREENER_API_URL = 'https://api.dexscreener.com/latest/dex';

// Common headers for API requests
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

// Helper function for reliable fetching with fallback
async function fetchWithFallback(url: string, options: RequestInit, fallbackData: any) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.warn(`API request failed: ${url}`, response.status);
      return fallbackData;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    return fallbackData;
  }
}

// Search for a token by address or symbol
export const searchToken = async (query: string): Promise<TokenData | null> => {
  try {
    console.log('Searching for token:', query);
    
    // Clean up the query (remove spaces, etc.)
    const cleanQuery = query.trim();
    
    // Check if query looks like a Solana address (base58 encoded, typically 32-44 chars)
    const isSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(cleanQuery);
    
    // Try to fetch from Solscan if query looks like an address
    if (isSolanaAddress) {
      console.log('Query appears to be a Solana address, fetching from Solscan');
      const tokenDetails = await fetchTokenDetails(cleanQuery);
      if (tokenDetails) {
        console.log('Token found on Solscan:', tokenDetails);
        return tokenDetails;
      }
    }
    
    // Try to fetch from DexScreener if query looks like an address
    if (isSolanaAddress) {
      console.log('Fetching from DexScreener');
      try {
        const dexScreenerResponse = await fetchWithFallback(
          `${DEX_SCREENER_API_URL}/tokens/${cleanQuery}`,
          { headers },
          { pairs: [] }
        );
        
        if (dexScreenerResponse.pairs && dexScreenerResponse.pairs.length > 0) {
          const pair = dexScreenerResponse.pairs[0];
          console.log('Token found on DexScreener:', pair);
          
          // Create token data from DexScreener response
          return {
            symbol: pair.baseToken.symbol,
            name: pair.baseToken.name,
            price: parseFloat(pair.priceUsd) || 0,
            change24h: parseFloat(pair.priceChange.h24) || 0,
            volume: parseFloat(pair.volume.h24) || 0,
            marketCap: parseFloat(pair.fdv) || 0,
            address: pair.baseToken.address,
            earlyEntry: (parseFloat(pair.volume.h24) > 10000 && parseFloat(pair.volume.h24) < 500000),
            highPnl: parseFloat(pair.priceChange.h24) > 10,
            isNew: false // DexScreener doesn't provide creation date info
          };
        }
      } catch (error) {
        console.error('Error fetching from DexScreener:', error);
      }
    }
    
    // Try to fetch from Pump.fun
    console.log('Fetching from Pump.fun');
    const pumpFunData = await fetchWithFallback(
      `${PUMP_FUN_API_URL}/search?q=${encodeURIComponent(cleanQuery)}`,
      { headers },
      { tokens: [] }
    );
    
    // Try to fetch from PumpSwap
    console.log('Fetching from PumpSwap');
    const pumpSwapData = await fetchWithFallback(
      `${PUMP_SWAP_API_URL}/tokens/search?query=${encodeURIComponent(cleanQuery)}`,
      { headers },
      { results: [] }
    );
    
    // If we found a token on Pump.fun, return it
    if (pumpFunData.tokens && pumpFunData.tokens.length > 0) {
      const token = pumpFunData.tokens[0];
      console.log('Token found on Pump.fun:', token);
      return {
        symbol: token.symbol,
        name: token.name,
        price: token.price || 0,
        change24h: token.priceChange24h || 0,
        volume: token.volume || 0,
        marketCap: token.marketCap || 0,
        address: token.address,
        earlyEntry: (token.age < 7 && token.volume > 100000), // Less than 7 days old with some volume
        highPnl: token.priceChange24h > 20,
        isNew: token.age < 3 // Less than 3 days old
      };
    }
    
    // If we found a token on PumpSwap, return it
    if (pumpSwapData.results && pumpSwapData.results.length > 0) {
      const token = pumpSwapData.results[0];
      console.log('Token found on PumpSwap:', token);
      return {
        symbol: token.symbol,
        name: token.name,
        price: token.price || 0,
        change24h: token.priceChange24h || 0,
        volume: token.volume || 0,
        marketCap: token.fdv || 0,
        address: token.address,
        earlyEntry: (token.createdAt && new Date(token.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
        highPnl: token.priceChange24h > 20,
        isNew: (token.createdAt && new Date(token.createdAt) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
      };
    }
    
    // No token found
    console.log('No token found in any API');
    return null;
  } catch (error) {
    console.error('Error searching for token:', error);
    return null;
  }
};

// Fetch token details by address
export const fetchTokenDetails = async (address: string): Promise<TokenData | null> => {
  try {
    // Try to fetch from Solscan
    const tokenDataResponse = await fetchWithFallback(
      `${SOLSCAN_API_BASE_URL}/token/meta?token=${address}`,
      { headers },
      null
    );
    
    if (!tokenDataResponse) return null;
    
    // Fetch market data
    const marketDataResponse = await fetchWithFallback(
      `${SOLSCAN_API_BASE_URL}/market/token?token=${address}`,
      { headers },
      { priceUsd: 0, priceChange24h: 0, volume24h: 0, marketCap: 0 }
    );
    
    // Try to get additional data from Pump.fun
    const pumpFunData = await fetchWithFallback(
      `${PUMP_FUN_API_URL}/token/${address}`,
      { headers },
      null
    );
    
    // Combine the data
    return {
      symbol: tokenDataResponse.symbol || "UNKNOWN",
      name: tokenDataResponse.name || tokenDataResponse.symbol || "Unknown Token",
      price: marketDataResponse.priceUsd || 0,
      change24h: marketDataResponse.priceChange24h || 0,
      volume: marketDataResponse.volume24h || 0,
      marketCap: marketDataResponse.marketCap || 0,
      address: address,
      earlyEntry: marketDataResponse.priceChange24h > 50 && marketDataResponse.volume24h < 10000000,
      highPnl: marketDataResponse.priceChange24h > 20,
      isNew: pumpFunData ? pumpFunData.isNew || false : false
    };
  } catch (error) {
    console.error('Error fetching token details:', error);
    return null;
  }
};
