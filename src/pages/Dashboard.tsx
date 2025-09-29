import { useEffect, useMemo, useState } from "react";
import { getTopCoins } from "../services/api";
import type { MarketCoin } from "../types/crypto";
import SearchBar from "../components/SearchBar";
import CryptoTable from "../components/CryptoTable";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function Dashboard() {
  const [coins, setCoins] = useState<MarketCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"market_cap" | "price" | "change">("market_cap");
  const [watchlist, setWatchlist] = useLocalStorage<string[]>("watchlist", []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getTopCoins("usd", 50, 1);
        if (mounted) setCoins(data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    const id = setInterval(async () => {
      const data = await getTopCoins("usd", 50, 1);
      setCoins(data);
    }, 30000); // refresh every 30s
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = q
      ? coins.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
      : coins.slice();
    if (sortBy === "market_cap") list.sort((a, b) => b.market_cap - a.market_cap);
    if (sortBy === "price") list.sort((a, b) => b.current_price - a.current_price);
    if (sortBy === "change") list.sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0));
    return list;
  }, [coins, query, sortBy]);

  function toggleWatch(id: string) {
    setWatchlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.concat(id)));
  }

  return (
    <div className="container" style={{ display: "grid", gap: 12 }}>
      <div className="card">
        <strong>Dashboard</strong>
        <p style={{ color: "var(--muted)", marginTop: 4 }}>Live market data • Refreshes every 30s</p>
        <div style={{ marginTop: 12 }}>
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </div>

      {loading ? (
        <div className="card">Loading…</div>
      ) : (
        <CryptoTable
          coins={filtered}
          watchlist={watchlist}
          onToggleWatch={toggleWatch}
          sortBy={sortBy}
          onSort={setSortBy}
        />
      )}

      <div className="card">
        <strong>Watchlist</strong>
        <p style={{ marginTop: 6 }}>
          {watchlist.length ? watchlist.join(", ") : "No coins yet. Click ★ to add."}
        </p>
      </div>
    </div>
  );
}
