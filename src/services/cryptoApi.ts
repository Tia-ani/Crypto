import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Coin, CoinDetail, CoinMarket } from '../types';

// Using CoinGecko's free API
const API_URL = 'https://api.coingecko.com/api/v3';

export const cryptoApi = createApi({
  reducerPath: 'cryptoApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Coin'],
  endpoints: (builder) => ({
    // Get top coins by market cap
    getCoins: builder.query<CoinMarket[], { page?: number; perPage?: number; currency?: string }>({
      query: ({ page = 1, perPage = 100, currency = 'usd' }) => 
        `/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`,
      transformResponse: (response: CoinMarket[]) => response,
    }),
    
    // Get specific coin details
    getCoinDetails: builder.query<CoinDetail, { id: string; currency?: string }>({
      query: ({ id, currency = 'usd' }) => 
        `/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`,
    }),
    
    // Get coin historical market data
    getCoinHistory: builder.query<{ prices: [number, number][] }, { id: string; days: string; currency?: string }>({
      query: ({ id, days, currency = 'usd' }) => 
        `/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`,
    }),
    
    // Search for coins
    searchCoins: builder.query<{ coins: Coin[] }, string>({
      query: (query) => `/search?query=${query}`,
    }),
  }),
});

export const {
  useGetCoinsQuery,
  useGetCoinDetailsQuery,
  useGetCoinHistoryQuery,
  useSearchCoinsQuery,
} = cryptoApi;