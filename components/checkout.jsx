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
        customer: orderData.customer,
        type: orderData.type,
        period: orderData.period,
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
      <div className="payment-page">
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
              <div className="spinner-ring"></div>
            </div>
            <h3 className="loading-text">Preparing your secure checkout...</h3>
            <p className="loading-subtext">Please wait a moment</p>
          </div>
        </div>

        <style jsx>{`
          .payment-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
          }

          .loading-container {
            text-align: center;
            background: white;
            padding: 60px 40px;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }

          .loading-spinner {
            position: relative;
            width: 80px;
            height: 80px;
            margin: 0 auto 30px;
          }

          .spinner-ring {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 4px solid transparent;
            border-top-color: #667eea;
            border-radius: 50%;
            animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
          }

          .spinner-ring:nth-child(2) {
            border-top-color: #764ba2;
            animation-delay: 0.3s;
          }

          .spinner-ring:nth-child(3) {
            border-top-color: #f093fb;
            animation-delay: 0.6s;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .loading-text {
            font-size: 24px;
            font-weight: 700;
            color: #222;
            margin: 0 0 12px 0;
          }

          .loading-subtext {
            font-size: 16px;
            color: #666;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-header">
          <div className="header-content">
            <div className="thank-you-section">
              <h2 className="thank-you-title">Thank You for Shopping With Us!</h2>
              <p className="thank-you-subtitle">
                You're just one step away from completing your order
              </p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="payment-form-card">
              <div className="form-header">
                <h3 className="form-title">
                  <i className="fas fa-credit-card"></i>
                  Payment Information
                </h3>
                <p className="form-subtitle">Enter your payment details to complete your purchase</p>
              </div>

              <div id="checkout" className="stripe-checkout">
                <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>

              <div className="payment-footer">
                <div className="payment-methods">
                  <span className="methods-label">We Accept:</span>
                  <div className="methods-icons">
                    <i className="fab fa-cc-visa"></i>
                    <i className="fab fa-cc-mastercard"></i>
                    <i className="fab fa-cc-amex"></i>
                    <i className="fab fa-cc-discover"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="trust-section">
          <div className="trust-item">
            <i className="fas fa-undo-alt"></i>
            <h4>Easy Returns</h4>
            <p>30-day return policy</p>
          </div>
          <div className="trust-item">
            <i className="fas fa-shipping-fast"></i>
            <h4>Fast Shipping</h4>
            <p>Free delivery for Aurora Pro members</p>
          </div>
          <div className="trust-item">
            <i className="fas fa-headset"></i>
            <h4>24/7 Support</h4>
            <p>We're here to help anytime</p>
          </div>
          <div className="trust-item">
            <i className="fas fa-award"></i>
            <h4>Quality Guarantee</h4>
            <p>100% authentic products</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .payment-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px 80px;
        }

        .payment-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .header-content {
          background: white;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          max-width: 800px;
          margin: 0 auto;
        }

        .thank-you-section {
          padding: 20px 0;
        }

        .thank-you-title {
          font-size: 32px;
          font-weight: 800;
          color: #222;
          margin: 0 0 12px 0;
        }

        .thank-you-subtitle {
          font-size: 18px;
          color: #666;
          margin: 0;
        }

        .payment-form-card {
          background: white;
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .form-header {
          margin-bottom: 30px;
        }

        .form-title {
          font-size: 24px;
          font-weight: 800;
          color: #222;
          margin: 0 0 10px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .form-title i {
          color: #667eea;
        }

        .form-subtitle {
          font-size: 15px;
          color: #666;
          margin: 0;
        }

        .stripe-checkout {
          margin-bottom: 30px;
        }

        .payment-footer {
          padding-top: 20px;
          border-top: 2px solid #f0f0f0;
        }

        .payment-methods {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }

        .methods-label {
          font-size: 14px;
          font-weight: 600;
          color: #666;
        }

        .methods-icons {
          display: flex;
          gap: 15px;
        }

        .methods-icons i {
          font-size: 32px;
          color: #666;
        }

        .trust-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 50px;
        }

        .trust-item {
          background: white;
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .trust-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
        }

        .trust-item i {
          font-size: 40px;
          color: #667eea;
          margin-bottom: 15px;
        }

        .trust-item h4 {
          font-size: 18px;
          font-weight: 700;
          color: #222;
          margin: 0 0 8px 0;
        }

        .trust-item p {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        @media (max-width: 768px) {
          .payment-page {
            padding: 15px 10px 40px;
          }

          .payment-header {
            margin-bottom: 20px;
          }

          .header-content {
            padding: 20px 16px;
            border-radius: 16px;
          }

          .thank-you-section {
            padding: 10px 0;
          }

          .thank-you-title {
            font-size: 20px;
            margin-bottom: 8px;
          }

          .thank-you-subtitle {
            font-size: 14px;
          }

          .payment-form-card {
            padding: 16px;
            border-radius: 16px;
          }

          .form-header {
            margin-bottom: 20px;
          }

          .form-title {
            font-size: 18px;
            gap: 8px;
          }

          .form-subtitle {
            font-size: 13px;
          }

          .stripe-checkout {
            margin-bottom: 20px;
          }

          .payment-footer {
            padding-top: 16px;
          }

          .payment-methods {
            flex-direction: column;
            gap: 12px;
          }

          .methods-label {
            font-size: 13px;
          }

          .methods-icons {
            gap: 12px;
          }

          .methods-icons i {
            font-size: 24px;
          }

          .trust-section {
            grid-template-columns: 1fr;
            gap: 12px;
            margin-top: 30px;
          }

          .trust-item {
            padding: 20px;
            border-radius: 16px;
          }

          .trust-item i {
            font-size: 32px;
            margin-bottom: 10px;
          }

          .trust-item h4 {
            font-size: 16px;
            margin-bottom: 6px;
          }

          .trust-item p {
            font-size: 13px;
          }

          .loading-container {
            padding: 40px 24px;
            border-radius: 16px;
          }

          .loading-spinner {
            width: 60px;
            height: 60px;
            margin-bottom: 20px;
          }

          .loading-text {
            font-size: 18px;
          }

          .loading-subtext {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}