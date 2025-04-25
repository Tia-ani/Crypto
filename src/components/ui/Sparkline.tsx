import React, { useEffect, useRef } from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillColor?: string;
  lineWidth?: number;
  isPositive?: boolean;
}

const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 120,
  height = 40,
  color,
  fillColor,
  lineWidth = 1.5,
  isPositive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Determine color based on price direction if not provided
  const lineColor = color || (isPositive ? '#10b981' : '#ef4444');
  const fillGradient = fillColor || (isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)');

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Get min and max values for scaling
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const range = maxValue - minValue || 1; // Avoid division by zero

    // Calculate x and y positions
    const xStep = width / (data.length - 1);
    const getY = (value: number) => height - ((value - minValue) / range) * (height * 0.9) - (height * 0.05);

    // Create path for line
    ctx.beginPath();
    ctx.moveTo(0, getY(data[0]));
    
    for (let i = 1; i < data.length; i++) {
      ctx.lineTo(i * xStep, getY(data[i]));
    }

    // Stroke settings
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Fill area under the curve
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();

    // Create gradient for fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, fillGradient);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.fill();
  }, [data, width, height, lineColor, fillGradient, lineWidth]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="sparkline"
    />
  );
};

export default Sparkline;