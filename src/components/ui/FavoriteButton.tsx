import React from 'react';
import { Star } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { 
  addFavorite, 
  removeFavorite, 
  selectIsFavorite 
} from '../../store/slices/favoritesSlice';

interface FavoriteButtonProps {
  coinId: string;
  size?: number;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  coinId,
  size = 20,
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, coinId));

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite) {
      dispatch(removeFavorite(coinId));
    } else {
      dispatch(addFavorite(coinId));
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`rounded-full p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 ${className}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star
        size={size}
        fill={isFavorite ? '#f59e0b' : 'none'}
        className={isFavorite ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-500'}
      />
    </button>
  );
};

export default FavoriteButton;