import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ScoreChart({ data }) {
  if (data.length < 2) return <p className="muted">Save another update later to see your progress line.</p>;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
        <CartesianGrid stroke="#e3e8ef" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis domain={[300, 900]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <ReferenceLine y={750} stroke="#1f9d6b" strokeDasharray="4 4" label={{ value: "Excellent", fontSize: 11, fill: "#1f9d6b", position: "insideTopLeft" }} />
        <Line type="monotone" dataKey="score" stroke="#14314f" strokeWidth={3} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
