import { DailyCartCheckoutData } from "@/Dashboard/interfaces";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface EcommerceMetricsProps {
  rawData: DailyCartCheckoutData[]; // Use camelCase for consistency
}

const formatData = (data: any) => {
  return Object.entries(data).map(([name, value]) => ({ name, value }));
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-2 rounded-md shadow-md">
        <p className="font-bold">{payload[0].payload.name}</p>
        <p>{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

// Updated color palette to shades of blue
const colorPalette = [
  "#4f83cc", // Light Blue
  "#337ab7", // Medium Blue
  "#1e6a8c", // Darker Blue
  "#0d4d68"  // Even Darker Blue
];

export default function EcommerceMetrics({ rawData }: EcommerceMetricsProps) {
  const aggregateData = () => {
    return rawData.reduce((acc, curr) => {
      acc.addToCarts += parseInt(curr.addToCarts, 10);
      acc.checkouts += parseInt(curr.checkouts, 10);
      acc.sessions += parseInt(curr.sessions, 10);
      acc.purchases += parseInt(curr.purchases, 10);
      return acc;
    }, { addToCarts: 0, checkouts: 0, sessions: 0, purchases: 0 });
  };

  const aggregatedData = formatData(aggregateData());

  return (
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={aggregatedData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#0d4d68" 
            fillOpacity={0.4} 
            fill="#0d4d68" 
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
              {colorPalette.map((color, index) => (
                <stop
                  key={index}
                  offset={`${(index / (colorPalette.length - 1)) * 100}%`}
                  stopColor={color}
                />
              ))}
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
  );
}

