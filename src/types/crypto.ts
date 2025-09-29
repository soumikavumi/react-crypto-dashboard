export interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

export interface MarketChart {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}
