import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCoinMarketChart, getCoinDetail } from "../services/api";
import type { MarketChart } from "../types/crypto";
import PriceChart from "../components/PriceChart";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { formatCurrency, formatNumber } from "../utils/formatters";

export default function CoinDetail() {
  const { id = "" } = useParams();
  const [chart, setChart] = useState<MarketChart | null>(null);
  const [coin, setCoin] = useState<any>(null);
  const [days, setDays] = useState<7 | 30 | 90 | 365>(30);
  const [watchlist, setWatchlist] = useLocalStorage<string[]>("watchlist", []);

  // 💡 New states for Price Alert
  const [targetPrice, setTargetPrice] = useState<number | "">("");
  const [alertTriggered, setAlertTriggered] = useState(false);

  // Fetch chart and coin details
  useEffect(() => {
    (async () => {
      const data = await getCoinMarketChart(id, "usd", days);
      setChart(data);

      const coinData = await getCoinDetail(id);
      setCoin(coinData);
    })();
  }, [id, days]);

  const watched = watchlist.includes(id);

  // 💡 Check for price alert trigger whenever coin price or target changes
  useEffect(() => {
    if (coin && targetPrice && !alertTriggered) {
        if (targetPrice <= 0) return;
      const currentPrice = coin.market_data.current_price.usd;
      if (currentPrice >= targetPrice) {
        alert(`🚀 Alert! ${coin.name} has reached your target price of ${formatCurrency(targetPrice)}.`);
        setAlertTriggered(true);
      }
    }
  }, [coin, targetPrice, alertTriggered]);

  return (
    <div className="container" style={{ display: "grid", gap: 12 }}>
      {/* Header */}
      <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link to="/" className="button">← Back</Link>
          {coin && <img src={coin.image.small} alt={coin.name} width={28} height={28} />}
          <strong style={{ fontSize: 18, textTransform: "capitalize" }}>{coin ? coin.name : id}</strong>
          {coin && <span style={{ color: "var(--muted)" }}>({coin.symbol.toUpperCase()})</span>}
        </div>
        <button
          className="button"
          onClick={() =>
            setWatchlist((prev) => (watched ? prev.filter((x) => x !== id) : prev.concat(id)))
          }
        >
          {watched ? "★ In Watchlist" : "☆ Add to Watchlist"}
        </button>
      </div>

      {/* Market Stats */}
      {coin && (
        <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <h3>Market Overview</h3>
            <p style={{ fontSize: 24 }}>{formatCurrency(coin.market_data.current_price.usd)}</p>
            <p>24h High: {formatCurrency(coin.market_data.high_24h.usd)}</p>
            <p>24h Low: {formatCurrency(coin.market_data.low_24h.usd)}</p>
            <p>Market Cap: {formatNumber(coin.market_data.market_cap.usd)}</p>
            <p>Total Volume: {formatNumber(coin.market_data.total_volume.usd)}</p>
          </div>
          <div>
            <h3>Supply & Rank</h3>
            <p>Circulating: {formatNumber(coin.market_data.circulating_supply)}</p>
            <p>Total Supply: {formatNumber(coin.market_data.total_supply)}</p>
            <p>Max Supply: {coin.market_data.max_supply ? formatNumber(coin.market_data.max_supply) : "N/A"}</p>
            <p>Market Rank: #{coin.market_cap_rank}</p>
          </div>
        </div>
      )}

      {/* 📢 Price Alert Section */}
      <div className="card" style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <label htmlFor="price-alert">Set Price Alert:</label>
        <input
          id="price-alert"
          type="number"
          value={targetPrice}
          onChange={(e) => {
            setTargetPrice(e.target.value ? parseFloat(e.target.value) : "");
            setAlertTriggered(false);
          }}
          placeholder="Enter target price (e.g., 120000)"
          className="input"
          style={{ padding: "6px", width: "200px" }}
        />
        {targetPrice && (
          <span style={{ color: "var(--muted)" }}>
            Alert when price ≥ {formatCurrency(Number(targetPrice))}
          </span>
        )}
      </div>

      {/* Chart Range Buttons */}
      <div className="card" style={{ display: "flex", gap: 8 }}>
        <span>Range:</span>
        <button className="button" onClick={() => setDays(7)}>7d</button>
        <button className="button" onClick={() => setDays(30)}>30d</button>
        <button className="button" onClick={() => setDays(90)}>90d</button>
        <button className="button" onClick={() => setDays(365)}>1y</button>
      </div>

      {/* Price Chart */}
      {chart ? <PriceChart points={chart.prices} /> : <div className="card">Loading chart…</div>}
    </div>
  );
}
