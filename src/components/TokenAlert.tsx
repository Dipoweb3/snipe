
import React from 'react';
import { Bell, ArrowUpRight, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface TokenAlertData {
  id: string;
  symbol: string;
  name: string;
  reason: string;
  timestamp: Date;
  address: string; // Added token address
  volume?: number;
  volumeChange?: number;
  isRead?: boolean;
}

interface TokenAlertProps {
  alert: TokenAlertData;
  onView: (id: string, address: string) => void; // Updated to include address
  onMarkAsRead: (id: string) => void;
}

const TokenAlert: React.FC<TokenAlertProps> = ({ alert, onView, onMarkAsRead }) => {
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <Card 
      className={`bg-card border-l-4 ${alert?.isRead ? 'border-l-muted' : 'border-l-solana-purple'} mb-2 hover:bg-muted/10 transition-colors ${!alert.isRead ? 'animate-pulse-glow' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${alert/.isRead ? 'bg-muted' : 'bg-solana-purple/20'}`}>
            <Bell className={`h-5 w-5 ${alert.isRead ? 'text-muted-foreground' : 'text-solana-purple'}`} />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{alert.symbol}</h3>
                  <Badge className="bg-solana-teal/90 text-black">New Token</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.name}</p>
              </div>
              <span className="text-xs text-muted-foreground">{timeAgo(alert.timestamp)}</span>
            </div>
            
            <p className="text-sm mt-1">{alert.reason}</p>
            
            {alert.volume && (
              <div className="flex items-center mt-2 text-sm">
                <span className="text-muted-foreground">Volume: </span>
                <span className="ml-1 font-medium">${alert.volume.toLocaleString()}</span>
                {alert.volumeChange && (
                  <span className="flex items-center ml-2 text-green-500">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    {alert.volumeChange}%
                  </span>
                )}
              </div>
            )}
            
            <div className="flex justify-end mt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 text-muted-foreground hover:text-primary"
                onClick={() => onMarkAsRead(alert.id)}
              >
                {alert.isRead ? 'Mark as unread' : 'Mark as read'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7 ml-2 border-solana-purple/20 text-solana-purple"
                onClick={() => onView(alert.id, alert.address)} // Pass the address
              >
                View <ChevronRight className="h-3 w-3 ml-0.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenAlert;
