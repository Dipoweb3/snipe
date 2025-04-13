
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

// Define types for bubbles
interface Bubble {
  id: string;
  label: string;
  value: number;
  group: string;
  relatedTo?: string[];
  isCreator?: boolean;
}

interface BubbleMapProps {
  title: string;
  description?: string;
  data: Bubble[];
  loading?: boolean;
}

const COLORS = {
  creator: '#9945FF',
  whale: '#14F195',
  early: '#00C2FF',
  bot: '#FF6B4A',
  default: '#5A5A5A'
};

const BubbleMap: React.FC<BubbleMapProps> = ({ 
  title, 
  description, 
  data,
  loading = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(100);
  const [animatedData, setAnimatedData] = useState<Bubble[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  // Simulate positioning logic (in a real app, use a proper force-directed graph library)
  useEffect(() => {
    if (loading) {
      setAnimatedData([]);
      return;
    }
    
    const filteredData = activeTab === 'all' 
      ? data 
      : data.filter(item => item.group === activeTab || item.isCreator);
    
    // Only show a message for the first animation
    const delay = animatedData.length === 0 ? 1000 : 0;
    
    setTimeout(() => {
      setAnimatedData(filteredData);
    }, delay);
  }, [data, loading, activeTab]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 20, 40));

  return (
    <Card className="bg-card border-solana-purple/20">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Slider 
              value={[zoom]} 
              min={40} 
              max={200} 
              step={10} 
              className="w-24" 
              onValueChange={(values) => setZoom(values[0])}
            />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActiveTab('all')}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="creator">Creators</TabsTrigger>
            <TabsTrigger value="whale">Whales</TabsTrigger>
            <TabsTrigger value="early">Early Buyers</TabsTrigger>
            <TabsTrigger value="bot">Bot Wallets</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pt-4">
        <div 
          ref={containerRef} 
          className="relative h-[400px] bg-muted/20 rounded-md overflow-hidden"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solana"></div>
            </div>
          ) : (
            <>
              {/* Lines connecting related bubbles (in a real app, these would be calculated properly) */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                {animatedData.map(bubble => 
                  (bubble.relatedTo || []).map(relatedId => {
                    const related = animatedData.find(b => b.id === relatedId);
                    if (!related) return null;
                    
                    // For demo purposes, create lines based on relative positions
                    const x1 = 100 + (parseInt(bubble.id) * 50) % 600;
                    const y1 = 100 + (parseInt(bubble.id) * 70) % 300;
                    const x2 = 100 + (parseInt(related.id) * 50) % 600;
                    const y2 = 100 + (parseInt(related.id) * 70) % 300;
                    
                    return (
                      <line
                        key={`${bubble.id}-${relatedId}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={bubble.isCreator ? COLORS.creator : COLORS[bubble.group as keyof typeof COLORS] || COLORS.default}
                        strokeWidth="1"
                        strokeOpacity="0.3"
                      />
                    );
                  })
                ).flat()}
              </svg>
              
              {/* Bubbles */}
              {animatedData.map(bubble => {
                const size = Math.max(30, Math.min(100, bubble.value * 5));
                const color = bubble.isCreator 
                  ? COLORS.creator 
                  : COLORS[bubble.group as keyof typeof COLORS] || COLORS.default;
                
                // For demo purposes, position bubbles in a grid-like pattern
                const left = 100 + (parseInt(bubble.id) * 50) % 600;
                const top = 100 + (parseInt(bubble.id) * 70) % 300;
                
                return (
                  <div 
                    key={bubble.id}
                    className={`bubble absolute ${bubble.isCreator ? 'glow-purple' : ''}`}
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      backgroundColor: color,
                      left: `${left}px`,
                      top: `${top}px`,
                      zIndex: bubble.isCreator ? 10 : 2,
                      opacity: 0.8,
                      transition: 'all 0.5s ease-out',
                    }}
                    title={`${bubble.label}: ${bubble.value}`}
                  >
                    <span className="text-white truncate px-2">
                      {size > 40 ? bubble.label : ''}
                    </span>
                  </div>
                );
              })}
              
              {animatedData.length === 0 && !loading && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  No data available for this filter
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BubbleMap;
