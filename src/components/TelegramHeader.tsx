
import React from 'react';
import { Bot, AlertCircle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TelegramHeaderProps {
  onBack?: () => void;
  title: string;
  subtitle?: string;
}

const TelegramHeader: React.FC<TelegramHeaderProps> = ({ onBack, title, subtitle }) => {
  return (
    <div className="flex flex-col w-full bg-solana-blue p-4 rounded-t-xl border-b border-solana-purple/20">
      <div className="flex items-center">
        {onBack && (
          <Button variant="ghost" size="icon" className="h-8 w-8 mr-2 text-white/80 hover:text-white hover:bg-white/10" onClick={onBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex-1 flex items-center">
          <Bot className="w-6 h-6 mr-2 text-solana" />
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10">
          <AlertCircle className="h-5 w-5" />
        </Button>
      </div>
      {subtitle && <p className="text-sm text-white/70 mt-1 ml-8">{subtitle}</p>}
    </div>
  );
};

export default TelegramHeader;
