import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, BellRing, BarChart3, Search, Wallet, 
  Coins, Users, LineChart, List, Settings, ArrowUpRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import TelegramHeader from '@/components/TelegramHeader';
import TokenCard, { TokenData } from '@/components/TokenCard';
import BubbleMap from '@/components/BubbleMap';
import TokenAlert, { TokenAlertData } from '@/components/TokenAlert';
import TokenAnalysis from './TokenAnalysis';
import { useQuery } from '@tanstack/react-query';
import { fetchPopularTokens, fetchWalletConnections } from '@/services/solanaApi';
import { fetchAlerts } from '@/services/alertsService';
import { searchToken } from '@/services/tokenSearch';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch token data with React Query
  const { data: tokens = [], isLoading: tokensLoading } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchPopularTokens,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch alerts with React Query
  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // Poll every 30 seconds for new alerts
  });

  // Fetch wallet bubble data
  const { data: tokenWalletData = [] } = useQuery({
    queryKey: ['walletBubbles', 'token'],
    queryFn: () => fetchWalletConnections('token'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch minter bubble data
  const { data: minterWalletData = [] } = useQuery({
    queryKey: ['walletBubbles', 'minter'],
    queryFn: () => fetchWalletConnections('minter'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // For search functionality
  const [searchResults, setSearchResults] = useState<TokenData[]>([]);
  const [noResults, setNoResults] = useState(false);

  const [localAlerts, setLocalAlerts] = useState<TokenAlertData[]>([]);

  // Update local alerts when server data changes
  React.useEffect(() => {
    if (alerts.length) {
      setLocalAlerts(alerts);
    }
  }, [alerts]);

  const unreadCount = localAlerts.filter(alert => !alert.isRead).length;

  const handleViewToken = (address: string) => {
    navigate(`/token/${address}`);
  };

  const handleViewAlert = (id: string, address: string) => {
    // Navigate to the token analysis page with the address
    if (address) {
      navigate(`/token/${address}`);
    } else {
      // Find the token associated with this alert if address not provided
      const alert = localAlerts.find(a => a.id === id);
      if (alert) {
        // Find the corresponding token
        const token = tokens.find(t => t.symbol === alert.symbol);
        if (token) {
          navigate(`/token/${token.address}`);
        }
      }
    }
  };

  const handleMarkAsRead = (id: string) => {
    setLocalAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isRead: !alert.isRead } : alert
    ));
    
    toast({
      title: "Alert updated",
      description: "Notification status has been updated",
    });
  };

  // Handle token search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setNoResults(false);
    
    try {
      const result = await searchToken(searchQuery.trim());
      
      if (result) {
        setSearchResults([result]);
        
        toast({
          title: "Token found",
          description: `Found ${result.symbol} (${result.name})`,
        });
      } else {
        setSearchResults([]);
        setNoResults(true);
        
        toast({
          title: "No token found",
          description: `No token matching "${searchQuery}" was found`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setNoResults(true);
      
      toast({
        title: "Search error",
        description: "Failed to search for token. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Filter tokens based on search query for local filtering
  const getFilteredTokens = () => {
    // If we have search results, show those
    if (searchResults.length > 0) {
      return searchResults;
    }
    
    // Otherwise filter the popular tokens
    return tokens.filter(token => 
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const filteredTokens = getFilteredTokens();

  return (
    <div className="min-h-screen max-w-md mx-auto bg-solana-dark text-white overflow-hidden flex flex-col">
      <TelegramHeader 
        title="Solana Snipe Bot" 
        subtitle="Track tokens, wallets, and get alerts"
      />
      
      <div className="flex-1 overflow-auto p-4">
        <form 
          className="mb-4" 
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className="flex gap-2">
            <Input
              placeholder="Search token address or name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Clear search results when input changes
                if (searchResults.length > 0) {
                  setSearchResults([]);
                  setNoResults(false);
                }
              }}
              className="bg-muted border-solana-purple/20"
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            />
            <Button 
              type="submit" 
              size="sm" 
              className="bg-solana-purple hover:bg-solana-purple/80"
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </form>
        
        <Tabs defaultValue="tokens" className="mb-4">
          <TabsList className="bg-muted/50 w-full">
            <TabsTrigger value="tokens" className="flex-1">
              <Coins className="h-4 w-4 mr-2" />
              Tokens
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex-1 relative">
              <BellRing className="h-4 w-4 mr-2" />
              Alerts
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-solana-purple text-white text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex-1">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tokens" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {isSearching ? (
                <div className="text-center py-6 text-muted-foreground">
                  Searching for tokens...
                </div>
              ) : noResults ? (
                <div className="text-center py-6 text-muted-foreground">
                  No tokens found matching "{searchQuery}"
                </div>
              ) : tokensLoading && !searchResults.length ? (
                <div className="text-center py-6 text-muted-foreground">
                  Loading tokens...
                </div>
              ) : filteredTokens.length > 0 ? (
                filteredTokens.map(token => (
                  <TokenCard 
                    key={token.address} 
                    token={token} 
                    onView={handleViewToken} 
                  />
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No tokens found matching "{searchQuery}"
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-4">
            {alertsLoading ? (
              <div className="text-center py-6 text-muted-foreground">
                Loading alerts...
              </div>
            ) : localAlerts.length > 0 ? (
              localAlerts.map(alert => (
                <TokenAlert
                  key={alert.id}
                  alert={alert}
                  onView={handleViewAlert}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No alerts available
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analysis" className="mt-4 space-y-4">
            <BubbleMap
              title="Token Wallet Relationships"
              description="Visualize connections between wallets and tokens"
              data={tokenWalletData}
            />
            
            <Separator className="my-6 bg-solana-purple/20" />
            
            <BubbleMap
              title="Serial Minter Analysis"
              description="Detect connections between creator wallets and other tokens"
              data={minterWalletData}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Bottom Navigation */}
      <div className="bg-card border-t border-solana-purple/20 p-2">
        <div className="grid grid-cols-5 gap-1">
          <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center h-14 rounded-lg">
            <Bot className="h-5 w-5" />
            <span className="text-[10px] mt-1">Bot</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center h-14 rounded-lg">
            <Wallet className="h-5 w-5" />
            <span className="text-[10px] mt-1">Wallets</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center h-14 rounded-lg">
            <LineChart className="h-5 w-5" />
            <span className="text-[10px] mt-1">PNL</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center h-14 rounded-lg">
            <List className="h-5 w-5" />
            <span className="text-[10px] mt-1">Filters</span>
          </Button>
          <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center h-14 rounded-lg">
            <Settings className="h-5 w-5" />
            <span className="text-[10px] mt-1">Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
