import axios from "axios";
import type { MarketChart, MarketCoin } from "../types/crypto";

const api = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  timeout: 12000,
});

// Get top coins (market list)
export async function getTopCoins(vs = "usd", perPage = 50, page = 1): Promise<MarketCoin[]> {
  const { data } = await api.get<MarketCoin[]>("/coins/markets", {
    params: {
      vs_currency: vs,
      order: "market_cap_desc",
      per_page: perPage,
      page,
      price_change_percentage: "24h",
      sparkline: false,
    },
  });
  return data;
}

// Get single coin market chart (for the chart)
export async function getCoinMarketChart(
  coinId: string,
  vs = "usd",
  days: number | "max" = 30
) {
  const { data } = await api.get<MarketChart>(`/coins/${coinId}/market_chart`, {
    params: { vs_currency: vs, days },
  });
  return data;
}

// Get single coin detail info
export async function getCoinDetail(coinId: string) {
  const { data } = await api.get(`/coins/${coinId}`, {
    params: {
      localization: false,
      tickers: false,
      community_data: false,
      developer_data: false,
      sparkline: false,
    },
  });
  return data;
}
