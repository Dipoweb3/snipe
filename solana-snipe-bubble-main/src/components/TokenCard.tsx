
import React from 'react';
import { ArrowUp, ArrowDown, ExternalLink, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface TokenData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  marketCap: number;
  highPnl?: boolean;
  earlyEntry?: boolean;
  address: string;
  isNew?: boolean;
}

interface TokenCardProps {
  token: TokenData;
  onView: (address: string) => void;
}

const formatNumber = (num: number, isCurrency = false): string => {
  if (num >= 1000000) {
    return `${isCurrency ? '$' : ''}${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `${isCurrency ? '$' : ''}${(num / 1000).toFixed(2)}K`;
  }
  return `${isCurrency ? '$' : ''}${num.toFixed(2)}`;
};

const TokenCard: React.FC<TokenCardProps> = ({ token, onView }) => {
  const isPositive = token.change24h >= 0;
  
  return (
    <Card 
      className={`bg-card border-solana-purple/20 hover:border-solana-purple/60 transition-all animate-slide-up ${token.isNew ? 'glow-purple' : ''}`}
    >
      <CardContent className="pt-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">{token.symbol}</h3>
              {token.isNew && (
                <Badge className="bg-solana-purple text-white animate-pulse-glow">NEW</Badge>
              )}
              {token.highPnl && (
                <Badge className="bg-green-600 text-white">High PNL</Badge>
              )}
              {token.earlyEntry && (
                <Badge className="bg-solana text-black">Early Entry</Badge>
              )}
            </div>
            <p className="text-sm text-gray-400">{token.name}</p>
          </div>
          <div className="text-right">
            <div className="font-semibold text-lg">${token.price.toFixed(6)}</div>
            <div className={`flex items-center justify-end text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {Math.abs(token.change24h).toFixed(2)}%
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
          <div className="p-2 rounded bg-muted">
            <span className="text-muted-foreground block">Volume 24h</span>
            <span className="font-medium">{formatNumber(token.volume, true)}</span>
          </div>
          <div className="p-2 rounded bg-muted">
            <span className="text-muted-foreground block">Market Cap</span>
            <span className="font-medium">{formatNumber(token.marketCap, true)}</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground truncate">
          {token.address.slice(0, 12)}...{token.address.slice(-4)}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 gap-2">
        <Button variant="outline" size="sm" className="flex-1 border-solana-purple/20" onClick={() => onView(token.address)}>
          View Analysis
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 border border-solana-purple/20">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View on Explorer</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default TokenCard;
