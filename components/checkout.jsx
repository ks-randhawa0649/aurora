import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const router = useRouter();
  const { amount } = router.query;
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const pendingOrder = sessionStorage.getItem('pendingOrder');
    
    if (pendingOrder) {
      try {
        const data = JSON.parse(pendingOrder);
        setOrderData(data);
      } catch (error) {
        console.error('Error parsing order data:', error);
        router.push('/pages/cart');
      }
    } else {
      router.push('/pages/checkout');
    }
  }, []);

  const fetchClientSecret = async () => {
    if (!orderData) {
      throw new Error('No order data available');
    }

    const res = await fetch('/api/embedded-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount || orderData.pricing.total,
        customer: orderData.customer
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { client_secret } = await res.json();
    return client_secret;
  };

  if (!orderData || !amount) {
    return (
      <div className="container mt-10 mb-10">
        <div className="text-center">
          <div className="loading-overlay">
            <div className="bounce-loader">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </div>
          <p className="mt-3">Loading payment form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-10">
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <div id="checkout">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </div>
      </div>
    </div>
  );
}