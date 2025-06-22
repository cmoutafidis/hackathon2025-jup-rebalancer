'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect, useCallback } from 'react';
import { Wallet, TrendingUp, RefreshCw, Zap, ExternalLink, AlertCircle } from 'lucide-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

// Define the structure for our token data
interface TokenInfo {
  mint: string;
  symbol: string;
  name: string;
  logo: string;
  balance: number;
  price: number;
  value: number;
}

// Define structure for Jupiter's token list
interface JupiterToken {
  address: string;
  symbol: string;
  name: string;
  logoURI: string;
  decimals: number;
}

export default function Home() {
  const { connected, connecting, disconnecting, publicKey, wallet, select, wallets } = useWallet();
  const { connection } = useConnection();
  const [showJupiter, setShowJupiter] = useState(false);
  const [portfolio, setPortfolio] = useState<TokenInfo[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [inrRate, setInrRate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenMap, setTokenMap] = useState<Map<string, JupiterToken>>(new Map());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch the Jupiter token list once on component mount
  useEffect(() => {
    const fetchTokenList = async () => {
      try {
        const response = await fetch('https://token.jup.ag/all');
        const data: JupiterToken[] = await response.json();
        const jupiterTokenMap = new Map(data.map(token => [token.address, token]));
        setTokenMap(jupiterTokenMap);
      } catch (error) {
        console.error("Failed to fetch Jupiter token list", error);
      }
    };
    fetchTokenList();
  }, []);

  const fetchTokenData = useCallback(async () => {
    if (!connected || !publicKey || !connection || tokenMap.size === 0) return;
    setIsLoading(true);
    
    try {
      // 1. Fetch INR conversion rate (can be optimized to fetch less frequently)
      if (inrRate === 0) {
        const inrResponse = await fetch('https://open.er-api.com/v6/latest/USD');
        const inrData = await inrResponse.json();
        setInrRate(inrData.rates.INR);
      }

      // 2. Get all token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });

      const ownedMints = new Map<string, number>(); // mint -> balance

      // Add SOL balance
      const solBalance = await connection.getBalance(publicKey);
      ownedMints.set('So11111111111111111111111111111111111111112', solBalance / LAMPORTS_PER_SOL);
      
      // Process SPL tokens
      tokenAccounts.value.forEach(account => {
        const parsedInfo = account.account.data.parsed.info;
        const balance = parsedInfo.tokenAmount.uiAmount;
        if (balance > 0) {
          ownedMints.set(parsedInfo.mint, balance);
        }
      });
      
      const mintsToFetch = Array.from(ownedMints.keys());

      if (mintsToFetch.length === 0) {
        setPortfolio([]);
        setTotalValue(0);
        setIsLoading(false);
        return;
      }
      
      // 3. Fetch prices for all owned tokens via our new API route
      const priceApiUrl = `/api/jup-price?ids=${mintsToFetch.join(',')}`;
      const priceResponse = await fetch(priceApiUrl);
      
      if (!priceResponse.ok) {
        console.error("Failed to fetch prices from backend", await priceResponse.text());
        setIsLoading(false);
        return;
      }
      
      const priceData = await priceResponse.json();
      
      const newPortfolio: TokenInfo[] = [];
      let runningTotalValue = 0;

      for (const [mint, balance] of ownedMints.entries()) {
        const tokenMeta = tokenMap.get(mint);
        if (tokenMeta) { // Only include tokens known to Jupiter
          const price = priceData.data[mint]?.price || 0;
          const value = balance * price;
          runningTotalValue += value;

          newPortfolio.push({
            mint: mint,
            symbol: tokenMeta.symbol,
            name: tokenMeta.name,
            logo: tokenMeta.logoURI,
            balance: balance,
            price: price,
            value: value,
          });
        } else {
            console.log(`Token with mint ${mint} not found in Jupiter token list.`);
        }
      }

      // Sort portfolio by value
      newPortfolio.sort((a, b) => b.value - a.value);
      
      setPortfolio(newPortfolio);
      setTotalValue(runningTotalValue);

    } catch (error) {
      console.error("Error fetching token data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connection, connected, tokenMap, inrRate]);

  useEffect(() => {
    if (connected && tokenMap.size > 0) {
      fetchTokenData();
    }
  }, [connected, tokenMap, fetchTokenData]);

  const formatCurrency = (value: number) => {
    const displayValue = currency === 'INR' ? value * inrRate : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(displayValue);
  };
  
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Wallet Button - Top Right */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-4">
        {isClient && connected && (
          <div className="text-white/60 text-sm hidden sm:block">
            Connected: {wallet?.adapter.name}
          </div>
        )}
        {isClient && <WalletMultiButton className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200" />}
      </div>

      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Jupiter Portfolio Rebalancer</h1>
            </div>
            {/* Navigation Buttons */}
            <nav className="flex space-x-4">
              <a href="/" className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200">Home</a>
              <a href="/swap" className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200">Swap</a>
              <a href="https://github.com/harshakp06/jup-rebalancer" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg bg-gradient-to-r from-gray-800 to-gray-600 text-white font-medium hover:from-gray-900 hover:to-gray-700 transition-all duration-200">GitHub</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isClient ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-4">Loading...</h2>
            <p className="text-white/60">Initializing wallet connection</p>
          </div>
        ) : connecting ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-4">Connecting Wallet...</h2>
            <p className="text-white/60">Please approve the connection in your wallet</p>
          </div>
        ) : disconnecting ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-4">Disconnecting...</h2>
            <p className="text-white/60">Please wait while we disconnect your wallet</p>
          </div>
        ) : !connected ? (
          <div className="text-center py-20">
            <Wallet className="w-16 h-16 text-white/60 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
            <p className="text-white/60 mb-8">Connect your Solana wallet to start rebalancing your portfolio</p>
            
            {/* Available Wallets */}
            {isClient && wallets.length > 0 && (
              <div className="mb-8">
                <p className="text-white/60 mb-4">Available wallets:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {wallets.map((wallet) => (
                    <button
                      key={wallet.adapter.name}
                      onClick={() => select(wallet.adapter.name)}
                      className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      {wallet.adapter.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {isClient ? 
              <WalletMultiButton className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200" />
              : <div className="bg-purple-600/50 text-white font-medium py-3 px-6 rounded-lg animate-pulse">Loading Wallets...</div>
            }
            
            {/* Troubleshooting */}
            <div className="mt-8 p-4 bg-white/5 rounded-lg max-w-md mx-auto">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div className="text-left">
                  <h3 className="text-white font-medium mb-2">Troubleshooting</h3>
                  <ul className="text-white/60 text-sm space-y-1">
                    <li>• Make sure Phantom wallet is installed</li>
                    <li>• Try refreshing the page</li>
                    <li>• Check if wallet is unlocked</li>
                    <li>• Switch to Devnet in your wallet</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Portfolio Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Your Portfolio
                </h2>
                <div className="flex items-center space-x-4">
                  {/* Currency Toggle */}
                  <div className="flex items-center bg-white/10 rounded-full p-1 text-sm">
                    <button onClick={() => setCurrency('USD')} className={`px-3 py-1 rounded-full transition-colors ${currency === 'USD' ? 'bg-purple-600' : ''}`}>USD</button>
                    <button onClick={() => setCurrency('INR')} className={`px-3 py-1 rounded-full transition-colors ${currency === 'INR' ? 'bg-purple-600' : ''}`}>INR</button>
                  </div>
                  <button onClick={fetchTokenData} disabled={isLoading} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : <RefreshCw className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Total Value */}
              <div className="mb-6">
                <p className="text-white/60 text-sm">Total Value</p>
                <p className="text-3xl font-bold">{formatCurrency(totalValue)}</p>
              </div>
              
              <div className="space-y-2">
                {isLoading && portfolio.length === 0 ? (
                  // Loading Skeleton
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                          <div>
                            <div className="h-4 w-12 bg-white/10 rounded"></div>
                            <div className="h-3 w-16 bg-white/10 rounded mt-1"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 w-16 bg-white/10 rounded"></div>
                          <div className="h-3 w-20 bg-white/10 rounded mt-1"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Token List
                  portfolio.map(token => (
                    <div key={token.mint} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <img src={token.logo} alt={token.name} className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="text-white font-medium">{token.symbol}</p>
                            <p className="text-white/60 text-sm">{token.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">{token.balance.toFixed(4)}</p>
                          <p className="text-white/60 text-sm">{formatCurrency(token.value)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <button 
                onClick={() => setShowJupiter(!showJupiter)}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
              >
                {showJupiter ? 'Hide Jupiter Integration' : 'Open Jupiter Integration'}
              </button>
            </div>

            {/* Jupiter Integration Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Jupiter Integration
              </h2>
              
              {showJupiter ? (
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Jupiter Terminal</h3>
                    <p className="text-white/60 mb-4">Access Jupiter&apos;s powerful swap aggregator directly from this app.</p>
                    <a 
                      href="https://terminal.jup.ag" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                    >
                      Open Jupiter Terminal
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Jupiter API</h3>
                    <p className="text-white/60 mb-4">Integrate Jupiter&apos;s swap API for programmatic trading.</p>
                    <a 
                      href="https://dev.jup.ag" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                    >
                      View API Docs
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <Zap className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60">Click &quot;Open Jupiter Integration&quot; to explore Jupiter features</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <p className="text-white/60 text-sm">
              Powered by Jupiter Protocol
            </p>
            <div className="flex space-x-4">
              <a href="https://jup.ag" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white text-sm transition-colors">
                Jupiter
              </a>
              <a href="https://dev.jup.ag" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white text-sm transition-colors">
                Docs
              </a>
              <a href="https://terminal.jup.ag" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white text-sm transition-colors">
                Terminal
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
