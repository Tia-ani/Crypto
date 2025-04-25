import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectTheme } from '../../store/slices/themeSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface PriceChartProps {
  priceData: [number, number][];
  timeframe: string;
  priceDirection: 'up' | 'down';
}

const PriceChart: React.FC<PriceChartProps> = ({ 
  priceData, 
  timeframe,
  priceDirection,
}) => {
  const theme = useAppSelector(selectTheme);
  const [chartData, setChartData] = useState<any>(null);
  
  useEffect(() => {
    if (!priceData || priceData.length === 0) return;
    
    // Format dates based on timeframe
    const formatDate = (timestamp: number) => {
      const date = new Date(timestamp);
      
      if (timeframe === '1') {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (timeframe === '7') {
        return date.toLocaleDateString([], { weekday: 'short' });
      } else if (timeframe === '30' || timeframe === '90') {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      } else {
        return date.toLocaleDateString([], { month: 'short', year: 'numeric' });
      }
    };
    
    // Get labels and price data
    const labels = priceData.map(item => formatDate(item[0]));
    const prices = priceData.map(item => item[1]);
    
    // Reduce the number of points for better visualization
    const step = Math.max(1, Math.floor(labels.length / 100));
    const filteredLabels = labels.filter((_, i) => i % step === 0);
    const filteredPrices = prices.filter((_, i) => i % step === 0);
    
    // Colors based on price direction and theme
    const mainColor = priceDirection === 'up' 
      ? '#10b981' // green
      : '#ef4444'; // red
      
    const backgroundColor = theme === 'dark'
      ? `${mainColor}15` // 15% opacity
      : `${mainColor}10`; // 10% opacity
    
    setChartData({
      labels: filteredLabels,
      datasets: [
        {
          data: filteredPrices,
          borderColor: mainColor,
          backgroundColor,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.1,
          fill: true,
        },
      ],
    });
  }, [priceData, timeframe, priceDirection, theme]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        bodyFont: {
          family: 'Inter, sans-serif',
          size: 13,
        },
        titleFont: {
          family: 'Inter, sans-serif',
          size: 13,
        },
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        titleColor: theme === 'dark' ? '#e5e7eb' : '#1f2937',
        bodyColor: theme === 'dark' ? '#e5e7eb' : '#1f2937',
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `$${context.raw.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 11,
          },
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          maxRotation: 0,
          maxTicksLimit: 10,
        },
      },
      y: {
        grid: {
          color: theme === 'dark' ? '#374151' : '#f3f4f6',
          drawBorder: false,
        },
        ticks: {
          font: {
            family: 'Inter, sans-serif',
            size: 11,
          },
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          padding: 8,
          callback: function(value: any) {
            return '$' + value.toLocaleString(undefined, { 
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
          },
        },
        beginAtZero: false,
      },
    },
  };

  if (!chartData) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  return <Line data={chartData} options={options} />;
};

export default PriceChart;