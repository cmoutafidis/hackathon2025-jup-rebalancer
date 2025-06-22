'use client';

import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { RefreshCw, Search, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface JupiterToken {
  address: string;
  symbol: string;
  name: string;
  logoURI: string;
  decimals: number;
  price?: number;
}

export default function SwapPage() {
  const [tokens, setTokens] = useState<JupiterToken[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<JupiterToken[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [page, setPage] = useState(1);
  const tokensPerPage = 20;
  const totalPages = Math.ceil(filteredTokens.length / tokensPerPage);
  const paginatedTokens = filteredTokens.slice((page - 1) * tokensPerPage, page * tokensPerPage);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    fetchTokens();
  }, []);

  useEffect(() => {
    const filtered = tokens.filter(token =>
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTokens(filtered);
    setPage(1);
  }, [searchTerm, tokens]);

  const fetchTokens = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all Jupiter tokens
      const tokensResponse = await fetch('/api/jupiter-tokens');
      if (!tokensResponse.ok) {
        throw new Error('Failed to fetch tokens');
      }
      const tokensData: JupiterToken[] = await tokensResponse.json();
      
      // Limit to first 100 tokens to avoid API overload
      const limitedTokens = tokensData.slice(0, 100);
      
      // Log tokens without logos for debugging
      const tokensWithoutLogos = limitedTokens.filter(token => !token.logoURI);
      if (tokensWithoutLogos.length > 0) {
        console.log('Tokens without logos:', tokensWithoutLogos.map(t => ({ symbol: t.symbol, name: t.name })));
      }
      
      // Get token addresses for price fetching
      const tokenIds = limitedTokens.map(token => token.address).join(',');
      
      // Fetch prices for limited tokens
      const pricesResponse = await fetch(`/api/jupiter-prices?ids=${tokenIds}`);
      if (!pricesResponse.ok) {
        throw new Error('Failed to fetch prices');
      }
      const pricesData = await pricesResponse.json();
      
      // Merge token data with prices
      const tokensWithPrices = limitedTokens.map(token => ({
        ...token,
        price: pricesData.data?.[token.address]?.price || 0
      }));
      
      setTokens(tokensWithPrices);
      setFilteredTokens(tokensWithPrices);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'N/A';
    if (price < 0.01) return `$${price.toFixed(6)}`;
    return `$${price.toFixed(4)}`;
  };

  // Helper to safely get price as number
  const getPrice = (price: number | undefined) => typeof price === 'number' ? price : 0;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Wallet Button - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        {isClient && <WalletMultiButton className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200" />}
      </div>

      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img src="/jupi.svg" alt="Jupiter Logo" className="w-8 h-8 rounded-lg bg-white/10" />
              <h1 className="text-xl font-bold text-white">Jupiter Swap</h1>
            </div>
            {/* Navigation Buttons */}
            <nav className="flex space-x-4">
              <Link href="/" className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200">Home</Link>
              <Link href="/swap" className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200">Swap</Link>
              <a href="https://github.com/harshakp06/jup-rebalancer" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-600 text-white font-medium hover:from-gray-900 hover:to-gray-700 transition-all duration-200">GitHub</a>
            </nav>
            <button
              onClick={fetchTokens}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* API Links Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-4">
        <div className="bg-white/10 border border-white/20 rounded-lg p-4 text-white text-sm">
          <div className="mb-2 font-semibold">APIs used in this page:</div>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Jupiter Token List: <a href="https://token.jup.ag/strict" target="_blank" rel="noopener noreferrer" className="underline text-blue-300 hover:text-blue-400">https://token.jup.ag/strict</a>
            </li>
            <li>
              Jupiter Price API: <a href="https://quote-api.jup.ag/v6/quote" target="_blank" rel="noopener noreferrer" className="underline text-blue-300 hover:text-blue-400">https://quote-api.jup.ag/v6/quote</a>
            </li>
            <li>
              Local API (tokens): <span className="text-gray-300">/api/jupiter-tokens</span>
            </li>
            <li>
              Local API (prices): <span className="text-gray-300">/api/jupiter-prices</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/20 border border-purple-400 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-md"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-4">Loading Tokens...</h2>
            <p className="text-white/60">Fetching Jupiter supported tokens and prices</p>
          </div>
        )}

        {/* Token Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedTokens.map((token) => (
              <div
                key={token.address}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:bg-white/20 transition-all duration-200 cursor-pointer group flex flex-col justify-between min-h-[180px]"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-white/20 flex items-center justify-center shadow-md">
                    {token.logoURI ? (
                      <img
                        src={token.logoURI}
                        alt={token.symbol}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center text-white font-bold text-lg ${token.logoURI ? 'hidden' : ''}`}>
                      {token.symbol.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg truncate">{token.symbol}</h3>
                    <p className="text-white/60 text-sm truncate">{token.name}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Price</span>
                    <span className="text-white font-semibold">{formatPrice(getPrice(token.price))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-4 flex-wrap">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-white/10 text-white font-medium disabled:opacity-50 hover:bg-white/20 transition-all duration-200"
            >
              Previous
            </button>
            {/* Page Numbers */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded-md font-medium ${page === i + 1 ? 'bg-purple-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-white/10 text-white font-medium disabled:opacity-50 hover:bg-white/20 transition-all duration-200"
            >
              Next
            </button>
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredTokens.length === 0 && (
          <div className="text-center py-20">
            <TrendingUp className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">No tokens found</h2>
            <p className="text-white/60">Try adjusting your search terms</p>
          </div>
        )}

        {/* Token Count */}
        {!isLoading && (
          <div className="mt-8 text-center">
            <p className="text-white/60">
              Showing {filteredTokens.length} of {tokens.length} tokens (limited to first 100 for performance)
            </p>
          </div>
        )}
      </main>
    </div>
  );
} 