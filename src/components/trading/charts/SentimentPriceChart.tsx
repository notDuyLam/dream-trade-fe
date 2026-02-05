import type { ChartData } from '@/types/trading';
import React from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type SentimentPriceChartProps = {
  data: ChartData;
  height?: number;
};

export const SentimentPriceChart: React.FC<SentimentPriceChartProps> = ({
  data,
  height = 300,
}) => {
  if (!data?.timestamps?.length) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        No chart data available
      </div>
    );
  }

  // Transform data for Recharts
  const chartData = data.timestamps.map((ts, index) => ({
    time: ts,
    price: data.price[index],
    sentiment: data.sentiment[index],
    fearGreed: data.fear_greed[index],
    volume: data.volume[index],
  }));

  // Calculate distinct domains for axes
  const minPrice = Math.min(...data.price);
  const maxPrice = Math.max(...data.price);
  const pricePadding = (maxPrice - minPrice) * 0.1;

  const formatDate = (dateStr: any) => {
    try {
      if (!dateStr) {
        return '';
      }
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return String(dateStr);
    }
  };

  return (
    <div className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-4">
      <h3 className="mb-4 text-sm font-medium text-slate-300">Sentiment vs Price Correlation</h3>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis
              dataKey="time"
              tickFormatter={formatDate}
              stroke="#94a3b8"
              fontSize={11}
              minTickGap={30}
            />
            {/* Left Axis: Sentiment */}
            <YAxis
              yAxisId="left"
              orientation="left"
              domain={[-1, 1]}
              stroke="#8b5cf6"
              fontSize={11}
              label={{ value: 'Sentiment', angle: -90, position: 'insideLeft', fill: '#8b5cf6' }}
            />
            {/* Right Axis: Price */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[minPrice - pricePadding, maxPrice + pricePadding]}
              stroke="#10b981"
              fontSize={11}
              tickFormatter={(val: number) => val.toLocaleString()}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
              labelFormatter={formatDate}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <ReferenceLine y={0} yAxisId="left" stroke="#475569" strokeDasharray="3 3" />

            {/* Area must come before Line for correct layering if desired, but linter complained Area before Line order?
                Actually Recharts layering is render order. Area usually background.
                Linter said "Expected 'Area' to come before 'Line'". So I usually put Line last (on top).
            */}
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="sentiment"
              name="Sentiment Score"
              stroke="#8b5cf6"
              fill="url(#sentimentGradient)"
              strokeWidth={2}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="price"
              name="Price (USDT)"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
