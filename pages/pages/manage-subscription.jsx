import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { UserContext } from '../_app';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';

export default function ManageSubscription() {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [canceling, setCanceling] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/pages/login?redirect=/pages/manage-subscription');
            return;
        }

        const fetchSubscription = async () => {
            try {
                const response = await fetch(`/api/get-subscription?email=${encodeURIComponent(user.email)}`);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    
                    if (response.status === 404) {
                        setSubscription(null);
                        setLoading(false);
                        return;
                    }
                    
                    throw new Error(errorData.error || 'Failed to fetch subscription');
                }
                
                const data = await response.json();
                console.log('Subscription data:', data);
                setSubscription(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching subscription:', error);
                setSubscription(null);
                setLoading(false);
            }
        };

        fetchSubscription();
    }, [user, router]);

    const handleCancelSubscription = async () => {
        setCanceling(true);
        try {
            const response = await fetch('/api/cancel-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: user.email,
                    subscriptionId: subscription.id 
                })
            });

            const result = await response.json();

            if (response.ok) {
                setSubscription({
                    ...subscription,
                    cancelAtPeriodEnd: true,
                    status: 'canceling'
                });
                setShowCancelModal(false);
                alert(result.message || 'Your subscription will be canceled at the end of the billing period.');
            } else {
                throw new Error(result.error || 'Failed to cancel subscription');
            }
        } catch (error) {
            console.error('Error canceling subscription:', error);
            alert('Failed to cancel subscription. Please try again.');
        }
        setCanceling(false);
    };

    const handleReactivate = async () => {
        try {
            const response = await fetch('/api/reactivate-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email })
            });

            const result = await response.json();

            if (response.ok) {
                setSubscription({
                    ...subscription,
                    cancelAtPeriodEnd: false,
                    status: 'active'
                });
                alert(result.message || 'Your subscription has been reactivated!');
            } else {
                throw new Error(result.error || 'Failed to reactivate subscription');
            }
        } catch (error) {
            console.error('Error reactivating subscription:', error);
            alert('Failed to reactivate subscription. Please try again.');
        }
    };

    const handleUpgrade = () => {
        router.push('/pages/subscription?plan=annual');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const formatMonthYear = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });
    };

    const getPlanName = () => {
        if (!subscription?.plan) return 'Unknown';
        return subscription.plan === 'monthly' ? 'Monthly' : 
               subscription.plan === 'annual' ? 'Annual' : 
               'Unknown';
    };

    const getStatusDisplay = () => {
        if (subscription?.status === 'expired') return 'Expired';
        if (subscription?.cancelAtPeriodEnd) return 'Canceling';
        return subscription?.status === 'active' ? 'Active' : subscription?.status || 'Unknown';
    };

    if (loading) {
        return (
            <div className="manage-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading your subscription...</p>
                </div>
                <style jsx>{`
                    .manage-container {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    }
                    .loading-spinner {
                        text-align: center;
                    }
                    .spinner {
                        width: 60px;
                        height: 60px;
                        border: 4px solid #e0e0e0;
                        border-top-color: #667eea;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 20px;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                    .loading-spinner p {
                        color: #666;
                        font-size: 16px;
                    }
                `}</style>
            </div>
        );
    }

    if (!subscription || subscription.status === 'expired') {
        return (
            <div className="manage-container">
                <div className="no-subscription">
                    <AutoAwesomeIcon style={{ fontSize: '64px', color: '#667eea', marginBottom: '20px' }} />
                    <h1>{subscription?.status === 'expired' ? 'Subscription Expired' : 'No Active Subscription'}</h1>
                    <p>You don't have an active Aurora Pro subscription.</p>
                    <Link href="/pages/subscription">
                        <button className="btn-primary">Subscribe to Aurora Pro</button>
                    </Link>
                    <Link href="/">
                        <button className="btn-secondary">Back to Home</button>
                    </Link>
                </div>
                <style jsx>{`
                    .manage-container {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    }
                    .no-subscription {
                        text-align: center;
                        padding: 60px 40px;
                        background: white;
                        border-radius: 20px;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                        max-width: 500px;
                    }
                    .no-subscription h1 {
                        font-size: 32px;
                        margin-bottom: 16px;
                        color: #1a1a1a;
                    }
                    .no-subscription p {
                        font-size: 18px;
                        color: #666;
                        margin-bottom: 32px;
                    }
                    .btn-primary, .btn-secondary {
                        width: 100%;
                        padding: 16px 32px;
                        border-radius: 12px;
                        font-size: 18px;
                        font-weight: 600;
                        cursor: pointer;
                        border: none;
                        margin-bottom: 12px;
                        transition: all 0.3s ease;
                    }
                    .btn-primary {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                    }
                    .btn-primary:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
                    }
                    .btn-secondary {
                        background: #f5f5f5;
                        color: #1a1a1a;
                    }
                    .btn-secondary:hover {
                        background: #e0e0e0;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <>
            <div className="manage-container">
                {/* Header */}
                <div className="page-header">
                    <div className="header-content">
                        <div className="header-left">
                            <AutoAwesomeIcon className="header-icon" />
                            <div>
                                <h1>Manage Subscription</h1>
                                <p>Control your Aurora Pro membership</p>
                            </div>
                        </div>
                        <Link href="/">
                            <button className="btn-back">Back to Home</button>
                        </Link>
                    </div>
                </div>

                <div className="content-wrapper">
                    {/* Cancellation Warning */}
                    {subscription?.cancelAtPeriodEnd && (
                        <div className="warning-banner">
                            <WarningAmberIcon />
                            <div>
                                <strong>Subscription Ending</strong>
                                <p>Your subscription will end on {formatDate(subscription.currentPeriodEnd)}. You'll lose access to all Aurora Pro benefits.</p>
                            </div>
                            <button onClick={handleReactivate} className="btn-reactivate">
                                Reactivate
                            </button>
                        </div>
                    )}

                    <div className="main-content">
                        {/* Subscription Card */}
                        <div className="card subscription-card">
                            <div className="card-header-section">
                                <h2>Current Plan</h2>
                                <div className={`status-badge ${subscription?.cancelAtPeriodEnd ? 'canceling' : subscription?.status}`}>
                                    {subscription?.status === 'active' && !subscription?.cancelAtPeriodEnd ? (
                                        <CheckCircleIcon fontSize="small" />
                                    ) : (
                                        <CancelIcon fontSize="small" />
                                    )}
                                    {getStatusDisplay()}
                                </div>
                            </div>

                            <div className="plan-info">
                                <div className="plan-type">
                                    <h3>Aurora Pro {getPlanName()}</h3>
                                    <div className="plan-price">
                                        <span className="amount">${subscription?.amount || '0.00'}</span>
                                        <span className="period">/{subscription?.period || 'month'}</span>
                                    </div>
                                </div>

                                {/* {subscription?.plan === 'monthly' && !subscription?.cancelAtPeriodEnd && (
                                    <div className="upgrade-notice">
                                        <InfoIcon fontSize="small" />
                                        <span>Save $20/year with annual plan</span>
                                        <button onClick={() => setShowUpgradeModal(true)} className="link-button">
                                            Upgrade →
                                        </button>
                                    </div>
                                )} */}
                            </div>

                            <div className="billing-info">
                                <div className="info-row">
                                    <span className="label">
                                        <CalendarTodayIcon fontSize="small" />
                                        Next billing date
                                    </span>
                                    <span className="value">
                                        {formatDate(subscription?.currentPeriodEnd)}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="label">
                                        <TrendingUpIcon fontSize="small" />
                                        Member since
                                    </span>
                                    <span className="value">
                                        {formatMonthYear(subscription?.currentPeriodStart)}
                                    </span>
                                </div>
                            </div>

                            {/* {!subscription?.cancelAtPeriodEnd && (
                                <div className="action-section">
                                    <button 
                                        onClick={() => setShowCancelModal(true)} 
                                        className="btn-cancel"
                                    >
                                        <CancelIcon />
                                        Cancel Subscription
                                    </button>
                                </div>
                            )} */}
                        </div>

                        {/* Benefits Card */}
                        <div className="card benefits-card">
                            <h2>Your Aurora Pro Benefits</h2>
                            <ul className="benefits-list">
                                <li>
                                    <CheckCircleIcon />
                                    <span>Free shipping on all orders</span>
                                </li>
                                <li>
                                    <CheckCircleIcon />
                                    <span>Unlimited AI virtual try-ons</span>
                                </li>
                                <li>
                                    <CheckCircleIcon />
                                    <span>24/7 AI fashion chatbot access</span>
                                </li>
                                <li>
                                    <CheckCircleIcon />
                                    <span>Early access to new collections</span>
                                </li>
                                <li>
                                    <CheckCircleIcon />
                                    <span>Priority customer support</span>
                                </li>
                                <li>
                                    <CheckCircleIcon />
                                    <span>Exclusive member-only deals</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Cancel Subscription?</h2>
                            <button onClick={() => setShowCancelModal(false)} className="modal-close">×</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to cancel your Aurora Pro subscription?</p>
                            <div className="cancel-info">
                                <WarningAmberIcon />
                                <div>
                                    <strong>You'll lose access to:</strong>
                                    <ul>
                                        <li>Free shipping on all orders</li>
                                        <li>AI virtual try-on feature</li>
                                        <li>AI fashion chatbot</li>
                                        <li>Early access to collections</li>
                                        <li>Priority support</li>
                                        <li>Exclusive member deals</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="cancel-note">
                                Your subscription will remain active until {formatDate(subscription?.currentPeriodEnd)}. You won't be charged again.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowCancelModal(false)} className="btn-secondary-modal">
                                Keep Subscription
                            </button>
                            <button 
                                onClick={handleCancelSubscription} 
                                className="btn-danger"
                                disabled={canceling}
                            >
                                {canceling ? 'Canceling...' : 'Yes, Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upgrade Modal */}
            {showUpgradeModal && (
                <div className="modal-overlay" onClick={() => setShowUpgradeModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Upgrade to Annual Plan</h2>
                            <button onClick={() => setShowUpgradeModal(false)} className="modal-close">×</button>
                        </div>
                        <div className="modal-body">
                            <div className="upgrade-comparison">
                                <div className="plan-option current">
                                    <h3>Monthly Plan</h3>
                                    <div className="price">$9.99/month</div>
                                    <p className="total">$119.88 per year</p>
                                </div>
                                <div className="arrow">→</div>
                                <div className="plan-option upgrade">
                                    <div className="badge">Save $20</div>
                                    <h3>Annual Plan</h3>
                                    <div className="price">$99.99/year</div>
                                    <p className="total savings">Save $20 per year</p>
                                </div>
                            </div>
                            <p className="upgrade-note">
                                You'll be redirected to complete the upgrade process. Your current plan will be prorated.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowUpgradeModal(false)} className="btn-secondary-modal">
                                Maybe Later
                            </button>
                            <button onClick={handleUpgrade} className="btn-primary-modal">
                                Upgrade Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                .manage-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    padding-bottom: 60px;
                }

                /* Header */
                .page-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 40px 20px;
                    color: white;
                }

                .header-content {
                    max-width: 1000px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 20px;
                }

                .header-left {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                }

                .header-icon {
                    font-size: 48px !important;
                }

                .page-header h1 {
                    font-size: 32px;
                    font-weight: 800;
                    margin: 0 0 8px 0;
                }

                .page-header p {
                    font-size: 16px;
                    margin: 0;
                    opacity: 0.9;
                }

                .btn-back {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: 2px solid white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-back:hover {
                    background: white;
                    color: #667eea;
                }

                /* Content */
                .content-wrapper {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 40px 20px;
                }

                .warning-banner {
                    background: #fff3cd;
                    border: 2px solid #ffc107;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 30px;
                    display: flex;
                    gap: 16px;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .warning-banner :global(svg) {
                    color: #ff9800;
                    font-size: 32px !important;
                    flex-shrink: 0;
                }

                .warning-banner strong {
                    display: block;
                    font-size: 16px;
                    color: #1a1a1a;
                    margin-bottom: 4px;
                }

                .warning-banner p {
                    font-size: 14px;
                    color: #666;
                    margin: 0;
                }

                .btn-reactivate {
                    margin-left: auto;
                    background: #4caf50;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.3s ease;
                }

                .btn-reactivate:hover {
                    background: #45a049;
                    transform: translateY(-2px);
                }

                .main-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                }

                /* Cards */
                .card {
                    background: white;
                    border-radius: 16px;
                    padding: 32px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                }

                .card h2 {
                    font-size: 20px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 0 0 24px 0;
                }

                .card-header-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }

                .card-header-section h2 {
                    margin: 0;
                }

                .status-badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 16px;
                    border-radius: 50px;
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .status-badge.active {
                    background: #e8f5e9;
                    color: #4caf50;
                }

                .status-badge.canceling {
                    background: #fff3cd;
                    color: #ff9800;
                }

                .status-badge.expired {
                    background: #ffebee;
                    color: #f44336;
                }

                /* Subscription Card */
                .plan-info {
                    margin-bottom: 24px;
                }

                .plan-type h3 {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 0 0 12px 0;
                }

                .plan-price {
                    display: flex;
                    align-items: baseline;
                    gap: 4px;
                }

                .amount {
                    font-size: 36px;
                    font-weight: 800;
                    color: #667eea;
                }

                .period {
                    font-size: 18px;
                    color: #666;
                }

                .upgrade-notice {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #e3f2fd;
                    padding: 12px 16px;
                    border-radius: 8px;
                    margin-top: 16px;
                    font-size: 14px;
                    color: #1976d2;
                }

                .link-button {
                    background: none;
                    border: none;
                    color: #1976d2;
                    font-weight: 600;
                    cursor: pointer;
                    text-decoration: underline;
                    font-size: 14px;
                }

                .billing-info {
                    border-top: 1px solid #e0e0e0;
                    padding-top: 24px;
                    margin-bottom: 24px;
                }

                .info-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                }

                .info-row .label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #666;
                    font-size: 14px;
                }

                .info-row .value {
                    font-weight: 600;
                    color: #1a1a1a;
                    font-size: 14px;
                }

                .action-section {
                    border-top: 1px solid #e0e0e0;
                    padding-top: 24px;
                }

                .btn-cancel {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 14px;
                    background: #fff;
                    border: 2px solid #f44336;
                    border-radius: 8px;
                    color: #f44336;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-cancel:hover {
                    background: #f44336;
                    color: white;
                }

                /* Benefits Card */
                .benefits-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .benefits-list li {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    padding: 14px 0;
                    border-bottom: 1px solid #e0e0e0;
                    font-size: 15px;
                    color: #1a1a1a;
                }

                .benefits-list li:last-child {
                    border-bottom: none;
                }

                .benefits-list :global(svg) {
                    color: #4caf50;
                    font-size: 20px !important;
                    flex-shrink: 0;
                }

                /* Modal */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }

                .modal {
                    background: white;
                    border-radius: 16px;
                    max-width: 600px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 24px 32px;
                    border-bottom: 1px solid #e0e0e0;
                }

                .modal-header h2 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 700;
                }

                .modal-close {
                    background: none;
                    border: none;
                    font-size: 32px;
                    color: #666;
                    cursor: pointer;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    line-height: 1;
                }

                .modal-close:hover {
                    background: #f0f0f0;
                }

                .modal-body {
                    padding: 32px;
                }

                .modal-body p {
                    font-size: 16px;
                    color: #666;
                    line-height: 1.6;
                    margin: 0 0 24px 0;
                }

                .cancel-info {
                    display: flex;
                    gap: 16px;
                    background: #fff3cd;
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 24px;
                }

                .cancel-info :global(svg) {
                    color: #ff9800;
                    font-size: 32px !important;
                    flex-shrink: 0;
                }

                .cancel-info strong {
                    display: block;
                    font-size: 16px;
                    color: #1a1a1a;
                    margin-bottom: 8px;
                }

                .cancel-info ul {
                    margin: 0;
                    padding-left: 20px;
                }

                .cancel-info li {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 4px;
                }

                .cancel-note {
                    font-size: 14px !important;
                    color: #666 !important;
                    background: #f8f9fa;
                    padding: 16px;
                    border-radius: 8px;
                    margin-bottom: 0 !important;
                }

                .upgrade-comparison {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    margin-bottom: 24px;
                }

                .plan-option {
                    flex: 1;
                    text-align: center;
                    padding: 24px;
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    position: relative;
                }

                .plan-option.upgrade {
                    border-color: #667eea;
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                }

                .badge {
                    position: absolute;
                    top: -12px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #4caf50;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 700;
                }

                .plan-option h3 {
                    font-size: 18px;
                    font-weight: 700;
                    margin: 0 0 12px 0;
                }

                .plan-option .price {
                    font-size: 28px;
                    font-weight: 800;
                    color: #667eea;
                    margin-bottom: 8px;
                }

                .plan-option .total {
                    font-size: 14px;
                    color: #666;
                    margin: 0;
                }

                .plan-option .savings {
                    color: #4caf50;
                    font-weight: 600;
                }

                .arrow {
                    font-size: 32px;
                    color: #667eea;
                    font-weight: 700;
                }

                .upgrade-note {
                    font-size: 14px !important;
                    color: #666 !important;
                    background: #f8f9fa;
                    padding: 16px;
                    border-radius: 8px;
                    margin-bottom: 0 !important;
                }

                .modal-footer {
                    display: flex;
                    gap: 12px;
                    padding: 24px 32px;
                    border-top: 1px solid #e0e0e0;
                }

                .btn-primary-modal,
                .btn-secondary-modal,
                .btn-danger {
                    flex: 1;
                    padding: 14px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                }

                .btn-primary-modal {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .btn-primary-modal:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }

                .btn-secondary-modal {
                    background: #f5f5f5;
                    color: #1a1a1a;
                }

                .btn-secondary-modal:hover {
                    background: #e0e0e0;
                }

                .btn-danger {
                    background: #f44336;
                    color: white;
                }

                .btn-danger:hover {
                    background: #d32f2f;
                }

                .btn-danger:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Responsive */
                @media (max-width: 991px) {
                    .main-content {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 767px) {
                    .page-header h1 {
                        font-size: 24px;
                    }

                    .header-left {
                        flex-direction: column;
                        gap: 12px;
                        text-align: center;
                    }

                    .card {
                        padding: 24px;
                    }

                    .warning-banner {
                        flex-direction: column;
                        text-align: center;
                    }

                    .btn-reactivate {
                        margin-left: 0;
                        width: 100%;
                    }

                    .upgrade-comparison {
                        flex-direction: column;
                    }

                    .arrow {
                        transform: rotate(90deg);
                    }

                    .modal-footer {
                        flex-direction: column;
                    }

                    .modal-body {
                        padding: 24px;
                    }

                    .modal-header {
                        padding: 20px 24px;
                    }
                }
            `}</style>
        </>
    );
}