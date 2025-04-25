import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceChangeProps {
  value: number | undefined;
  showIcon?: boolean;
  showPlus?: boolean;
  className?: string;
}

const PriceChange: React.FC<PriceChangeProps> = ({
  value,
  showIcon = true,
  showPlus = true,
  className = '',
}) => {
  if (value === undefined || value === null) {
    return <span className="text-gray-400">—</span>;
  }

  const isPositive = value >= 0;
  const baseClasses = isPositive ? 'price-up' : 'price-down';
  const formattedValue = isPositive && showPlus ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;

  return (
    <span className={`flex items-center ${baseClasses} ${className}`}>
      {showIcon && (
        <span className="mr-1">
          {isPositive ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          )}
        </span>
      )}
      {formattedValue}
    </span>
  );
};

export default PriceChange;