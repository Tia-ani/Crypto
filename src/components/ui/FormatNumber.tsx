import React from 'react';

interface FormatNumberProps {
  value: number | undefined | null;
  currency?: boolean;
  symbol?: string;
  digits?: number;
  compact?: boolean;
  className?: string;
}

const FormatNumber: React.FC<FormatNumberProps> = ({
  value,
  currency = false,
  symbol = '$',
  digits = 2,
  compact = false,
  className = '',
}) => {
  if (value === undefined || value === null) {
    return <span className="text-gray-400">—</span>;
  }

  // Clamp digits between 0 and 20 to prevent RangeError
  const digitsToUse = Math.min(Math.max(Math.floor(digits), 0), 20);

  let formattedValue: string;

  if (currency) {
    if (compact) {
      formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: digitsToUse,
      })
        .format(value)
        .replace('$', ''); // Remove the $ to add our own symbol

      return (
        <span className={className}>
          {symbol}
          {formattedValue}
        </span>
      );
    }

    if (value < 0.01 && value > 0) {
      formattedValue = `${symbol}${value.toFixed(Math.min(8, digitsToUse))}`;
    } else {
      formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: digitsToUse,
        minimumFractionDigits: value < 1 ? Math.min(4, digitsToUse) : Math.min(2, digitsToUse),
      })
        .format(value)
        .replace('$', ''); // Remove the $ to add our own symbol

      formattedValue = `${symbol}${formattedValue}`;
    }
  } else {
    if (compact) {
      formattedValue = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: digitsToUse,
      }).format(value);
    } else {
      formattedValue = new Intl.NumberFormat('en-US', {
        maximumFractionDigits: digitsToUse,
      }).format(value);
    }
  }

  return <span className={className}>{formattedValue}</span>;
};

export default FormatNumber;