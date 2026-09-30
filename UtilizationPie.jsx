import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#e0703a", "#cfd8e3"];
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function UtilizationPie({ data }) {
  if (data.every((x) => x.value === 0)) return <p className="muted">Enter a credit limit to see usage.</p>;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
        </Pie>
        <Tooltip formatter={inr} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
