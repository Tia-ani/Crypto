import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, Star, Menu, X, Coins, 
  LineChart, RefreshCw
} from 'lucide-react';
import ThemeToggle from '../theme/ThemeToggle';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectFilters, setSearch } from '../../store/slices/filtersSlice';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { search } = useAppSelector(selectFilters);

  // Handle scroll events to add shadow to header when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh - in a real app this would trigger a data refetch
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
    window.location.reload();
  };

  return (
    <header
      className={`sticky top-0 z-10 bg-white dark:bg-gray-900 transition-shadow duration-200 ${
        isScrolled ? 'shadow-md dark:shadow-gray-800/20' : ''
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Coins className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">CryptoTracker</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium hover:text-primary-500 ${
                location.pathname === '/' ? 'text-primary-500' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Coins size={18} />
                Coins
              </span>
            </Link>
            <Link
              to="/favorites"
              className={`text-sm font-medium hover:text-primary-500 ${
                location.pathname === '/favorites' ? 'text-primary-500' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Star size={18} />
                Favorites
              </span>
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block relative flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search cryptocurrencies..."
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
              />
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Refresh data"
            >
              <RefreshCw
                size={20}
                className={`text-gray-600 dark:text-gray-300 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={search}
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-800 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto space-y-1 px-4 py-3">
            <Link
              to="/"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                location.pathname === '/'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <Coins size={18} />
                Coins
              </span>
            </Link>
            <Link
              to="/favorites"
              className={`block rounded-md px-3 py-2 text-base font-medium ${
                location.pathname === '/favorites'
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              <span className="flex items-center gap-2">
                <Star size={18} />
                Favorites
              </span>
            </Link>
            <div className="flex items-center justify-between rounded-md px-3 py-2">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <RefreshCw
                  size={18}
                  className={isRefreshing ? 'animate-spin' : ''}
                />
                <span className="text-base font-medium">Refresh Data</span>
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;