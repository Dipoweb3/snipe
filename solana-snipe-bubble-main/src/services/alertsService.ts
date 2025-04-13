
import { TokenAlertData } from '@/components/TokenAlert';

// Real popular Solana tokens
const REAL_SOLANA_TOKENS = [
  {
    symbol: "BONK",
    name: "Bonk",
    address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
  },
  {
    symbol: "WIF",
    name: "Dogwifhat",
    address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fHVF28bdN4qktufAy"
  },
  {
    symbol: "PYTH",
    name: "Pyth Network",
    address: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3"
  },
  {
    symbol: "JTO",
    name: "Jito",
    address: "JitoTokenXavAvCZ5UrNbKyGYMJxrGXp2LBzGP7aJ3BGZ"
  },
  {
    symbol: "JUP",
    name: "Jupiter",
    address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZzFg8MQ"
  }
];

// Fetch alerts using real Solana tokens
export const fetchAlerts = async (): Promise<TokenAlertData[]> => {
  // For the demo, generate some sample alerts based on the current time using real tokens
  const now = new Date();
  
  const alerts = [
    {
      id: `alert-${Math.random().toString(36).substring(7)}`,
      symbol: REAL_SOLANA_TOKENS[1].symbol,
      name: REAL_SOLANA_TOKENS[1].name,
      address: REAL_SOLANA_TOKENS[1].address,
      reason: "New token launch with rapidly increasing volume",
      timestamp: new Date(now.getTime() - 1000 * 60 * 15), // 15 minutes ago
      volume: 12700000,
      volumeChange: 550,
      isRead: false
    },
    {
      id: `alert-${Math.random().toString(36).substring(7)}`,
      symbol: REAL_SOLANA_TOKENS[0].symbol,
      name: REAL_SOLANA_TOKENS[0].name,
      address: REAL_SOLANA_TOKENS[0].address,
      reason: "Volume spike detected with strong buy pressure",
      timestamp: new Date(now.getTime() - 1000 * 60 * 45), // 45 minutes ago
      volume: 8900000,
      volumeChange: 320,
      isRead: false
    },
    {
      id: `alert-${Math.random().toString(36).substring(7)}`,
      symbol: REAL_SOLANA_TOKENS[2].symbol,
      name: REAL_SOLANA_TOKENS[2].name,
      address: REAL_SOLANA_TOKENS[2].address,
      reason: "High PNL detected - Whale accumulation pattern",
      timestamp: new Date(now.getTime() - 1000 * 60 * 120), // 2 hours ago
      volume: 68200000,
      volumeChange: 75,
      isRead: true
    },
    {
      id: `alert-${Math.random().toString(36).substring(7)}`,
      symbol: REAL_SOLANA_TOKENS[3].symbol,
      name: REAL_SOLANA_TOKENS[3].name,
      address: REAL_SOLANA_TOKENS[3].address,
      reason: "Strong volume increase on established token",
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 8), // 8 hours ago
      volume: 154000000,
      volumeChange: 42,
      isRead: true
    }
  ];
  
  return alerts;
};
