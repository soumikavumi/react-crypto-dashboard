import { useMemo } from "react";
import { Line, LineChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";

type Props = {
  points: [number, number][];
};

export default function PriceChart({ points }: Props) {
  const data = useMemo(
    () =>
      points.map(([ts, price]) => ({
        t: new Date(ts).toLocaleDateString(),
        p: Number(price.toFixed(2)),
      })),
    [points]
  );

  return (
    <div className="card" style={{ height: 320 }}>
      <strong>Price (closing)</strong>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <XAxis dataKey="t" hide />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line type="monotone" dataKey="p" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
