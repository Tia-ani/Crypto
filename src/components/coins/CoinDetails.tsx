import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Info, 
  Globe, 
  MessageCircle, 
  Twitter,
  Github
} from 'lucide-react';
import { 
  useGetCoinDetailsQuery, 
  useGetCoinHistoryQuery 
} from '../../services/cryptoApi';
import FormatNumber from '../ui/FormatNumber';
import PriceChange from '../ui/PriceChange';
import CryptoIconImage from '../ui/CryptoIconImage';
import FavoriteButton from '../ui/FavoriteButton';
import PriceChart from './PriceChart';

const TIME_PERIODS = [
  { label: '24H', value: '1' },
  { label: '7D', value: '7' },
  { label: '1M', value: '30' },
  { label: '3M', value: '90' },
  { label: '1Y', value: '365' },
  { label: 'All', value: 'max' },
];

const CoinDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [timeframe, setTimeframe] = useState('7');
  
  const { 
    data: coinDetails, 
    isLoading: isLoadingDetails,
    error: detailsError
  } = useGetCoinDetailsQuery({ id: id || '' });
  
  const { 
    data: coinHistory, 
    isLoading: isLoadingHistory,
    error: historyError
  } = useGetCoinHistoryQuery({ 
    id: id || '', 
    days: timeframe,
  });

  const isLoading = isLoadingDetails || isLoadingHistory;
  const error = detailsError || historyError;

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Loading coin data...</p>
        </div>
      </div>
    );
  }

  if (error || !coinDetails) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-lg border border-danger-300 bg-danger-50 p-6 text-center dark:border-danger-800 dark:bg-danger-900/30">
          <h2 className="mb-2 text-xl font-semibold text-danger-700 dark:text-danger-400">Error Loading Data</h2>
          <p className="text-danger-600 dark:text-danger-300">
            There was an error fetching coin data. Please try again later.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-md bg-danger-100 px-4 py-2 text-sm font-medium text-danger-700 hover:bg-danger-200 dark:bg-danger-900 dark:text-danger-300 dark:hover:bg-danger-800"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const priceChangeIs24h = coinDetails.market_data.price_change_percentage_24h_in_currency?.usd;
  const priceDirection = priceChangeIs24h && priceChangeIs24h >= 0 ? 'up' : 'down';

  return (
    <div>
      {/* Back button and page title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <CryptoIconImage
                src={coinDetails.image.large}
                alt={coinDetails.name}
                size={32}
              />
              <h1 className="text-2xl font-bold">{coinDetails.name}</h1>
              <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium uppercase text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                {coinDetails.symbol}
              </span>
              {coinDetails.market_cap_rank && (
                <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                  Rank #{coinDetails.market_cap_rank}
                </span>
              )}
            </div>
            <FavoriteButton coinId={coinDetails.id} size={24} />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {coinDetails.links.homepage[0] && (
            <a
              href={coinDetails.links.homepage[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex items-center gap-1.5 text-sm"
            >
              <Globe size={14} />
              Website
            </a>
          )}
          {coinDetails.links.blockchain_site[0] && (
            <a
              href={coinDetails.links.blockchain_site[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex items-center gap-1.5 text-sm"
            >
              <ExternalLink size={14} />
              Explorer
            </a>
          )}
          {coinDetails.links.subreddit_url && (
            <a
              href={coinDetails.links.subreddit_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex items-center gap-1.5 text-sm"
            >
              <MessageCircle size={14} />
              Reddit
            </a>
          )}
          {coinDetails.links.twitter_screen_name && (
            <a
              href={`https://twitter.com/${coinDetails.links.twitter_screen_name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex items-center gap-1.5 text-sm"
            >
              <Twitter size={14} />
              Twitter
            </a>
          )}
          {coinDetails.links.repos_url.github && coinDetails.links.repos_url.github.length > 0 && (
            <a
              href={coinDetails.links.repos_url.github[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex items-center gap-1.5 text-sm"
            >
              <Github size={14} />
              GitHub
            </a>
          )}
        </div>
      </div>
      
      {/* Price section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 card">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                <div className="flex items-end gap-3">
                  <h2 className="text-3xl font-bold">
                    <FormatNumber
                      value={coinDetails.market_data.current_price.usd}
                      currency
                    />
                  </h2>
                  <PriceChange
                    value={coinDetails.market_data.price_change_percentage_24h_in_currency?.usd}
                    className="text-lg"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {TIME_PERIODS.map((period) => (
                  <button
                    key={period.value}
                    onClick={() => setTimeframe(period.value)}
                    className={`rounded-md px-3 py-1 text-sm font-medium ${
                      timeframe === period.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-6 chart-container">
              {coinHistory && (
                <PriceChart
                  priceData={coinHistory.prices}
                  timeframe={timeframe}
                  priceDirection={priceDirection}
                />
              )}
            </div>
          </div>
          
          <div className="card">
            <h3 className="mb-3 text-lg font-semibold">About {coinDetails.name}</h3>
            {coinDetails.description.en ? (
              <div 
                dangerouslySetInnerHTML={{ __html: coinDetails.description.en }} 
                className="prose prose-sm max-w-none dark:prose-invert"
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No description available.</p>
            )}
          </div>
        </div>
        
        <div>
          <div className="card mb-6">
            <h3 className="mb-4 text-lg font-semibold">Market Stats</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Market Cap</span>
                <span className="font-medium">
                  <FormatNumber
                    value={coinDetails.market_data.market_cap.usd}
                    currency
                  />
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Trading Volume (24h)</span>
                <span className="font-medium">
                  <FormatNumber
                    value={coinDetails.market_data.total_volume.usd}
                    currency
                  />
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">24h High</span>
                <span className="font-medium">
                  <FormatNumber
                    value={coinDetails.market_data.high_24h.usd}
                    currency
                  />
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">24h Low</span>
                <span className="font-medium">
                  <FormatNumber
                    value={coinDetails.market_data.low_24h.usd}
                    currency
                  />
                </span>
              </div>
              
              <hr className="border-gray-200 dark:border-gray-700" />
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Circulating Supply</span>
                <div className="text-right">
                  <div className="font-medium">
                    <FormatNumber
                      value={coinDetails.market_data.circulating_supply}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {coinDetails.symbol.toUpperCase()}
                  </span>
                </div>
              </div>
              
              {coinDetails.market_data.total_supply && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Total Supply</span>
                  <div className="text-right">
                    <div className="font-medium">
                      <FormatNumber
                        value={coinDetails.market_data.total_supply}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {coinDetails.symbol.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              
              {coinDetails.market_data.max_supply && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Max Supply</span>
                  <div className="text-right">
                    <div className="font-medium">
                      <FormatNumber
                        value={coinDetails.market_data.max_supply}
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {coinDetails.symbol.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="card">
            <h3 className="mb-4 text-lg font-semibold">Price Change</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">1h</span>
                <PriceChange
                  value={coinDetails.market_data.price_change_percentage_1h_in_currency?.usd}
                />
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">24h</span>
                <PriceChange
                  value={coinDetails.market_data.price_change_percentage_24h_in_currency?.usd}
                />
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">7d</span>
                <PriceChange
                  value={coinDetails.market_data.price_change_percentage_7d_in_currency?.usd}
                />
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">14d</span>
                <PriceChange
                  value={coinDetails.market_data.price_change_percentage_14d_in_currency?.usd}
                />
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">30d</span>
                <PriceChange
                  value={coinDetails.market_data.price_change_percentage_30d_in_currency?.usd}
                />
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">1y</span>
                <PriceChange
                  value={coinDetails.market_data.price_change_percentage_1y_in_currency?.usd}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetails;