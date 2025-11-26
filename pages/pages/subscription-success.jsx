import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StyleIcon from '@mui/icons-material/Style';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StarsIcon from '@mui/icons-material/Stars';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { UserContext } from '../_app';
export default function SubscriptionSuccess() {
    const router = useRouter();
    const { session_id } = router.query;
    const { user } = React.useContext(UserContext);
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showConfetti, setShowConfetti] = useState(true);

// Update the database save section in useEffect

useEffect(() => {
    if (!session_id) return;

    const fetchSessionData = async () => {
        try {
            const response = await fetch(`/api/verify-payment?session_id=${session_id}`);
            const data = await response.json();
            
            console.log('Session data:', data);
            
            const planType = data.metadata?.plan || 'monthly';
            const amount = ((data.amount_total || 0) / 100).toFixed(2);
            const period = data.metadata?.period || 'month';
            const customerEmail = user?.email || data.customer_details?.email || null;
            
            // Get Stripe subscription ID
            let stripeSubscriptionId = null;
            if (data.subscription) {
                stripeSubscriptionId = data.subscription;
            }
            
            // Save subscription to database
            if (customerEmail) {
                try {
                    await fetch('/api/update-subscription', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: customerEmail,
                            plan: planType,
                            session_id: session_id,
                            stripe_subscription_id: stripeSubscriptionId
                        })
                    });
                    console.log('Subscription saved to database');
                } catch (dbError) {
                    console.error('Failed to save subscription to database:', dbError);
                }
            }
            
            setSessionData({
                plan: planType.charAt(0).toUpperCase() + planType.slice(1),
                amount: amount,
                period: period.charAt(0).toUpperCase() + period.slice(1),
                status: data.payment_status,
                customerEmail: customerEmail
            });
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching session:', error);
            setLoading(false);
        }
    };

    fetchSessionData();
}, [session_id]);

    const features = [
        {
            icon: <LocalShippingIcon />,
            title: 'Free Shipping Forever',
            description: 'Enjoy unlimited free shipping on all orders, no minimum purchase required'
        },
        {
            icon: <SmartToyIcon />,
            title: 'AI Virtual Try-On',
            description: 'Try on clothes virtually with our advanced AI technology before buying'
        },
        {
            icon: <StyleIcon />,
            title: 'AI Fashion Chatbot',
            description: 'Get personalized style advice 24/7 from your AI fashion assistant'
        },
        {
            icon: <StarsIcon />,
            title: 'Early Sale Access',
            description: 'Shop new collections and sales 24 hours before everyone else'
        },
        {
            icon: <SupportAgentIcon />,
            title: 'Priority Support',
            description: 'Get fast-track customer service with dedicated priority support'
        },
        {
            icon: <EmojiEventsIcon />,
            title: '2x Reward Points',
            description: 'Earn double points on every purchase to redeem for exclusive rewards'
        }
    ];

    if (loading) {
        return (
            <div className="success-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading your subscription details...</p>
                </div>
                <style jsx>{`
                    .success-container {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }
                    .loading-spinner {
                        text-align: center;
                        color: white;
                    }
                    .spinner {
                        width: 60px;
                        height: 60px;
                        border: 4px solid rgba(255, 255, 255, 0.3);
                        border-top-color: white;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 20px;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    p {
                        font-size: 18px;
                        font-weight: 500;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <>
            {/* Custom Confetti */}
            {showConfetti && (
                <div className="confetti-container">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                backgroundColor: ['#667eea', '#764ba2', '#4caf50', '#ffd700', '#ff6b9d'][Math.floor(Math.random() * 5)]
                            }}
                        />
                    ))}
                </div>
            )}
            
            <div className="success-container">
                {/* Hero Section */}
                <div className="hero-section">
                    <div className="success-icon-wrapper">
                        <CheckCircleIcon className="success-icon" />
                    </div>
                    <h1 className="hero-title">
                        <AutoAwesomeIcon className="sparkle" />
                        Welcome to Aurora Pro!
                        <AutoAwesomeIcon className="sparkle" />
                    </h1>
                    <p className="hero-subtitle">
                        Your subscription is now active and ready to use
                    </p>
                    
                    {sessionData && (
                        <div className="subscription-card">
                            <div className="card-header">
                                <h3>Subscription Details</h3>
                            </div>
                            <div className="card-body">
                                <div className="detail-row">
                                    <span className="label">Plan:</span>
                                    <span className="value">Aurora Pro {sessionData.plan}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Amount:</span>
                                    <span className="value">${sessionData.amount}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Billing:</span>
                                    <span className="value">{sessionData.period}ly</span>
                                </div>
                                {sessionData.customerEmail && (
                                    <div className="detail-row">
                                        <span className="label">Email:</span>
                                        <span className="value">{sessionData.customerEmail}</span>
                                    </div>
                                )}
                                <div className="detail-row">
                                    <span className="label">Status:</span>
                                    <span className="value status-active">
                                        <CheckCircleIcon fontSize="small" /> {sessionData.status === 'paid' ? 'Active' : 'Processing'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="cta-buttons">
                        <Link href="/">
                            <button className="btn-primary">
                                Start Shopping
                            </button>
                        </Link>
                        <Link href="/pages/manage-subscription">
                            <button className="btn-secondary">
                                Manage Subscription
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Features Section */}
                <div className="features-section">
                    <h2 className="section-title">Your Aurora Pro Benefits</h2>
                    <p className="section-subtitle">
                        Unlock the full power of premium shopping with these exclusive features
                    </p>
                    
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">
                                    {feature.icon}
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Steps Section */}
                <div className="next-steps-section">
                    <h2 className="section-title">What's Next?</h2>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>Explore Collections</h3>
                            <p>Browse our latest arrivals and trending styles</p>
                            <Link href="/pages/home">
                                <a className="step-link">Shop Now →</a>
                            </Link>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3>Try AI Virtual Try-On</h3>
                            <p>See how clothes look on you before buying</p>
                            <Link href="/pages/ai-tryon">
                                <a className="step-link">Try Now →</a>
                            </Link>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>Chat with AI Stylist</h3>
                            <p>Get personalized fashion recommendations</p>
                            <Link href="/pages/ai-chat">
                                <a className="step-link">Start Chat →</a>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Email Confirmation */}
                <div className="email-notice">
                    <div className="notice-icon">📧</div>
                    <div className="notice-content">
                        <h3>Check Your Email</h3>
                        <p>We've sent a confirmation email with your subscription details and receipt{sessionData?.customerEmail ? ` to ${sessionData.customerEmail}` : ''}.</p>
                    </div>
                </div>

                <style jsx>{`
                    /* Confetti Animation */
                    .confetti-container {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                        z-index: 9999;
                        overflow: hidden;
                    }

                    .confetti {
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        top: -10px;
                        animation: confetti-fall 3s linear forwards;
                    }

                    @keyframes confetti-fall {
                        to {
                            transform: translateY(100vh) rotate(360deg);
                            opacity: 0;
                        }
                    }

                    .success-container {
                        min-height: 100vh;
                        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                        padding: 80px 20px 60px;
                    }

                    /* Hero Section */
                    .hero-section {
                        max-width: 800px;
                        margin: 0 auto 80px;
                        text-align: center;
                    }

                    .success-icon-wrapper {
                        margin-bottom: 30px;
                        animation: scaleIn 0.5s ease-out;
                    }

                    .success-icon {
                        font-size: 120px !important;
                        color: #4caf50;
                        filter: drop-shadow(0 8px 16px rgba(76, 175, 80, 0.3));
                    }

                    .hero-title {
                        font-size: 48px;
                        font-weight: 800;
                        color: #1a1a1a;
                        margin: 0 0 16px 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 16px;
                        animation: fadeInUp 0.6s ease-out 0.2s both;
                    }

                    .sparkle {
                        font-size: 40px !important;
                        color: #667eea;
                        animation: sparkle 2s ease-in-out infinite;
                    }

                    @keyframes sparkle {
                        0%, 100% { transform: scale(1) rotate(0deg); }
                        50% { transform: scale(1.2) rotate(180deg); }
                    }

                    .hero-subtitle {
                        font-size: 22px;
                        color: #666;
                        margin: 0 0 40px 0;
                        animation: fadeInUp 0.6s ease-out 0.3s both;
                    }

                    .subscription-card {
                        background: white;
                        border-radius: 20px;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                        margin-bottom: 40px;
                        animation: fadeInUp 0.6s ease-out 0.4s both;
                    }

                    .card-header {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        padding: 24px;
                        color: white;
                    }

                    .card-header h3 {
                        margin: 0;
                        font-size: 20px;
                        font-weight: 700;
                    }

                    .card-body {
                        padding: 32px;
                    }

                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 16px 0;
                        border-bottom: 1px solid #e0e0e0;
                    }

                    .detail-row:last-child {
                        border-bottom: none;
                    }

                    .label {
                        font-size: 16px;
                        color: #666;
                        font-weight: 500;
                    }

                    .value {
                        font-size: 16px;
                        color: #1a1a1a;
                        font-weight: 600;
                    }

                    .status-active {
                        color: #4caf50;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    }

                    .cta-buttons {
                        display: flex;
                        gap: 16px;
                        justify-content: center;
                        flex-wrap: wrap;
                        animation: fadeInUp 0.6s ease-out 0.5s both;
                    }

                    .btn-primary,
                    .btn-secondary {
                        padding: 16px 48px;
                        border-radius: 12px;
                        font-size: 18px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        border: none;
                    }

                    .btn-primary {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                    }

                    .btn-primary:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
                    }

                    .btn-secondary {
                        background: white;
                        color: #667eea;
                        border: 2px solid #667eea;
                    }

                    .btn-secondary:hover {
                        background: #667eea;
                        color: white;
                    }

                    /* Features Section */
                    .features-section {
                        max-width: 1200px;
                        margin: 0 auto 80px;
                        text-align: center;
                    }

                    .section-title {
                        font-size: 36px;
                        font-weight: 800;
                        color: #1a1a1a;
                        margin: 0 0 12px 0;
                    }

                    .section-subtitle {
                        font-size: 18px;
                        color: #666;
                        margin: 0 0 48px 0;
                    }

                    .features-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                        gap: 32px;
                    }

                    .feature-card {
                        background: white;
                        border-radius: 16px;
                        padding: 40px 32px;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                        transition: all 0.3s ease;
                    }

                    .feature-card:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
                    }

                    .feature-icon {
                        width: 80px;
                        height: 80px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-radius: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 24px;
                        color: white;
                    }

                    .feature-icon :global(svg) {
                        font-size: 40px !important;
                    }

                    .feature-card h3 {
                        font-size: 20px;
                        font-weight: 700;
                        color: #1a1a1a;
                        margin: 0 0 12px 0;
                    }

                    .feature-card p {
                        font-size: 15px;
                        color: #666;
                        margin: 0;
                        line-height: 1.6;
                    }

                    /* Next Steps Section */
                    .next-steps-section {
                        max-width: 1200px;
                        margin: 0 auto 80px;
                        text-align: center;
                    }

                    .steps-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 32px;
                        margin-top: 48px;
                    }

                    .step-card {
                        background: white;
                        border-radius: 16px;
                        padding: 40px 32px;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                        position: relative;
                        transition: all 0.3s ease;
                    }

                    .step-card:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
                    }

                    .step-number {
                        width: 60px;
                        height: 60px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 28px;
                        font-weight: 800;
                        color: white;
                        margin: 0 auto 24px;
                    }

                    .step-card h3 {
                        font-size: 22px;
                        font-weight: 700;
                        color: #1a1a1a;
                        margin: 0 0 12px 0;
                    }

                    .step-card p {
                        font-size: 15px;
                        color: #666;
                        margin: 0 0 20px 0;
                        line-height: 1.6;
                    }

                    .step-link {
                        display: inline-flex;
                        align-items: center;
                        color: #667eea;
                        font-weight: 600;
                        font-size: 16px;
                        text-decoration: none;
                        transition: all 0.3s ease;
                    }

                    .step-link:hover {
                        gap: 8px;
                    }

                    /* Email Notice */
                    .email-notice {
                        max-width: 600px;
                        margin: 0 auto;
                        background: white;
                        border-radius: 16px;
                        padding: 32px;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                        display: flex;
                        gap: 24px;
                        align-items: center;
                    }

                    .notice-icon {
                        font-size: 48px;
                        flex-shrink: 0;
                    }

                    .notice-content h3 {
                        font-size: 20px;
                        font-weight: 700;
                        color: #1a1a1a;
                        margin: 0 0 8px 0;
                    }

                    .notice-content p {
                        font-size: 15px;
                        color: #666;
                        margin: 0;
                        line-height: 1.6;
                    }

                    /* Animations */
                    @keyframes scaleIn {
                        from {
                            transform: scale(0);
                            opacity: 0;
                        }
                        to {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }

                    @keyframes fadeInUp {
                        from {
                            transform: translateY(30px);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }

                    /* Responsive */
                    @media (max-width: 768px) {
                        .hero-title {
                            font-size: 32px;
                        }

                        .hero-subtitle {
                            font-size: 18px;
                        }

                        .section-title {
                            font-size: 28px;
                        }

                        .cta-buttons {
                            flex-direction: column;
                        }

                        .btn-primary,
                        .btn-secondary {
                            width: 100%;
                        }

                        .features-grid,
                        .steps-grid {
                            grid-template-columns: 1fr;
                        }

                        .email-notice {
                            flex-direction: column;
                            text-align: center;
                        }
                    }
                `}</style>
            </div>
        </>
    );
}