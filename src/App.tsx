import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CoinList from './components/coins/CoinList';
import CoinDetails from './components/coins/CoinDetails';
import Favorites from './components/coins/Favorites';
import ThemeProvider from './components/theme/ThemeProvider';

function App() {
  // Update page title
  useEffect(() => {
    document.title = 'CryptoTracker - Real-time Cryptocurrency Prices';
  }, []);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container mx-auto flex-1 px-4 py-6">
          <Routes>
            <Route path="/" element={<CoinList />} />
            <Route path="/coin/:id" element={<CoinDetails />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;