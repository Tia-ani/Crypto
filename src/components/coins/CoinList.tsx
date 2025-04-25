import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, SlidersHorizontal, ArrowDown, ArrowUp } from 'lucide-react';
import { useGetCoinsQuery } from '../../services/cryptoApi';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { 
  selectFilters, 
  setPage, 
  setPerPage, 
  setSort,
} from '../../store/slices/filtersSlice';
import Pagination from '../ui/Pagination';
import PriceChange from '../ui/PriceChange';
import FormatNumber from '../ui/FormatNumber';
import Sparkline from '../ui/Sparkline';
import CryptoIconImage from '../ui/CryptoIconImage';
import FavoriteButton from '../ui/FavoriteButton';

const CoinList: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { 
    page, 
    perPage, 
    currency, 
    search, 
    sort 
  } = useAppSelector(selectFilters);
  
  const { data: coins, error, isLoading, refetch } = useGetCoinsQuery({
    page,
    perPage,
    currency,
  });

  // Auto-refresh data every 60 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [refetch]);

  // Handle sorting
  const handleSort = (field: string) => {
    const direction = 
      sort.field === field && sort.direction === 'desc' ? 'asc' : 'desc';
    dispatch(setSort({ field, direction }));
  };

  // Get sort icon for column
  const getSortIcon = (field: string) => {
    if (sort.field !== field) {
      return <ArrowUpDown size={14} className="ml-1 text-gray-400" />;
    }
    return sort.direction === 'desc' ? (
      <ArrowDown size={14} className="ml-1 text-gray-800 dark:text-gray-200" />
    ) : (
      <ArrowUp size={14} className="ml-1 text-gray-800 dark:text-gray-200" />
    );
  };

  // Filter coins by search term
  const filteredCoins = coins?.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  // Sort coins
  const sortedCoins = [...(filteredCoins || [])].sort((a, b) => {
    const direction = sort.direction === 'desc' ? -1 : 1;
    
    switch (sort.field) {
      case 'rank':
        return (a.market_cap_rank || 0) - (b.market_cap_rank || 0);
      case 'name':
        return direction * a.name.localeCompare(b.name);
      case 'price':
        return direction * (a.current_price - b.current_price);
      case '1h':
        return direction * 
          ((a.price_change_percentage_1h_in_currency || 0) - 
           (b.price_change_percentage_1h_in_currency || 0));
      case '24h':
        return direction * 
          ((a.price_change_percentage_24h_in_currency || 0) - 
           (b.price_change_percentage_24h_in_currency || 0));
      case '7d':
        return direction * 
          ((a.price_change_percentage_7d_in_currency || 0) - 
           (b.price_change_percentage_7d_in_currency || 0));
      case 'market_cap':
        return direction * (a.market_cap - b.market_cap);
      case 'volume':
        return direction * (a.total_volume - b.total_volume);
      case 'supply':
        return direction * (a.circulating_supply - b.circulating_supply);
      default:
        return 0;
    }
  });

  // Calculate total pages
  const totalCoins = filteredCoins?.length || 0;
  const totalPages = Math.ceil(totalCoins / perPage);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading cryptocurrency data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-lg border border-danger-300 bg-danger-50 p-6 text-center dark:border-danger-800 dark:bg-danger-900/30">
          <h2 className="mb-2 text-xl font-semibold text-danger-700 dark:text-danger-400">Error Loading Data</h2>
          <p className="text-danger-600 dark:text-danger-300">
            There was an error fetching cryptocurrency data. Please try again later.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-md bg-danger-100 px-4 py-2 text-sm font-medium text-danger-700 hover:bg-danger-200 dark:bg-danger-900 dark:text-danger-300 dark:hover:bg-danger-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Cryptocurrency Prices</h1>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center gap-1.5"
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>
          
          <select
            value={perPage}
            onChange={(e) => dispatch(setPerPage(Number(e.target.value)))}
            className="input h-9 py-0"
          >
            <option value={10}>10 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
          </select>
        </div>
      </div>
      
      {showFilters && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 font-medium">Filters and Settings</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => dispatch(setPerPage(Number(e.target.value)))}
                className="mt-1 w-full input"
              >
                <option value="usd">USD ($)</option>
                <option value="eur">EUR (€)</option>
                <option value="gbp">GBP (£)</option>
                <option value="jpy">JPY (¥)</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="w-12 pl-6"></th>
              <th className="w-12">#</th>
              <th>
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center font-medium"
                >
                  Name
                  {getSortIcon('name')}
                </button>
              </th>
              <th>
                <button
                  onClick={() => handleSort('price')}
                  className="flex items-center font-medium"
                >
                  Price
                  {getSortIcon('price')}
                </button>
              </th>
              <th className="hidden sm:table-cell">
                <button
                  onClick={() => handleSort('1h')}
                  className="flex items-center font-medium"
                >
                  1h %
                  {getSortIcon('1h')}
                </button>
              </th>
              <th>
                <button
                  onClick={() => handleSort('24h')}
                  className="flex items-center font-medium"
                >
                  24h %
                  {getSortIcon('24h')}
                </button>
              </th>
              <th className="hidden sm:table-cell">
                <button
                  onClick={() => handleSort('7d')}
                  className="flex items-center font-medium"
                >
                  7d %
                  {getSortIcon('7d')}
                </button>
              </th>
              <th className="hidden lg:table-cell">
                <button
                  onClick={() => handleSort('market_cap')}
                  className="flex items-center font-medium"
                >
                  Market Cap
                  {getSortIcon('market_cap')}
                </button>
              </th>
              <th className="hidden lg:table-cell">
                <button
                  onClick={() => handleSort('volume')}
                  className="flex items-center font-medium"
                >
                  Volume(24h)
                  {getSortIcon('volume')}
                </button>
              </th>
              <th className="hidden xl:table-cell">
                <button
                  onClick={() => handleSort('supply')}
                  className="flex items-center font-medium"
                >
                  Circulating Supply
                  {getSortIcon('supply')}
                </button>
              </th>
              <th className="hidden md:table-cell">Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            {sortedCoins && sortedCoins.length > 0 ? (
              sortedCoins.map((coin) => (
                <tr
                  key={coin.id}
                  onClick={() => navigate(`/coin/${coin.id}`)}
                  className="table-row cursor-pointer transition-colors"
                >
                  <td className="pl-6">
                    <FavoriteButton coinId={coin.id} />
                  </td>
                  <td>{coin.market_cap_rank || '—'}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <CryptoIconImage
                        src={coin.image}
                        alt={coin.name}
                        size={24}
                      />
                      <div>
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {coin.symbol.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <FormatNumber
                      value={coin.current_price}
                      currency
                    />
                  </td>
                  <td className="hidden sm:table-cell">
                    <PriceChange
                      value={coin.price_change_percentage_1h_in_currency}
                    />
                  </td>
                  <td>
                    <PriceChange
                      value={coin.price_change_percentage_24h_in_currency}
                    />
                  </td>
                  <td className="hidden sm:table-cell">
                    <PriceChange
                      value={coin.price_change_percentage_7d_in_currency}
                    />
                  </td>
                  <td className="hidden lg:table-cell">
                    <FormatNumber
                      value={coin.market_cap}
                      currency
                      compact
                    />
                  </td>
                  <td className="hidden lg:table-cell">
                    <FormatNumber
                      value={coin.total_volume}
                      currency
                      compact
                    />
                  </td>
                  <td className="hidden xl:table-cell">
                    <div className="flex items-center gap-1">
                      <FormatNumber
                        value={coin.circulating_supply}
                        compact
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {coin.symbol.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    {coin.sparkline_in_7d?.price && (
                      <Sparkline
                        data={coin.sparkline_in_7d.price}
                        isPositive={
                          (coin.price_change_percentage_7d_in_currency || 0) >= 0
                        }
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="py-12 text-center">
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    {search
                      ? 'No cryptocurrencies match your search criteria.'
                      : 'No cryptocurrency data available.'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CoinList;