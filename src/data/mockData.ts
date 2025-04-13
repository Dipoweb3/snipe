
// Mock data for our Solana token analysis Telegram bot

// Mock token data
export const mockTokens = [
  {
    symbol: "SOL",
    name: "Solana",
    price: 144.87,
    change24h: 2.5,
    volume: 1420000000,
    marketCap: 67500000000,
    address: "So11111111111111111111111111111111111111112",
    earlyEntry: false,
    highPnl: false,
    isNew: false
  },
  {
    symbol: "BONK",
    name: "Bonk",
    price: 0.000027,
    change24h: 12.8,
    volume: 154000000,
    marketCap: 1800000000,
    address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    earlyEntry: false,
    highPnl: true,
    isNew: false
  },
  {
    symbol: "JTO",
    name: "Jito",
    price: 3.27,
    change24h: -1.2,
    volume: 78500000,
    marketCap: 378000000,
    address: "7kbnvuGBxxj8AG9qp8Scn56muWGaRaFqxg1FsRp3PaFT",
    earlyEntry: false,
    highPnl: false,
    isNew: false
  },
  {
    symbol: "PYTH",
    name: "Pyth Network",
    price: 0.48,
    change24h: 5.7,
    volume: 68200000,
    marketCap: 890000000,
    address: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
    earlyEntry: true,
    highPnl: true,
    isNew: false
  },
  {
    symbol: "MOON",
    name: "MoonToken",
    price: 0.00032,
    change24h: 180.5,
    volume: 12700000,
    marketCap: 3200000,
    address: "6LNeTYMqtNm1pBFN8PfhQaoLyegAH8GD32WmHU9erXKX",
    earlyEntry: true,
    highPnl: true,
    isNew: true
  },
  {
    symbol: "NOVA",
    name: "Nova Finance",
    price: 0.0045,
    change24h: 65.8,
    volume: 8900000,
    marketCap: 4500000,
    address: "9CnXhQVn3gYToE3uvCencer1JBVSNsZ2EhXVgMkyoPgw",
    earlyEntry: true,
    highPnl: false,
    isNew: true
  }
];

// Mock wallet bubble data
export const mockWalletBubbles = {
  token: [
    { id: "1", label: "Creator", value: 10, group: "creator", isCreator: true, relatedTo: ["2", "3", "4"] },
    { id: "2", label: "Whale1", value: 8, group: "whale", relatedTo: ["1", "5"] },
    { id: "3", label: "Whale2", value: 7, group: "whale", relatedTo: ["1", "6"] },
    { id: "4", label: "Early1", value: 5, group: "early", relatedTo: ["1"] },
    { id: "5", label: "Early2", value: 4, group: "early", relatedTo: ["2"] },
    { id: "6", label: "Early3", value: 3, group: "early", relatedTo: ["3"] },
    { id: "7", label: "Bot1", value: 2, group: "bot", relatedTo: ["2"] },
    { id: "8", label: "Bot2", value: 2, group: "bot", relatedTo: ["3"] },
    { id: "9", label: "Early4", value: 6, group: "early", relatedTo: ["1"] },
    { id: "10", label: "Whale3", value: 9, group: "whale", relatedTo: ["1", "9"] }
  ],
  minter: [
    { id: "1", label: "Creator", value: 8, group: "creator", isCreator: true, relatedTo: ["2", "3", "4", "5", "6"] },
    { id: "2", label: "TokenA", value: 6, group: "whale", relatedTo: ["1"] },
    { id: "3", label: "TokenB", value: 7, group: "whale", relatedTo: ["1"] },
    { id: "4", label: "TokenC", value: 4, group: "bot", relatedTo: ["1"] },
    { id: "5", label: "TokenD", value: 3, group: "bot", relatedTo: ["1"] },
    { id: "6", label: "TokenE", value: 5, group: "early", relatedTo: ["1"] }
  ]
};

// Mock token alerts
export const mockAlerts = [
  {
    id: "alert1",
    symbol: "MOON",
    name: "MoonToken",
    reason: "New token launch with rapidly increasing volume",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    volume: 12700000,
    volumeChange: 550,
    isRead: false
  },
  {
    id: "alert2",
    symbol: "NOVA",
    name: "Nova Finance",
    reason: "New token detection with potential early entry opportunity",
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    volume: 8900000,
    volumeChange: 320,
    isRead: false
  },
  {
    id: "alert3",
    symbol: "PYTH",
    name: "Pyth Network",
    reason: "High PNL detected - Whale accumulation pattern",
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    volume: 68200000,
    volumeChange: 75,
    isRead: true
  },
  {
    id: "alert4",
    symbol: "BONK",
    name: "Bonk",
    reason: "Strong volume increase on established token",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    volume: 154000000,
    volumeChange: 42,
    isRead: true
  }
];
