import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Validate Stripe key is present
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not set in environment variables');
  throw new Error('Stripe is not configured. Please check environment variables.');
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-07-29.dahlia',
  typescript: true,
});

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();

    // Validate amount
    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum is $1.' },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'SnakeSOS Donation',
              description: 'Support snake rescue operations in Rupandehi District',
              images: ['https://snakesos.org/logo.png'], // Update with actual logo URL
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4200'}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4200'}/donate?canceled=true`,
      metadata: {
        purpose: 'donation',
        organization: 'Butwal Snake Rescuers',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
