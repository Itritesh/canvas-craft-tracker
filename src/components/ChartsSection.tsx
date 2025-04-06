
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import { formatCurrency } from '@/utils/dashboardUtils';

interface ChartsSectionProps {
  dailyData: { date: string; count: number }[];
  monthlyData: { month: string; total: number }[];
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ dailyData, monthlyData }) => {
  // Chart colors
  const colors = {
    axis: '#9CA3AF',
    grid: 'rgba(255, 255, 255, 0.1)',
    tooltip: {
      bg: 'rgba(26, 32, 44, 0.9)',
      text: '#F9FAFB',
      border: 'rgba(55, 65, 81, 0.3)',
    },
    daily: {
      primary: '#A78BFA',
      secondary: '#F9A8D4',
      gradient: ['rgba(167, 139, 250, 0.7)', 'rgba(167, 139, 250, 0.1)'],
    },
    monthly: {
      primary: '#34D399',
      secondary: '#60A5FA',
      gradient: ['rgba(52, 211, 153, 0.7)', 'rgba(52, 211, 153, 0.1)'],
    }
  };

  // Custom tooltip components
  const CustomTooltip = ({ active, payload, label, type }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg shadow-xl backdrop-blur-sm">
          <p className="text-white font-bold mb-1">{label}</p>
          {type === 'daily' ? (
            <p className="text-purple-300 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-2"></span>
              <span className="font-medium">{payload[0].value}</span> tasks assigned
            </p>
          ) : (
            <p className="text-green-300 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              <span className="font-medium">{formatCurrency(payload[0].value)}</span> total payment
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
      <Card className="glass-card animate-on-load border-t-4 border-t-purple-500 shadow-[0_10px_20px_rgba(167,139,250,0.2)]" style={{ "--delay": "3" } as React.CSSProperties}>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Daily Assignments
          </CardTitle>
          <CardDescription className="text-gray-300 text-base">
            Number of tasks assigned per day
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={dailyData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient id="dailyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.daily.primary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={colors.daily.primary} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis 
                dataKey="date" 
                stroke={colors.axis}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                tickLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
              />
              <YAxis 
                stroke={colors.axis}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                allowDecimals={false}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                tickLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
              />
              <Tooltip content={<CustomTooltip type="daily" />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke={colors.daily.primary}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#dailyGradient)"
                activeDot={{ r: 6, stroke: 'white', strokeWidth: 2, fill: colors.daily.primary }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="glass-card animate-on-load border-t-4 border-t-green-500 shadow-[0_10px_20px_rgba(52,211,153,0.2)]" style={{ "--delay": "4" } as React.CSSProperties}>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
            Monthly Payments
          </CardTitle>
          <CardDescription className="text-gray-300 text-base">
            Total payments made each month
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.monthly.primary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={colors.monthly.primary} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis 
                dataKey="month" 
                stroke={colors.axis}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                tickLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
              />
              <YAxis 
                stroke={colors.axis}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                tickLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
              />
              <Tooltip content={<CustomTooltip type="payment" />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke={colors.monthly.primary}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#monthlyGradient)"
                activeDot={{ r: 6, stroke: 'white', strokeWidth: 2, fill: colors.monthly.primary }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
