'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo } from 'react';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(() => {
    const heliusApiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
    if (!heliusApiKey) {
      throw new Error("Helius API key is not defined. Please add NEXT_PUBLIC_HELIUS_API_KEY to your .env.local file.");
    }
    return `https://mainnet.helius-rpc.com/?api-key=${heliusApiKey}`;
  }, []);
  
  // Use only the most stable wallet adapters
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter()
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
} 