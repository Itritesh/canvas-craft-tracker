
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
} from 'recharts';
import { formatCurrency } from '@/utils/dashboardUtils';
import { useTheme } from 'next-themes';

interface ChartsSectionProps {
  dailyData: { date: string; count: number }[];
  monthlyData: { month: string; total: number }[];
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ dailyData, monthlyData }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Chart colors based on theme
  const colors = {
    axis: isDark ? '#9CA3AF' : '#6B7280',
    grid: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    tooltip: {
      bg: isDark ? '#1F2937' : '#FFFFFF',
      text: isDark ? '#F9FAFB' : '#1F2937',
      border: isDark ? '#374151' : '#E5E7EB',
    },
    bar: {
      daily: isDark ? '#A78BFA' : '#8B5CF6',
      payment: isDark ? '#34D399' : '#10B981',
    }
  };

  // Custom tooltip components
  const CustomTooltip = ({ active, payload, label, type }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-2 bg-${colors.tooltip.bg} border border-${colors.tooltip.border} rounded shadow-md`}>
          <p className={`text-${colors.tooltip.text} font-medium`}>{label}</p>
          {type === 'daily' ? (
            <p className={`text-${colors.tooltip.text}`}>
              <span className="font-medium">{payload[0].value}</span> tasks assigned
            </p>
          ) : (
            <p className={`text-${colors.tooltip.text}`}>
              <span className="font-medium">{formatCurrency(payload[0].value)}</span> total payment
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <Card className="glass-card animate-on-load" style={{ "--delay": "3" } as React.CSSProperties}>
        <CardHeader>
          <CardTitle className="text-xl font-medium">Daily Assignments</CardTitle>
          <CardDescription>
            Number of tasks assigned per day
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis 
                dataKey="date" 
                stroke={colors.axis}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke={colors.axis}
                tick={{ fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip type="daily" />} />
              <Bar 
                dataKey="count" 
                fill={colors.bar.daily} 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="glass-card animate-on-load" style={{ "--delay": "4" } as React.CSSProperties}>
        <CardHeader>
          <CardTitle className="text-xl font-medium">Monthly Payments</CardTitle>
          <CardDescription>
            Total payments made each month
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis 
                dataKey="month" 
                stroke={colors.axis}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke={colors.axis}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip type="payment" />} />
              <Line
                type="monotone"
                dataKey="total"
                stroke={colors.bar.payment}
                strokeWidth={2}
                dot={{ fill: colors.bar.payment, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
