import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, Trash2 } from 'lucide-react';
import { useGetCoinsQuery } from '../../services/cryptoApi';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { 
  selectFavorites, 
  clearFavorites,
  removeFavorite
} from '../../store/slices/favoritesSlice';
import CryptoIconImage from '../ui/CryptoIconImage';
import FormatNumber from '../ui/FormatNumber';
import PriceChange from '../ui/PriceChange';
import Sparkline from '../ui/Sparkline';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(selectFavorites);
  const { data: allCoins, isLoading } = useGetCoinsQuery({ perPage: 250 });
  
  const favoriteCoins = allCoins?.filter(coin => 
    favoriteIds.includes(coin.id)
  ) || [];

  const handleClearFavorites = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      dispatch(clearFavorites());
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <h1 className="text-2xl font-bold">Favorites</h1>
          </div>
        </div>
        
        {favoriteCoins.length > 0 && (
          <button
            onClick={handleClearFavorites}
            className="btn-outline flex items-center gap-1.5 text-danger-600 hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-900/30"
          >
            <Trash2 size={16} />
            Clear All
          </button>
        )}
      </div>
      
      {favoriteCoins.length === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
            <Star className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">No Favorites Yet</h2>
          <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
            Add cryptocurrencies to your favorites list<br />to track them more easily.
          </p>
          <Link to="/" className="btn-primary">
            Browse Cryptocurrencies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favoriteCoins.map((coin) => (
            <div
              key={coin.id}
              className="card overflow-hidden hover:border-primary-200 dark:hover:border-primary-800 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => navigate(`/coin/${coin.id}`)}
                >
                  <CryptoIconImage
                    src={coin.image}
                    alt={coin.name}
                    size={40}
                  />
                  <div>
                    <h3 className="font-medium">{coin.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {coin.symbol.toUpperCase()}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => dispatch(removeFavorite(coin.id))}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  aria-label="Remove from favorites"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div 
                className="mt-4 cursor-pointer"
                onClick={() => navigate(`/coin/${coin.id}`)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-2xl font-semibold">
                    <FormatNumber
                      value={coin.current_price}
                      currency
                    />
                  </h4>
                  <PriceChange
                    value={coin.price_change_percentage_24h_in_currency}
                  />
                </div>
                
                <div className="mt-4">
                  {coin.sparkline_in_7d?.price && (
                    <Sparkline
                      data={coin.sparkline_in_7d.price}
                      width={280}
                      height={60}
                      isPositive={
                        (coin.price_change_percentage_7d_in_currency || 0) >= 0
                      }
                    />
                  )}
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Market Cap</p>
                    <p className="font-medium">
                      <FormatNumber
                        value={coin.market_cap}
                        currency
                        compact
                      />
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">24h Volume</p>
                    <p className="font-medium">
                      <FormatNumber
                        value={coin.total_volume}
                        currency
                        compact
                      />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;