import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import ALink from '~/components/features/custom-link';
import { cartActions } from '~/store/cart';

function ReturnPage({ clearCart }) {
    const router = useRouter();
    const { session_id } = router.query;
    const [status, setStatus] = useState('loading');
    const [orderInfo, setOrderInfo] = useState(null);

    useEffect(() => {
        if (session_id) {
            verifyPaymentAndCreateOrder();
        }
    }, [session_id]);

    const verifyPaymentAndCreateOrder = async () => {
        try {
            // Get order data from sessionStorage
            const pendingOrder = sessionStorage.getItem('pendingOrder');
            
            if (!pendingOrder) {
                console.error('No pending order found');
                setStatus('error');
                return;
            }

            const orderData = JSON.parse(pendingOrder);

            // Step 1: Verify payment status with Stripe
            const verifyResponse = await fetch(`/api/verify-payment?session_id=${session_id}`);
            const session = await verifyResponse.json();

            console.log('Payment session:', session);

            if (session.payment_status === 'paid') {
                // Step 2: Create order in database
                const orderResponse = await fetch('/api/create_order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        customer: orderData.customer,
                        items: orderData.items,
                        pricing: orderData.pricing,
                        notes: orderData.notes,
                        payment: {
                            method: 'stripe',
                            transactionId: session.payment_intent,
                            stripeSessionId: session_id,
                            amount: session.amount_total / 100 // Convert from cents
                        }
                    })
                });

                const orderResult = await orderResponse.json();
                console.log('Order creation result:', orderResult);

                if (orderResult.success) {
                    setOrderInfo({
                        orderId: orderResult.orderId,
                        total: orderData.pricing.total,
                        email: orderData.customer.email,
                        customer: `${orderData.customer.firstName} ${orderData.customer.lastName}`
                    });
                    setStatus('success');
                    
                    // Clear cart and session storage
                    clearCart();
                    sessionStorage.removeItem('pendingOrder');
                } else {
                    console.error('Order creation failed:', orderResult.error);
                    setStatus('error');
                }
            } else {
                console.error('Payment not completed:', session.payment_status);
                setStatus('error');
            }
        } catch (error) {
            console.error('Error in payment verification/order creation:', error);
            setStatus('error');
        }
    };

    if (status === 'loading') {
        return (
            <main className="main">
                <Helmet>
                    <title>Processing Payment | SmartStyle</title>
                </Helmet>
                <div className="container mt-10 mb-10">
                    <div className="text-center">
                        <div className="loading-overlay">
                            <div className="bounce-loader">
                                <div className="bounce1"></div>
                                <div className="bounce2"></div>
                                <div className="bounce3"></div>
                            </div>
                        </div>
                        <h3 className="mt-5">Processing your payment...</h3>
                        <p>Please wait while we confirm your order.</p>
                    </div>
                </div>
            </main>
        );
    }

    if (status === 'error') {
        return (
            <main className="main">
                <Helmet>
                    <title>Payment Error | SmartStyle</title>
                </Helmet>
                <div className="container mt-10 mb-10">
                    <div className="text-center">
                        <i className="d-icon-times-circle" style={{ fontSize: '80px', color: '#dc3545' }}></i>
                        <h2 className="mt-4">Payment Failed</h2>
                        <p className="mb-5">There was an issue processing your payment or creating your order. Please contact support.</p>
                        <ALink href="/pages/checkout" className="btn btn-dark btn-rounded">
                            Return to Checkout
                        </ALink>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="main">
            <Helmet>
                <title>Order Confirmation | SmartStyle</title>
            </Helmet>

            <h1 className="d-none">Order Confirmation | SmartStyle</h1>

            <nav className="breadcrumb-nav">
                <div className="container">
                    <ul className="breadcrumb shop-breadcrumb">
                        <li><ALink href="/pages/cart"><i className="d-icon-bag"></i>Shopping Cart</ALink></li>
                        <li><ALink href="/pages/checkout"><i className="d-icon-arrow-right"></i>Checkout</ALink></li>
                        <li className="active"><ALink href="/pages/order"><i className="d-icon-arrow-right"></i>Order Complete</ALink></li>
                    </ul>
                </div>
            </nav>

            <div className="page-content mt-6 pb-2 mb-10">
                <div className="container">
                    <div className="order-message mr-auto ml-auto">
                        <div className="icon-box d-inline-flex align-items-center">
                            <div className="icon-box-icon mb-0">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="60" height="60" fill="#28a745">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                            <div className="icon-box-content text-left ml-3">
                                <h5 className="icon-box-title font-weight-bold ls-m">Thank you for your order!</h5>
                                <p className="ls-m mb-0">Your payment has been processed successfully.</p>
                            </div>
                        </div>
                    </div>

                    {orderInfo && (
                        <div className="order-results mt-5">
                            <div className="card shadow-sm">
                                <div className="card-body p-5">
                                    <h4 className="mb-4">Order Details</h4>
                                    <div className="row mb-3">
                                        <div className="col-6">
                                            <span className="text-muted">Order Number:</span>
                                        </div>
                                        <div className="col-6 text-right">
                                            <strong>{orderInfo.orderId}</strong>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-6">
                                            <span className="text-muted">Customer:</span>
                                        </div>
                                        <div className="col-6 text-right">
                                            <strong>{orderInfo.customer}</strong>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-6">
                                            <span className="text-muted">Email:</span>
                                        </div>
                                        <div className="col-6 text-right">
                                            <strong>{orderInfo.email}</strong>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-6">
                                            <span className="text-muted">Status:</span>
                                        </div>
                                        <div className="col-6 text-right">
                                            <span className="badge badge-success">Paid</span>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-6">
                                            <span className="text-muted">Total:</span>
                                        </div>
                                        <div className="col-6 text-right">
                                            <strong className="text-primary" style={{ fontSize: '24px' }}>
                                                ${orderInfo.total.toFixed(2)}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="text-center mt-5">
                        <p className="mb-4">
                            <i className="d-icon-envelope mr-2"></i>
                            A confirmation email has been sent to <strong>{orderInfo?.email}</strong>
                        </p>

                        <ALink href="/" className="btn btn-dark btn-rounded btn-lg">
                            <i className="d-icon-arrow-left mr-2"></i>
                            Continue Shopping
                        </ALink>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default connect(null, {
    clearCart: cartActions.clearCart
})(ReturnPage);