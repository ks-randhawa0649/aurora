import React from 'react';
import { Helmet } from 'react-helmet';
import { useRouter } from 'next/router';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ALink from '~/components/features/custom-link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StarIcon from '@mui/icons-material/Star';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChatIcon from '@mui/icons-material/Chat';

function AuroraPro() {
    const router = useRouter();

    // Handle subscription click
const handleSubscribe = (selectedPlan) => {
  const planDetails = {
    monthly: { amount: '9.99', period: 'month' },
    annual: { amount: '99.99', period: 'year' }
  };

  const details = planDetails[selectedPlan];
  
  router.push({
    pathname: '/pages/payment',
    query: {
      type: 'subscription',
      plan: selectedPlan,
      amount: details.amount,
      period: details.period,
      product: 'Aurora Pro'
    }
  });
};

    return (
        <main className="main aurora-pro-page">
            <Helmet>
                <title>Aurora Pro - Premium Membership | Aurora</title>
                <meta name="description" content="Join Aurora Pro for exclusive benefits including free shipping, AI virtual try-on, personalized fashion chatbot, early access to sales, and much more." />
            </Helmet>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <LazyLoadImage
                        src="/images/home/hero-bg.jpg"
                        alt="Aurora Pro"
                        effect="blur"
                        width="100%"
                        height="600"
                    />
                    <div className="hero-overlay"></div>
                </div>
                
                <div className="container hero-content">
                    <div className="hero-badge">
                        <StarIcon sx={{ fontSize: 20 }} />
                        <span>Exclusive Membership</span>
                    </div>
                    
                    <h1 className="hero-title">
                        Join <span className="gradient-text">Aurora Pro</span>
                    </h1>
                    
                    <p className="hero-subtitle">
                        Experience premium shopping with exclusive benefits, AI-powered features, and unmatched convenience
                    </p>
                    
                    <div className="hero-pricing">
                        <div className="price-tag">
                            <span className="price-amount">$9.99</span>
                            <span className="price-period">/month</span>
                        </div>
                        <span className="price-note">or $99/year (save 17%)</span>
                    </div>
                    
                    <div className="hero-cta">
                        <button 
                            onClick={() => handleSubscribe('monthly')} 
                            className="btn btn-primary btn-large"
                        >
                            Subscribe Now
                        </button>
                        <p className="cta-note">Cancel anytime • Money-back guarantee</p>
                    </div>
                </div>
            </section>

            {/* Key Benefits Section */}
            <section className="benefits-section">
                <div className="container">
                    <div className="section-header-center">
                        <span className="section-subtitle">Why Choose Pro?</span>
                        <h2 className="section-title">Unlock Premium Benefits</h2>
                        <p className="section-description">
                            Join thousands of members enjoying exclusive perks and AI-powered shopping
                        </p>
                    </div>

                    <div className="benefits-grid">
                        {/* Benefit 1 - Free Shipping */}
                        <div className="benefit-card featured">
                            <div className="benefit-icon">
                                <LocalShippingIcon sx={{ fontSize: 48 }} />
                            </div>
                            <h3>Free Shipping Forever</h3>
                            <p>Get free standard shipping on all orders, no minimum purchase required. Save an average of $120/year!</p>
                            <ul className="benefit-features">
                                <li><CheckCircleIcon /> Free on all orders</li>
                                <li><CheckCircleIcon /> No minimum purchase</li>
                                <li><CheckCircleIcon /> Express shipping discounts</li>
                            </ul>
                        </div>

                        {/* Benefit 2 - AI Virtual Try-On */}
                        <div className="benefit-card featured">
                            <div className="benefit-icon">
                                <AutoAwesomeIcon sx={{ fontSize: 48 }} />
                            </div>
                            <h3>AI Virtual Try-On</h3>
                            <p>See how clothes look on you before buying with our advanced AI technology. Shop with confidence!</p>
                            <ul className="benefit-features">
                                <li><CheckCircleIcon /> Unlimited virtual try-ons</li>
                                <li><CheckCircleIcon /> Instant results</li>
                                <li><CheckCircleIcon /> 100% private & secure</li>
                            </ul>
                        </div>

                        {/* Benefit 3 - AI Fashion Chatbot */}
                        <div className="benefit-card featured">
                            <div className="benefit-icon">
                                <SmartToyIcon sx={{ fontSize: 48 }} />
                            </div>
                            <h3>AI Fashion Stylist Chatbot</h3>
                            <p>Get personalized outfit recommendations, styling advice, and fashion trends from your AI-powered personal stylist 24/7!</p>
                            <ul className="benefit-features">
                                <li><CheckCircleIcon /> Personalized recommendations</li>
                                <li><CheckCircleIcon /> Instant styling advice</li>
                                <li><CheckCircleIcon /> Learns your preferences</li>
                            </ul>
                        </div>

                        {/* Benefit 4 - Early Access */}
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <FlashOnIcon sx={{ fontSize: 48 }} />
                            </div>
                            <h3>Early Access to Sales</h3>
                            <p>Shop new collections and sales 24 hours before everyone else. Never miss out on your favorite items!</p>
                        </div>

                        {/* Benefit 5 - Priority Support */}
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <SupportAgentIcon sx={{ fontSize: 48 }} />
                            </div>
                            <h3>Priority Customer Support</h3>
                            <p>Get dedicated support with faster response times and a personal shopping assistant.</p>
                        </div>

                        {/* Benefit 6 - Rewards */}
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <TrendingUpIcon sx={{ fontSize: 48 }} />
                            </div>
                            <h3>2x Reward Points</h3>
                            <p>Earn double points on every purchase and redeem for future discounts and exclusive perks.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Features Showcase - Combined Section */}
            <section className="ai-features-showcase">
                <div className="container">
                    <div className="section-header-center">
                        <span className="section-subtitle" style={{color:'white'}}>AI-Powered Shopping</span>
                        <h2 className="section-title">Your Personal AI Fashion Assistant</h2>
                        <p className="section-description">
                            Experience the future of shopping with our cutting-edge AI technology
                        </p>
                    </div>

                    {/* AI Virtual Try-On Feature */}
                    <div className="showcase-grid">
                        <div className="showcase-content">
                            <span className="showcase-badge">
                                <AutoAwesomeIcon sx={{ fontSize: 16 }} />
                                AI Virtual Try-On
                            </span>
                            <h2>Try Before You Buy with AI</h2>
                            <p>
                                Our revolutionary AI virtual try-on technology lets you see exactly how clothes will look on you. 
                                Upload your photo and instantly visualize any outfit - it's like having a virtual fitting room in your pocket!
                            </p>
                            
                            <div className="showcase-stats">
                                <div className="stat-item">
                                    <strong>95%</strong>
                                    <span>Accuracy Rate</span>
                                </div>
                                <div className="stat-item">
                                    <strong>20s</strong>
                                    <span>Processing Time</span>
                                </div>
                                <div className="stat-item">
                                    <strong>70%</strong>
                                    <span>Fewer Returns</span>
                                </div>
                            </div>

                            <div className="showcase-features">
                                <div className="feature-item">
                                    <CheckCircleIcon />
                                    <span>Realistic body mapping</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircleIcon />
                                    <span>Multiple outfit combinations</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircleIcon />
                                    <span>Share with friends for opinions</span>
                                </div>
                            </div>
                        </div>

                        <div className="showcase-visual">
                            <div className="tryon-demo">
                                <img src="/images/demo/tryon-before.png" alt="Before AI Try-on" />
                                <div className="demo-arrow">→</div>
                                <img src="/images/demo/tryon-after.png" alt="After AI Try-on" />
                            </div>
                        </div>
                    </div>

                    {/* AI Chatbot Feature */}
                    <div className="showcase-grid reverse">
                        <div className="showcase-visual">
                            <div className="chatbot-demo">
                                <div className="chat-window">
                                    <div className="chat-header">
                                        <SmartToyIcon />
                                        <span>Aurora AI Stylist</span>
                                        <div className="online-indicator"></div>
                                    </div>
                                    <div className="chat-messages">
                                        <div className="message bot">
                                            <div className="avatar">
                                                <SmartToyIcon />
                                            </div>
                                            <div className="message-content">
                                                Hi! I'm your personal AI fashion stylist. What style are you looking for today?
                                            </div>
                                        </div>
                                        <div className="message user">
                                            <div className="message-content">
                                                I need a casual outfit for a weekend brunch
                                            </div>
                                        </div>
                                        <div className="message bot">
                                            <div className="avatar">
                                                <SmartToyIcon />
                                            </div>
                                            <div className="message-content">
                                                Perfect! Based on your style preferences, I recommend pairing our linen shirt with chinos and white sneakers. Would you like to see these items?
                                            </div>
                                        </div>
                                        <div className="message bot">
                                            <div className="product-suggestions">
                                                <div className="mini-product">
                                                    <img src="/images/products/product-1.jpg" alt="Product" />
                                                    <span>Linen Shirt</span>
                                                </div>
                                                <div className="mini-product">
                                                    <img src="/images/products/product-2.jpg" alt="Product" />
                                                    <span>Chinos</span>
                                                </div>
                                                <div className="mini-product">
                                                    <img src="/images/products/product-3.jpg" alt="Product" />
                                                    <span>Sneakers</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="chat-input">
                                        <input type="text" placeholder="Ask me anything..." />
                                        <button><ChatIcon /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="showcase-content">
                            <span className="showcase-badge">
                                <SmartToyIcon sx={{ fontSize: 16 }} />
                                AI Fashion Chatbot
                            </span>
                            <h2>Your 24/7 Personal Stylist</h2>
                            <p>
                                Get instant fashion advice, personalized recommendations, and styling tips from our AI-powered chatbot. 
                                It learns your preferences, body type, and style to suggest perfect outfits every time!
                            </p>
                            
                            <div className="showcase-stats">
                                <div className="stat-item">
                                    <strong>24/7</strong>
                                    <span>Available</span>
                                </div>
                                <div className="stat-item">
                                    <strong>1000+</strong>
                                    <span>Style Combinations</span>
                                </div>
                                <div className="stat-item">
                                    <strong>Smart</strong>
                                    <span>Learning AI</span>
                                </div>
                            </div>

                            <div className="showcase-features">
                                <div className="feature-item">
                                    <CheckCircleIcon />
                                    <span>Personalized outfit suggestions</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircleIcon />
                                    <span>Style advice for any occasion</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircleIcon />
                                    <span>Trend alerts and updates</span>
                                </div>
                                <div className="feature-item">
                                    <CheckCircleIcon />
                                    <span>Wardrobe coordination help</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Plans */}
            <section className="pricing-section">
                <div className="container">
                    <div className="section-header-center">
                        <span className="section-subtitle">Choose Your Plan</span>
                        <h2 className="section-title">Simple, Transparent Pricing</h2>
                    </div>

                    <div className="pricing-cards">
                        {/* Monthly Plan */}
                        <div className="pricing-card">
                            <div className="plan-header">
                                <h3>Monthly</h3>
                                <div className="plan-price">
                                    <span className="price-symbol">$</span>
                                    <span className="price-amount">9.99</span>
                                    <span className="price-period">/month</span>
                                </div>
                                <p className="plan-description">Perfect for trying out Pro benefits</p>
                            </div>
                            <ul className="plan-features">
                                <li><CheckCircleIcon /> All Pro benefits</li>
                                <li><CheckCircleIcon /> AI Virtual Try-On</li>
                                <li><CheckCircleIcon /> AI Fashion Chatbot</li>
                                <li><CheckCircleIcon /> Free shipping</li>
                                <li><CheckCircleIcon /> Cancel anytime</li>
                            </ul>
                            <button 
                                onClick={() => handleSubscribe('monthly')} 
                                className="btn btn-outline"
                            >
                                Subscribe Monthly
                            </button>
                        </div>

                        {/* Annual Plan (Popular) */}
                        <div className="pricing-card popular">
                            <div className="popular-badge">Most Popular</div>
                            <div className="plan-header">
                                <h3>Annual</h3>
                                <div className="plan-price">
                                    <span className="price-symbol">$</span>
                                    <span className="price-amount">99</span>
                                    <span className="price-period">/year</span>
                                </div>
                                <div className="savings-badge">Save $20 (17% off)</div>
                                <p className="plan-description">Best value for committed shoppers</p>
                            </div>
                            <ul className="plan-features">
                                <li><CheckCircleIcon /> All Pro benefits</li>
                                <li><CheckCircleIcon /> AI Virtual Try-On</li>
                                <li><CheckCircleIcon /> AI Fashion Chatbot</li>
                                <li><CheckCircleIcon /> Free shipping</li>
                                <li><CheckCircleIcon /> 2 months free</li>
                                <li><CheckCircleIcon /> Exclusive annual perks</li>
                            </ul>
                            <button 
                                onClick={() => handleSubscribe('annual')} 
                                className="btn btn-primary"
                            >
                                Subscribe Annually
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section">
                <div className="container">
                    <div className="section-header-center">
                        <span className="section-subtitle">What Members Say</span>
                        <h2 className="section-title">Join Our Happy Community</h2>
                    </div>

                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="testimonial-rating">
                                {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} />)}
                            </div>
                            <p className="testimonial-text">
                                "The AI try-on feature is a game-changer! I can finally see how clothes look on my body type before buying. No more returns!"
                            </p>
                            <div className="testimonial-author">
                                <img src="/images/avatars/avatar1.jpg" alt="Sarah M." />
                                <div>
                                    <strong>Sarah M.</strong>
                                    <span>Pro Member since 2024</span>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <div className="testimonial-rating">
                                {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} />)}
                            </div>
                            <p className="testimonial-text">
                                "The AI chatbot is like having a personal stylist in my pocket! It always suggests outfits that match my style perfectly."
                            </p>
                            <div className="testimonial-author">
                                <img src="/images/avatars/avatar2.jpg" alt="James K." />
                                <div>
                                    <strong>James K.</strong>
                                    <span>Pro Member since 2023</span>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card">
                            <div className="testimonial-rating">
                                {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} />)}
                            </div>
                            <p className="testimonial-text">
                                "Free shipping alone pays for itself! Plus the early access to sales means I always get what I want. Worth every penny."
                            </p>
                            <div className="testimonial-author">
                                <img src="/images/avatars/avatar3.jpg" alt="Emily R." />
                                <div>
                                    <strong>Emily R.</strong>
                                    <span>Pro Member since 2024</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="container">
                    <div className="section-header-center">
                        <span className="section-subtitle">Got Questions?</span>
                        <h2 className="section-title">Frequently Asked Questions</h2>
                    </div>

                    <div className="faq-grid">
                        <div className="faq-item">
                            <h4>How does the subscription work?</h4>
                            <p>
                                Choose between monthly ($9.99/month) or annual ($99/year) plans. Your subscription automatically renews 
                                until you cancel. You can cancel anytime from your account settings.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h4>How does the AI Fashion Chatbot work?</h4>
                            <p>
                                Our AI chatbot learns your style preferences, body type, and fashion goals. Ask it anything - 
                                from outfit suggestions to styling tips. It gets smarter the more you use it!
                            </p>
                        </div>

                        <div className="faq-item">
                            <h4>Is the AI virtual try-on really accurate?</h4>
                            <p>
                                Yes! Our AI technology has a 95% accuracy rate and uses advanced body mapping. 
                                Your photos are processed securely and never stored permanently on our servers.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h4>Can I cancel my membership anytime?</h4>
                            <p>
                                Yes! You can cancel your Aurora Pro membership at any time from your account settings. 
                                You'll continue to have access until the end of your billing period.
                            </p>
                        </div>

                        <div className="faq-item">
                            <h4>How much can I save with free shipping?</h4>
                            <p>
                                Our standard shipping costs $8-15 per order. Pro members save an average of $120/year 
                                on shipping alone, making the membership pay for itself!
                            </p>
                        </div>

                        <div className="faq-item">
                            <h4>What makes the AI chatbot different from regular customer service?</h4>
                            <p>
                                Our AI chatbot provides personalized fashion advice based on YOUR unique style, body type, 
                                and preferences. It's available 24/7 and learns from every conversation to give better recommendations.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="final-cta">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Elevate Your Shopping Experience?</h2>
                        <p>Join Aurora Pro today and start enjoying AI-powered shopping</p>
                        <div className="cta-buttons">
                            <button 
                                onClick={() => handleSubscribe('monthly')} 
                                className="btn btn-primary btn-large"
                            >
                                Subscribe Now
                            </button>
                            <ALink href="/pages/contact-us" className="btn btn-outline btn-large">
                                Contact Sales
                            </ALink>
                        </div>
                        <p className="cta-guarantee">30-Day Money-Back Guarantee • Cancel Anytime</p>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .aurora-pro-page {
                    background: #fff;
                }

                /* Hero Section */
                .hero-section {
                    position: relative;
                    min-height: 600px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .hero-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                }

                .hero-background img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .hero-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
                }

                .hero-content {
                    position: relative;
                    z-index: 1;
                    text-align: center;
                    color: white;
                    padding: 80px 20px;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    padding: 8px 20px;
                    border-radius: 50px;
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 24px;
                }

                .hero-title {
                    font-size: 56px;
                    font-weight: 800;
                    line-height: 1.2;
                    margin: 0 0 24px 0;
                }

                .gradient-text {
                    background: linear-gradient(135deg, #fff 0%, #ffd700 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-subtitle {
                    font-size: 20px;
                    margin: 0 auto 40px auto;
                    max-width: 600px;
                    opacity: 0.95;
                    line-height: 1.6;
                }

                .hero-pricing {
                    margin-bottom: 40px;
                }

                .price-tag {
                    display: inline-flex;
                    align-items: baseline;
                    gap: 4px;
                    margin-bottom: 12px;
                }

                .price-amount {
                    font-size: 64px;
                    font-weight: 800;
                    line-height: 1;
                }

                .price-period {
                    font-size: 24px;
                    opacity: 0.8;
                }

                .price-note {
                    display: block;
                    font-size: 16px;
                    opacity: 0.9;
                }

                .hero-cta {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                }

                .btn-large {
                    padding: 18px 48px;
                    font-size: 18px;
                    font-weight: 700;
                    border-radius: 50px;
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                }

                .btn-large:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
                }

                .cta-note {
                    font-size: 14px;
                    opacity: 0.9;
                    margin: 0;
                }

                /* Benefits Section */
                .benefits-section {
                    padding: 100px 0;
                    background: linear-gradient(180deg, #f8f9fa 0%, #fff 100%);
                }

                .section-header-center {
                    text-align: center;
                    margin-bottom: 60px;
                }

                .section-subtitle {
                    display: block;
                    color: #667eea;
                    font-size: 14px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 12px;
                }

                .section-title {
                    font-size: 42px;
                    font-weight: 800;
                    color: #1a1a1a;
                    margin: 0 0 16px 0;
                }

                .section-description {
                    font-size: 18px;
                    color: white;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .benefits-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 30px;
                    margin-top: 60px;
                }

                .benefit-card {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                }

                .benefit-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15);
                    border-color: #667eea;
                }

                .benefit-card.featured {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .benefit-icon {
                    width: 80px;
                    height: 80px;
                    border-radius: 20px;
                    background: rgba(255, 255, 255, 0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 24px;
                }

                .benefit-card:not(.featured) .benefit-icon {
                    background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
                    color: #667eea;
                }

                .benefit-card h3 {
                    font-size: 24px;
                    font-weight: 700;
                    margin: 0 0 16px 0;
                }

                .benefit-card p {
                    font-size: 16px;
                    line-height: 1.7;
                    margin: 0 0 20px 0;
                    opacity: 0.9;
                }

                .benefit-features {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .benefit-features li {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                    font-size: 15px;
                }

                /* AI Features Showcase */
                .ai-features-showcase {
                    padding: 100px 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .showcase-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 80px;
                    align-items: center;
                    margin-bottom: 100px;
                }

                .showcase-grid:last-child {
                    margin-bottom: 0;
                }

                .showcase-grid.reverse {
                    direction: rtl;
                }

                .showcase-grid.reverse > * {
                    direction: ltr;
                }

                .showcase-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 8px 20px;
                    border-radius: 50px;
                    font-size: 13px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 20px;
                }

                .showcase-content h2 {
                    font-size: 42px;
                    font-weight: 800;
                    margin: 0 0 24px 0;
                }

                .showcase-content p {
                    font-size: 18px;
                    line-height: 1.8;
                    opacity: 0.95;
                    margin-bottom: 40px;
                }

                .showcase-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 30px;
                    margin-bottom: 40px;
                }

                .stat-item {
                    text-align: center;
                }

                .stat-item strong {
                    display: block;
                    font-size: 48px;
                    font-weight: 800;
                    margin-bottom: 8px;
                }

                .stat-item span {
                    font-size: 14px;
                    opacity: 0.9;
                }

                .showcase-features {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 16px;
                }

                .tryon-demo {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    gap: 20px;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    padding: 30px;
                    border-radius: 20px;
                }

                .tryon-demo img {
                    width: 100%;
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                }

                .demo-arrow {
                    font-size: 32px;
                    font-weight: bold;
                }

                /* Chatbot Demo */
                .chatbot-demo {
                    display: flex;
                    justify-content: center;
                }

                .chat-window {
                    width: 100%;
                    max-width: 450px;
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }

                .chat-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 600;
                }

                .online-indicator {
                    width: 10px;
                    height: 10px;
                    background: #4caf50;
                    border-radius: 50%;
                    margin-left: auto;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .chat-messages {
                    padding: 20px;
                    background: #f8f9fa;
                    min-height: 400px;
                    max-height: 400px;
                    overflow-y: auto;
                }

                .message {
                    margin-bottom: 20px;
                    display: flex;
                    gap: 12px;
                }

                .message.user {
                    flex-direction: row-reverse;
                }

                .message .avatar {
                    width: 36px;
                    height: 36px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    flex-shrink: 0;
                }

                .message-content {
                    background: white;
                    padding: 12px 16px;
                    border-radius: 16px;
                    color: #333;
                    max-width: 70%;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                }

                .message.user .message-content {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .product-suggestions {
                    display: flex;
                    gap: 12px;
                    padding: 12px;
                    background: white;
                    border-radius: 12px;
                    margin-top: 8px;
                }

                .mini-product {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    flex: 1;
                }

                .mini-product img {
                    width: 100%;
                    height: 80px;
                    object-fit: cover;
                    border-radius: 8px;
                }

                .mini-product span {
                    font-size: 12px;
                    color: #666;
                    text-align: center;
                }

                .chat-input {
                    padding: 16px;
                    background: white;
                    border-top: 1px solid #e0e0e0;
                    display: flex;
                    gap: 12px;
                }

                .chat-input input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid #e0e0e0;
                    border-radius: 24px;
                    font-size: 14px;
                    outline: none;
                }

                .chat-input button {
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .chat-input button:hover {
                    transform: scale(1.1);
                }

                /* Pricing Section */
                .pricing-section {
                    padding: 100px 0;
                    background: #f8f9fa;
                }

                .pricing-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 40px;
                    max-width: 900px;
                    margin: 0 auto;
                }

                .pricing-card {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    border: 2px solid #e0e0e0;
                    position: relative;
                    transition: all 0.3s ease;
                }

                .pricing-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
                }

                .pricing-card.popular {
                    border-color: #667eea;
                    transform: scale(1.05);
                }

                .pricing-card.popular:hover {
                    transform: scale(1.05) translateY(-8px);
                }

                .popular-badge {
                    position: absolute;
                    top: -16px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 8px 24px;
                    border-radius: 50px;
                    font-size: 13px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .plan-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 30px;
                    border-bottom: 2px solid #f0f0f0;
                }

                .plan-header h3 {
                    font-size: 24px;
                    font-weight: 700;
                    margin: 0 0 20px 0;
                }

                .plan-price {
                    display: flex;
                    align-items: baseline;
                    justify-content: center;
                    gap: 4px;
                    margin-bottom: 12px;
                }

                .price-symbol {
                    font-size: 24px;
                    font-weight: 600;
                }

                .savings-badge {
                    display: inline-block;
                    background: #4caf50;
                    color: white;
                    padding: 6px 16px;
                    border-radius: 50px;
                    font-size: 13px;
                    font-weight: 600;
                    margin-bottom: 12px;
                }

                .plan-description {
                    font-size: 15px;
                    color: #666;
                    margin: 0;
                }

                .plan-features {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 30px 0;
                }

                .plan-features li {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 0;
                    font-size: 15px;
                    color: #333;
                }

                .plan-features li svg {
                    color: #4caf50;
                    font-size: 20px;
                }

                .pricing-card .btn {
                    width: 100%;
                    padding: 14px 32px;
                    font-size: 16px;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                /* Testimonials */
                .testimonials-section {
                    padding: 100px 0;
                    background: white;
                }

                .testimonials-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 30px;
                }

                .testimonial-card {
                    background: #f8f9fa;
                    border-radius: 20px;
                    padding: 40px;
                }

                .testimonial-rating {
                    display: flex;
                    gap: 4px;
                    margin-bottom: 20px;
                    color: #ffc107;
                }

                .testimonial-text {
                    font-size: 16px;
                    line-height: 1.8;
                    color: #333;
                    margin: 0 0 24px 0;
                    font-style: italic;
                }

                .testimonial-author {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .testimonial-author img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .testimonial-author strong {
                    display: block;
                    font-size: 16px;
                    color: #1a1a1a;
                }

                .testimonial-author span {
                    display: block;
                    font-size: 14px;
                    color: #666;
                }

                /* FAQ Section */
                .faq-section {
                    padding: 100px 0;
                    background: #f8f9fa;
                }

                .faq-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 30px;
                }

                .faq-item {
                    background: white;
                    border-radius: 16px;
                    padding: 30px;
                }

                .faq-item h4 {
                    font-size: 18px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 0 0 16px 0;
                }

                .faq-item p {
                    font-size: 15px;
                    line-height: 1.7;
                    color: #666;
                    margin: 0;
                }

                /* Final CTA */
                .final-cta {
                    padding: 100px 0;
                    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                    color: white;
                }

                .cta-content {
                    text-align: center;
                    max-width: 700px;
                    margin: 0 auto;
                }

                .cta-content h2 {
                    font-size: 42px;
                    font-weight: 800;
                    margin: 0 0 20px 0;
                }

                .cta-content > p {
                    font-size: 20px;
                    opacity: 0.9;
                    margin: 0 0 40px 0;
                }

                .cta-buttons {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    margin-bottom: 24px;
                }

                .cta-guarantee {
                    font-size: 14px;
                    opacity: 0.8;
                    margin: 0;
                }

                /* Responsive */
                @media (max-width: 991px) {
                    .hero-title {
                        font-size: 42px;
                    }

                    .price-amount {
                        font-size: 48px;
                    }

                    .section-title {
                        font-size: 36px;
                    }

                    .showcase-grid {
                        grid-template-columns: 1fr;
                        gap: 50px;
                    }

                    .showcase-grid.reverse {
                        direction: ltr;
                    }

                    .showcase-stats {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                @media (max-width: 767px) {
                    .hero-title {
                        font-size: 32px;
                    }

                    .hero-subtitle {
                        font-size: 16px;
                    }

                    .section-title {
                        font-size: 28px;
                    }

                    .benefits-grid,
                    .pricing-cards,
                    .testimonials-grid,
                    .faq-grid {
                        grid-template-columns: 1fr;
                    }

                    .cta-buttons {
                        flex-direction: column;
                    }

                    .btn-large {
                        width: 100%;
                        justify-content: center;
                    }

                    .tryon-demo {
                        grid-template-columns: 1fr;
                    }

                    .demo-arrow {
                        transform: rotate(90deg);
                    }

                    .showcase-stats {
                        grid-template-columns: 1fr;
                    }

                    .chat-window {
                        max-width: 100%;
                    }
                }
            `}</style>
        </main>
    );
}

export default AuroraPro;