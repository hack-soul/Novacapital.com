import type { CoinData } from './types';

const COIN_IDS = [
  'bitcoin', 'ethereum', 'binancecoin', 'solana', 'ripple',
  'tron', 'litecoin', 'dogecoin', 'tether', 'usd-coin'
];

let cache: { data: CoinData[]; timestamp: number } | null = null;
const CACHE_TTL = 60000;

export async function fetchMarketData(): Promise<CoinData[]> {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  try {
    const ids = COIN_IDS.join(',');
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('API error');
    const data: CoinData[] = await res.json();
    cache = { data, timestamp: Date.now() };
    return data;
  } catch {
    if (cache) return cache.data;
    return getMockMarketData();
  }
}

export function getMockMarketData(): CoinData[] {
  return [
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', current_price: 67842, price_change_percentage_24h: 2.34, market_cap: 1330000000000, total_volume: 28500000000, market_cap_rank: 1 },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', current_price: 3521, price_change_percentage_24h: 1.87, market_cap: 423000000000, total_volume: 14200000000, market_cap_rank: 2 },
    { id: 'binancecoin', symbol: 'bnb', name: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png', current_price: 412, price_change_percentage_24h: -0.54, market_cap: 59800000000, total_volume: 1800000000, market_cap_rank: 3 },
    { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', current_price: 178, price_change_percentage_24h: 4.21, market_cap: 82300000000, total_volume: 3900000000, market_cap_rank: 5 },
    { id: 'ripple', symbol: 'xrp', name: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png', current_price: 0.62, price_change_percentage_24h: -1.23, market_cap: 34200000000, total_volume: 1200000000, market_cap_rank: 6 },
    { id: 'tron', symbol: 'trx', name: 'TRON', image: 'https://assets.coingecko.com/coins/images/1094/large/tron-logo.png', current_price: 0.13, price_change_percentage_24h: 0.88, market_cap: 11400000000, total_volume: 480000000, market_cap_rank: 11 },
    { id: 'litecoin', symbol: 'ltc', name: 'Litecoin', image: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png', current_price: 88, price_change_percentage_24h: 1.45, market_cap: 6500000000, total_volume: 510000000, market_cap_rank: 20 },
    { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', current_price: 0.16, price_change_percentage_24h: 3.12, market_cap: 23100000000, total_volume: 890000000, market_cap_rank: 8 },
    { id: 'tether', symbol: 'usdt', name: 'Tether', image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png', current_price: 1.00, price_change_percentage_24h: 0.01, market_cap: 119000000000, total_volume: 52000000000, market_cap_rank: 3 },
    { id: 'usd-coin', symbol: 'usdc', name: 'USDC', image: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png', current_price: 1.00, price_change_percentage_24h: -0.02, market_cap: 43000000000, total_volume: 7800000000, market_cap_rank: 7 },
  ];
}

export function formatPrice(price: number): string {
  if (price >= 1000) return `$${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  if (price >= 1) return `$${price.toFixed(2)}`;
  return `$${price.toFixed(4)}`;
}

export function formatMarketCap(cap: number): string {
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
  return `$${cap.toLocaleString()}`;
}
