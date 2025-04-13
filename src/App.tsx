// App.tsx
import { useState } from 'react';
import TokenAlert from './components/TokenAlert';
import TokenAnalysis from './pages/TokenAnalysis';

export default function App() {
  const [input, setInput] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');

  const handleAnalyze = () => {
    if (input.trim()) setTokenAddress(input.trim());
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-blue-600">SolRadar 🔍</h1>

      <div className="max-w-xl mx-auto flex gap-2">
        <input
          type="text"
          placeholder="Paste Solana Token Address..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded-md"
        />
        <button
          onClick={handleAnalyze}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Analyze
        </button>
      </div>

      {tokenAddress && <TokenAnalysis tokenAddress={tokenAddress} />}

      <TokenAlert />
    </div>
  );
}
