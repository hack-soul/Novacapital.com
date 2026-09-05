import React, { useState, useEffect, useRef } from 'react';
import { fetchMarketData } from '../lib/cryptoApi';
import type { CoinData } from '../lib/types';

export default function CryptoTicker() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMarketData().then(setCoins);
    const interval = setInterval(() => fetchMarketData().then(setCoins), 60000);
    return () => clearInterval(interval);
  }, []);

  if (coins.length === 0) return null;

  const items = [...coins, ...coins];

  return (
    <div className="w-full bg-[#030810] border-b border-border overflow-hidden py-2.5" style={{ marginTop: 64 }}>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          animation: ticker 40s linear infinite;
          width: max-content;
        }
        .ticker-track:hover { animation-play-state: paused; }
      `}</style>
      <div className="overflow-hidden relative">
        <div className="ticker-track" ref={trackRef}>
          {items.map((coin, i) => {
            const pos = coin.price_change_percentage_24h >= 0;
            return (
              <div key={`${coin.id}-${i}`} className="flex items-center gap-2.5 px-6 border-r border-border/50 whitespace-nowrap">
                <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
                <span className="text-xs font-mono font-medium text-foreground">{coin.symbol.toUpperCase()}</span>
                <span className="text-xs font-mono text-foreground/80">
                  {coin.current_price >= 1000
                    ? `$${coin.current_price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
                    : coin.current_price >= 1
                    ? `$${coin.current_price.toFixed(2)}`
                    : `$${coin.current_price.toFixed(4)}`}
                </span>
                <span className={`text-xs font-mono font-medium ${pos ? 'text-emerald-400' : 'text-red-400'}`}>
                  {pos ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
