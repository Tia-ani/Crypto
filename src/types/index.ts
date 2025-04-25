// Type definitions for the application

// Basic coin information
export interface Coin {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank?: number;
  thumb?: string;
  large?: string;
}

// Coin market data (for listings)
export interface CoinMarket extends Coin {
  current_price: number;
  market_cap: number;
  total_volume: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  price_change_24h: number;
  image: string;
  sparkline_in_7d: {
    price: number[];
  };
}

// Detailed coin information
export interface CoinDetail {
  id: string;
  name: string;
  symbol: string;
  description: {
    en: string;
  };
  image: {
    small: string;
    large: string;
  };
  market_cap_rank: number;
  market_data: {
    current_price: {
      [key: string]: number;
    };
    market_cap: {
      [key: string]: number;
    };
    total_volume: {
      [key: string]: number;
    };
    high_24h: {
      [key: string]: number;
    };
    low_24h: {
      [key: string]: number;
    };
    price_change_24h: number;
    price_change_percentage_1h_in_currency: {
      [key: string]: number;
    };
    price_change_percentage_24h_in_currency: {
      [key: string]: number;
    };
    price_change_percentage_7d_in_currency: {
      [key: string]: number;
    };
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    twitter_screen_name: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
    };
  };
  categories: string[];
  genesis_date: string | null;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
}

// Filter state
export interface FilterState {
  sort: {
    field: string;
    direction: 'asc' | 'desc';
  };
  search: string;
  currency: string;
  page: number;
  perPage: number;
}

// Theme state
export interface ThemeState {
  mode: 'light' | 'dark';
}