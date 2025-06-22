import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');

    if (!ids) {
      return NextResponse.json({ error: 'Missing token ids' }, { status: 400 });
    }

    // USDC mint address for price comparison
    const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
    const tokenAddresses = ids.split(',');
    
    const priceData: { [key: string]: { price: number } } = {};

    // Fetch prices for each token against USDC
    for (const tokenAddress of tokenAddresses) {
      try {
        const response = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${tokenAddress}&outputMint=${USDC_MINT}&amount=1000000&slippageBps=50`);
        
        if (response.ok) {
          const data = await response.json();
          // Calculate price: 1 token = X USDC
          const price = data.outAmount / data.inAmount;
          priceData[tokenAddress] = { price };
        } else {
          priceData[tokenAddress] = { price: 0 };
        }
      } catch {
        priceData[tokenAddress] = { price: 0 };
      }
    }

    return NextResponse.json({ data: priceData }, { status: 200 });

  } catch (err) {
    console.error('Error in jupiter-prices API route:', err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
} 