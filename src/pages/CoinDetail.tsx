import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCoinMarketChart } from "../services/api";
import type { MarketChart } from "../types/crypto";
import PriceChart from "../components/PriceChart";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function CoinDetail() {
  const { id = "" } = useParams();
  const [chart, setChart] = useState<MarketChart | null>(null);
  const [days, setDays] = useState<7 | 30 | 90 | 365>(30);
  const [watchlist, setWatchlist] = useLocalStorage<string[]>("watchlist", []);

  useEffect(() => {
    (async () => {
      const data = await getCoinMarketChart(id, "usd", days);
      setChart(data);
    })();
  }, [id, days]);

  const watched = watchlist.includes(id);

  return (
    <div className="container" style={{ display: "grid", gap: 12 }}>
      <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link to="/" className="button">← Back</Link>
          <strong style={{ fontSize: 18, textTransform: "capitalize" }}>{id}</strong>
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

      <div className="card" style={{ display: "flex", gap: 8 }}>
        <span>Range:</span>
        <button className="button" onClick={() => setDays(7)}>7d</button>
        <button className="button" onClick={() => setDays(30)}>30d</button>
        <button className="button" onClick={() => setDays(90)}>90d</button>
        <button className="button" onClick={() => setDays(365)}>1y</button>
      </div>

      {chart ? <PriceChart points={chart.prices} /> : <div className="card">Loading chart…</div>}
    </div>
  );
}
