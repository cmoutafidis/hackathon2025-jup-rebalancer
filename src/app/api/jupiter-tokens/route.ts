import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch all Jupiter supported tokens using the correct API endpoint
    const response = await fetch('https://token.jup.ag/strict');
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Failed to fetch tokens from Jupiter API: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Error in jupiter-tokens API route:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
} 