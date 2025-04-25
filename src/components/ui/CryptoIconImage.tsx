import React from 'react';
import { CircleDollarSign } from 'lucide-react';

interface CryptoIconImageProps {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}

const CryptoIconImage: React.FC<CryptoIconImageProps> = ({
  src,
  alt,
  size = 24,
  className = '',
}) => {
  const [imageError, setImageError] = React.useState(false);

  if (imageError || !src) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
        style={{ width: size, height: size }}
      >
        <CircleDollarSign size={size * 0.6} className="text-gray-500 dark:text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
      onError={() => setImageError(true)}
    />
  );
};

export default CryptoIconImage;