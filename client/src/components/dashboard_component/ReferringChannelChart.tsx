import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface ReferringChannelsChartProps {
  rawData: { Channel: string; Visitors: string }[]; 
}

const COLORS = ['#071952', '#088395', '#37B7C3', '#4A628A', '#98DED9', '#FF33CC'];

export const ReferringChannelChart: React.FC<ReferringChannelsChartProps> = ({ rawData }) => {

  if (rawData.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>No data available. Please set up Google Analytics for this data.</p>
      </div>
    );
  }
  // Aggregate visitors by channel
  const aggregatedData = rawData.reduce((acc, entry) => {
    const Channel = entry.Channel;
    const Visitors = parseInt(entry.Visitors, 10); 

    if (!acc[Channel]) {
      acc[Channel] = { Channel, totalVisitors: 0 };
    }
    acc[Channel].totalVisitors += Visitors; 

    return acc;
  }, {} as Record<string, { Channel: string; totalVisitors: number }>);

  
  const topChannels = Object.values(aggregatedData)
    .sort((a, b) => b.totalVisitors - a.totalVisitors)
    .slice(0, 5); 

  // Custom legend component
  const renderLegend = () => (
    <div className="grid grid-cols-3 gap-2 mt-2">
      {topChannels.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center">
          <div
            className="w-4 h-4 mr-2"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
          <span className="text-xs">{entry.Channel}</span>
        </div>
      ))}
    </div>
  );
  

  return (
    <div> 
       {renderLegend()}
   
      <ResponsiveContainer width="100%" height={280}> 
        <PieChart>
          <Pie
            data={topChannels}
            dataKey="totalVisitors"
            nameKey="channel"
            cx="50%"
            cy="50%"
            outerRadius="60%" 
            label
          >
            {topChannels.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
