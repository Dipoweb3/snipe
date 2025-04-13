
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown, ExternalLink, Clock, Users, Wallet, AlertTriangle, Globe, ShieldCheck, ShieldAlert, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import TelegramHeader from '@/components/TelegramHeader';
import BubbleMap from '@/components/BubbleMap';
import { TokenData } from '@/components/TokenCard';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { 
  generatePriceHistory, 
  fetchPlatformData, 
  fetchWalletConnections, 
  calculateTokenRiskScore,
  PlatformData, 
  TokenRiskScore 
} from '@/services/solanaApi';
import { fetchTokenDetails } from '@/services/tokenSearch';
import { ProgressBar } from '@/components/ui/progress-bar';

interface TokenAnalysisProps {
  onBack?: () => void;
}

const TokenAnalysis: React.FC<TokenAnalysisProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { address } = useParams<{ address: string }>();
  
  // Handle going back to main screen
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };
  
  // Fetch token data
  const { data: token, isLoading: tokenLoading } = useQuery({
    queryKey: ['token', address],
    queryFn: () => fetchTokenDetails(address || ''),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch historical price data
  const { data: priceHistory = [], isLoading: priceLoading } = useQuery({
    queryKey: ['priceHistory', address],
    queryFn: () => generatePriceHistory(address || ''),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch platform data
  const { data: platformData = [], isLoading: platformLoading } = useQuery({
    queryKey: ['platformData', address],
    queryFn: () => fetchPlatformData(address || ''),
    enabled: !!address,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch wallet bubble data for token
  const { data: tokenWalletData = [] } = useQuery({
    queryKey: ['walletBubbles', 'token', address],
    queryFn: () => fetchWalletConnections('token'),
    enabled: !!address,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  // Fetch minter bubble data
  const { data: minterWalletData = [] } = useQuery({
    queryKey: ['walletBubbles', 'minter', address],
    queryFn: () => fetchWalletConnections('minter'),
    enabled: !!address,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
  
  // Fetch risk score data
  const { data: riskScore, isLoading: riskLoading } = useQuery({
    queryKey: ['riskScore', address],
    queryFn: () => calculateTokenRiskScore(address || ''),
    enabled: !!address,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
  
  if (tokenLoading) {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-solana-dark text-white overflow-hidden flex flex-col">
        <TelegramHeader title="Loading Token Analysis..." onBack={handleBack} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solana"></div>
        </div>
      </div>
    );
  }
  
  if (!token) {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-solana-dark text-white overflow-hidden flex flex-col">
        <TelegramHeader title="Token Analysis" onBack={handleBack} />
        <div className="flex-1 flex items-center justify-center">
          <p>Token not found</p>
        </div>
      </div>
    );
  }
  
  const isPositive = token.change24h >= 0;
  
  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-red-500';
    if (score < 70) return 'text-yellow-500';
    return 'text-green-500';
  };
  
  const getScoreColor = (score: number) => {
    if (score > 70) return 'text-green-500';
    if (score > 40) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return (
          <Badge className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1 ml-2">
            <ShieldCheck className="h-3 w-3" />
            Alpha Potential
          </Badge>
        );
      case 'medium':
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-black flex items-center gap-1 ml-2">
            <AlertTriangle className="h-3 w-3" />
            Medium Risk
          </Badge>
        );
      case 'high':
      default:
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1 ml-2">
            <ShieldAlert className="h-3 w-3" />
            High Risk
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-solana-dark text-white overflow-hidden flex flex-col">
      <TelegramHeader 
        title={`${token.symbol} Analysis`} 
        subtitle={token.name}
        onBack={handleBack}
      />
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <Card className="bg-card border-solana-purple/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{token.symbol}</h2>
                  {token.isNew && (
                    <Badge className="bg-solana-purple text-white">NEW</Badge>
                  )}
                  {token.highPnl && (
                    <Badge className="bg-green-600 text-white">High PNL</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{token.name}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${token.price.toFixed(6)}</div>
                <div className={`flex items-center justify-end ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                  {Math.abs(token.change24h).toFixed(2)}%
                </div>
              </div>
            </div>
            
            <div className="h-48 -mx-2">
              {priceLoading ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-muted-foreground">Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={priceHistory}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9945FF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#9945FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#6c7293', fontSize: 10 }} 
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{ fill: '#6c7293', fontSize: 10 }} 
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value.toFixed(6)}`}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d2d3d" />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toFixed(6)}`, 'Price']}
                      contentStyle={{ 
                        backgroundColor: '#1E1E32', 
                        borderColor: '#9945FF',
                        borderRadius: '0.375rem'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#9945FF" 
                      fillOpacity={1}
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3 rounded bg-muted/50">
                <span className="text-muted-foreground text-sm block">Volume 24h</span>
                <span className="font-medium">${token.volume.toLocaleString()}</span>
              </div>
              <div className="p-3 rounded bg-muted/50">
                <span className="text-muted-foreground text-sm block">Market Cap</span>
                <span className="font-medium">${token.marketCap.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Alpha Score Card */}
        <Card className="bg-card border-solana-purple/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Zap className="h-4 w-4 mr-2 text-solana" />
              Alpha Score
              {riskScore && getRiskBadge(riskScore.riskLevel)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {riskLoading ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Calculating risk score...</p>
              </div>
            ) : riskScore ? (
              <>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Overall Score</span>
                    <span className={`text-sm font-medium ${getRiskColor(riskScore.overall)}`}>{riskScore.overall}%</span>
                  </div>
                  <ProgressBar 
                    value={riskScore.overall} 
                    className="h-2" 
                    indicatorClassName={riskScore.overall > 70 ? "bg-green-500" : riskScore.overall > 40 ? "bg-yellow-500" : "bg-red-500"} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Smart Wallets</span>
                      <span className={`text-xs font-medium ${getScoreColor(riskScore.smartWalletScore)}`}>{riskScore.smartWalletScore}%</span>
                    </div>
                    <ProgressBar value={riskScore.smartWalletScore} className="h-1.5" indicatorClassName="bg-solana" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Creator History</span>
                      <span className={`text-xs font-medium ${getScoreColor(riskScore.creatorScore)}`}>{riskScore.creatorScore}%</span>
                    </div>
                    <ProgressBar value={riskScore.creatorScore} className="h-1.5" indicatorClassName="bg-solana" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Liquidity</span>
                      <span className={`text-xs font-medium ${getScoreColor(riskScore.liquidityScore)}`}>{riskScore.liquidityScore}%</span>
                    </div>
                    <ProgressBar value={riskScore.liquidityScore} className="h-1.5" indicatorClassName="bg-solana" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Upside Potential</span>
                      <span className={`text-xs font-medium ${getScoreColor(riskScore.potentialScore)}`}>{riskScore.potentialScore}%</span>
                    </div>
                    <ProgressBar value={riskScore.potentialScore} className="h-1.5" indicatorClassName="bg-solana" />
                  </div>
                </div>
                
                {/* Risk Signals */}
                <div className="space-y-2 mt-2">
                  {riskScore.redFlags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-red-500 mb-1">Risk Factors:</h4>
                      <ul className="space-y-1">
                        {riskScore.redFlags.map((flag, index) => (
                          <li key={index} className="text-xs flex items-start gap-2">
                            <span className="rounded-full h-2 w-2 bg-red-500 mt-1"></span>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {riskScore.bullishSignals.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-green-500 mb-1">Bullish Signals:</h4>
                      <ul className="space-y-1">
                        {riskScore.bullishSignals.map((signal, index) => (
                          <li key={index} className="text-xs flex items-start gap-2">
                            <span className="rounded-full h-2 w-2 bg-green-500 mt-1"></span>
                            <span>{signal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Unable to calculate risk score</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-card border-solana-purple/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Globe className="h-4 w-4 mr-2 text-solana" />
              Platform Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              {platformLoading ? (
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">Loading platform data...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-solana-purple/20">
                      <TableHead>Platform</TableHead>
                      <TableHead>Date Added</TableHead>
                      <TableHead>Volume</TableHead>
                      <TableHead>Trades</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {platformData.map((item, index) => (
                      <TableRow key={index} className="border-b border-solana-purple/20">
                        <TableCell className="font-medium">{item.platform}</TableCell>
                        <TableCell>{item.dateAdded}</TableCell>
                        <TableCell>{item.volume}</TableCell>
                        <TableCell>{item.trades}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="wallets">
          <TabsList className="bg-muted/50 w-full">
            <TabsTrigger value="wallets" className="flex-1">Wallet Analysis</TabsTrigger>
            <TabsTrigger value="serial" className="flex-1">Serial Minter Check</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wallets" className="mt-4">
            <BubbleMap
              title="Token Wallet Analysis"
              description="Connection between creator and holders"
              data={tokenWalletData}
            />
          </TabsContent>
          
          <TabsContent value="serial" className="mt-4">
            <BubbleMap
              title="Serial Minter Detection"
              description="Detect if creator launched multiple tokens"
              data={minterWalletData}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="bg-card border-t border-solana-purple/20 p-4">
        <div className="flex gap-3">
          <Button className="flex-1 bg-solana hover:bg-solana/80 text-black">
            Set Alerts
          </Button>
          <Button className="flex-1 bg-solana-purple hover:bg-solana-purple/80"
            onClick={() => window.open(`https://solscan.io/token/${token.address}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Explorer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TokenAnalysis;
