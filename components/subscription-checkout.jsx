import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import * as ga from '~/lib/analytics';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function SubscriptionCheckout() {
    const router = useRouter();
    
    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [planData, setPlanData] = useState(null);

    useEffect(() => {
        // Get query params from URL directly
        const urlParams = new URLSearchParams(window.location.search);
        const plan = urlParams.get('plan');
        const amount = urlParams.get('amount');
        const period = urlParams.get('period');
        const type = urlParams.get('type');

        console.log('URL Params:', { plan, amount, period, type });

        if (!plan || !amount || !period) {
            console.log('Missing required parameters');
            setError('Missing subscription details. Please go back and try again.');
            setLoading(false);
            return;
        }

        setPlanData({ plan, amount, period });
        
        // Track begin checkout
        ga.trackBeginCheckout({
            plan: plan,
            amount: parseFloat(amount),
            period: period
        });

        const createCheckoutSession = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log('Creating subscription session with:', { plan, amount, period });
                
                const requestBody = {
                    amount: amount,
                    type: 'subscription',
                    plan: plan,
                    period: period,
                };
                
                console.log('Request body:', JSON.stringify(requestBody, null, 2));
                
                const response = await fetch('/api/embedded-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                });

                console.log('Response status:', response.status);
                
                const data = await response.json();
                console.log('Response data:', data);
                
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to create checkout session');
                }

                if (!data.client_secret) {
                    throw new Error('No client secret received from server');
                }

                console.log('Session created successfully, client secret received');
                setClientSecret(data.client_secret);
                setLoading(false);
            } catch (err) {
                console.error('Error creating session:', err);
                setError(err.message || 'Failed to initialize checkout. Please try again.');
                setLoading(false);
            }
        };

        createCheckoutSession();
    }, []); // Empty dependency array - runs once on mount

    const options = clientSecret ? { clientSecret } : null;

    return (
        <div className="subscription-checkout-container">
            <div className="subscription-checkout-wrapper">
                {/* Left Side - Subscription Summary */}
                <div className="subscription-summary">
                    <div className="summary-header">
                        <AutoAwesomeIcon sx={{ fontSize: 32 }} />
                        <h2>Aurora Pro Subscription</h2>
                    </div>

                    {planData ? (
                        <>
                            <div className="plan-details">
                                <div className="plan-badge">
                                    {planData.plan === 'annual' ? '🎉 Best Value' : '📅 Monthly Plan'}
                                </div>
                                <h3>{planData.plan === 'annual' ? 'Annual Plan' : 'Monthly Plan'}</h3>
                                <div className="plan-price">
                                    <span className="price-amount">${planData.amount}</span>
                                    <span className="price-period">/{planData.period}</span>
                                </div>
                                {planData.plan === 'annual' && (
                                    <div className="savings-badge">
                                        Save $20 annually (17% off)
                                    </div>
                                )}
                            </div>

                            <div className="benefits-list">
                                <h4>What's Included:</h4>
                                <ul>
                                    <li>
                                        <CheckCircleIcon />
                                        <div>
                                            <strong>Free Shipping Forever</strong>
                                            <span>On all orders, no minimum</span>
                                        </div>
                                    </li>
                                    <li>
                                        <CheckCircleIcon />
                                        <div>
                                            <strong>AI Virtual Try-On</strong>
                                            <span>Unlimited virtual try-ons</span>
                                        </div>
                                    </li>
                                    <li>
                                        <CheckCircleIcon />
                                        <div>
                                            <strong>AI Fashion Chatbot</strong>
                                            <span>24/7 personal stylist</span>
                                        </div>
                                    </li>
                                    <li>
                                        <CheckCircleIcon />
                                        <div>
                                            <strong>Early Sale Access</strong>
                                            <span>Shop 24h before everyone</span>
                                        </div>
                                    </li>
                                    <li>
                                        <CheckCircleIcon />
                                        <div>
                                            <strong>Priority Support</strong>
                                            <span>Dedicated customer service</span>
                                        </div>
                                    </li>
                                    <li>
                                        <CheckCircleIcon />
                                        <div>
                                            <strong>2x Reward Points</strong>
                                            <span>Double points on purchases</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="guarantee-box">
                                <LockIcon />
                                <div>
                                    <strong>30-Day Money-Back Guarantee</strong>
                                    <p>Cancel anytime. No questions asked.</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="loading-summary">
                            <div className="spinner-small"></div>
                            <p>Loading plan details...</p>
                        </div>
                    )}
                </div>

                {/* Right Side - Stripe Checkout */}
                <div className="checkout-section">
                    {loading ? (
                        <div className="loading-container">
                            <div className="spinner-large"></div>
                            <p>Loading secure checkout...</p>
                        </div>
                    ) : error ? (
                        <div className="error-container">
                            <div className="error-icon">⚠️</div>
                            <h3>Something went wrong</h3>
                            <p>{error}</p>
                            <button onClick={() => router.push('/pages/aurora-pro')} className="btn-retry">
                                Go Back
                            </button>
                        </div>
                    ) : (
                        clientSecret && options ? (
                            <div className="stripe-embed-wrapper">
                                <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
                                    <EmbeddedCheckout />
                                </EmbeddedCheckoutProvider>
                            </div>
                        ) : (
                            <div className="loading-container">
                                <div className="spinner-large"></div>
                                <p>Initializing...</p>
                            </div>
                        )
                    )}
                </div>
            </div>

            <style jsx>{`
                .subscription-checkout-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    padding: 60px 20px;
                }

                .subscription-checkout-wrapper {
                    max-width: 1400px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 400px 1fr;
                    gap: 40px;
                }

                .subscription-summary {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    height: fit-content;
                    position: sticky;
                    top: 20px;
                }

                .summary-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 30px;
                    color: #667eea;
                }

                .summary-header h2 {
                    font-size: 24px;
                    font-weight: 800;
                    margin: 0;
                    color: #1a1a1a;
                }

                .loading-summary {
                    text-align: center;
                    padding: 40px 20px;
                }

                .spinner-small {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #f0f0f0;
                    border-top-color: #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 16px;
                }

                .loading-summary p {
                    font-size: 14px;
                    color: #666;
                    margin: 0;
                }

                .plan-details {
                    text-align: center;
                    padding: 30px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 16px;
                    color: white;
                    margin-bottom: 30px;
                }

                .plan-badge {
                    display: inline-block;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 6px 16px;
                    border-radius: 50px;
                    font-size: 13px;
                    font-weight: 600;
                    margin-bottom: 12px;
                }

                .plan-details h3 {
                    font-size: 22px;
                    font-weight: 700;
                    margin: 0 0 16px 0;
                }

                .plan-price {
                    display: flex;
                    align-items: baseline;
                    justify-content: center;
                    gap: 4px;
                    margin-bottom: 12px;
                }

                .price-amount {
                    font-size: 48px;
                    font-weight: 800;
                }

                .price-period {
                    font-size: 20px;
                    opacity: 0.9;
                }

                .savings-badge {
                    background: #4caf50;
                    padding: 8px 20px;
                    border-radius: 50px;
                    font-size: 14px;
                    font-weight: 600;
                    display: inline-block;
                }

                .benefits-list {
                    margin-bottom: 30px;
                }

                .benefits-list h4 {
                    font-size: 16px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 0 0 20px 0;
                }

                .benefits-list ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .benefits-list li {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 16px;
                    align-items: flex-start;
                }

                .benefits-list li :global(svg) {
                    color: #4caf50;
                    font-size: 24px;
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .benefits-list strong {
                    display: block;
                    font-size: 15px;
                    color: #1a1a1a;
                    margin-bottom: 2px;
                }

                .benefits-list span {
                    display: block;
                    font-size: 13px;
                    color: #666;
                }

                .guarantee-box {
                    display: flex;
                    gap: 16px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 12px;
                    border: 2px solid #e0e0e0;
                }

                .guarantee-box :global(svg) {
                    color: #667eea;
                    font-size: 28px;
                    flex-shrink: 0;
                }

                .guarantee-box strong {
                    display: block;
                    font-size: 15px;
                    color: #1a1a1a;
                    margin-bottom: 4px;
                }

                .guarantee-box p {
                    font-size: 13px;
                    color: #666;
                    margin: 0;
                }

                .checkout-section {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    min-height: 600px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .stripe-embed-wrapper {
                    width: 100%;
                }

                .loading-container,
                .error-container {
                    text-align: center;
                    padding: 60px 40px;
                }

                .spinner-large {
                    width: 60px;
                    height: 60px;
                    border: 4px solid #f0f0f0;
                    border-top-color: #667eea;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 24px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .loading-container p {
                    font-size: 16px;
                    color: #666;
                    margin: 0;
                }

                .error-container .error-icon {
                    font-size: 64px;
                    margin-bottom: 20px;
                }

                .error-container h3 {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 0 0 12px 0;
                }

                .error-container p {
                    font-size: 16px;
                    color: #666;
                    margin: 0 0 24px 0;
                    max-width: 500px;
                    word-wrap: break-word;
                }

                .btn-retry {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 12px 32px;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-retry:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                }

                @media (max-width: 991px) {
                    .subscription-checkout-wrapper {
                        grid-template-columns: 1fr;
                    }

                    .subscription-summary {
                        position: static;
                    }
                }

                @media (max-width: 767px) {
                    .subscription-checkout-container {
                        padding: 30px 15px;
                    }

                    .subscription-summary,
                    .checkout-section {
                        padding: 24px;
                    }

                    .plan-price .price-amount {
                        font-size: 36px;
                    }
                }
            `}</style>
        </div>
    );
}