import { NextResponse } from 'next/server';

// This function handles GET requests to /api/jup-price
export async function GET(request: Request) {
  try {
    // Extract search params from the request URL
    const { searchParams } = new URL(request.url);
    
    // Get the 'ids' parameter from the query string
    const ids = searchParams.get('ids');

    if (!ids) {
      return NextResponse.json({ error: 'Missing token ids' }, { status: 400 });
    }

    // Forward the request to the Jupiter Price API
    const response = await fetch(`https://quote-api.jup.ag/v4/price?ids=${ids}`);

    // Check if the request to Jupiter's API was successful
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Failed to fetch price from Jupiter API: ${errorText}` }, { status: response.status });
    }

    // Parse the JSON data from the response
    const data = await response.json();

    // Return the data with a 200 status code
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Error in jup-price API route:', error);
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
} 