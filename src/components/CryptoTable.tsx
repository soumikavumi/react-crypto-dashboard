import { Link } from "react-router-dom";
import type { MarketCoin } from "../types/crypto";
import { formatCurrency, formatNumber } from "../utils/formatters";
import WatchToggle from "./WatchToggle";

type Props = {
  coins: MarketCoin[];
  watchlist: string[];
  onToggleWatch: (id: string) => void;
  sortBy: "market_cap" | "price" | "change";
  onSort: (key: "market_cap" | "price" | "change") => void;
};

export default function CryptoTable({ coins, watchlist, onToggleWatch, sortBy, onSort }: Props) {
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <strong>Top Coins</strong>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="button" onClick={() => onSort("market_cap")}>
            Sort: Mkt Cap{sortBy === "market_cap" ? " •" : ""}
          </button>
          <button className="button" onClick={() => onSort("price")}>
            Sort: Price{sortBy === "price" ? " •" : ""}
          </button>
          <button className="button" onClick={() => onSort("change")}>
            Sort: 24h%{sortBy === "change" ? " •" : ""}
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>★</th>
            <th>Coin</th>
            <th>Price</th>
            <th>24h</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((c) => {
            const watched = watchlist.includes(c.id);
            const pct = c.price_change_percentage_24h || 0;

            return (
              <tr key={c.id}>
                <td>
                  <WatchToggle watched={watched} onToggle={() => onToggleWatch(c.id)} />
                </td>

                {/* ✅ Fixed: Properly structured single Link inside <td> */}
                <td>
                  <Link
                    to={`/coin/${c.id}`}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <img src={c.image} alt={c.name} width={22} height={22} />
                    <span>{c.name}</span>
                    <span style={{ color: "var(--muted)" }}>
                      {c.symbol.toUpperCase()}
                    </span>
                  </Link>
                </td>

                <td>{formatCurrency(c.current_price)}</td>
                <td>
                  <span className={`badge ${pct >= 0 ? "positive" : "negative"}`}>
                    {pct.toFixed(2)}%
                  </span>
                </td>
                <td>{formatNumber(c.market_cap)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
