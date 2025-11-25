import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';

import ALink from '~/components/features/custom-link';
import Card from '~/components/features/accordion/card';

import { cartActions } from '~/store/cart';
import { toDecimal } from '~/utils';
import { UserContext } from '../_app';

function Checkout( props ) {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const { cartList } = props;
    const shippingPrice = 4.99;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        notes: ''
    });

    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Check authentication
        if (!user && !loading) {
            // Save current path to redirect back after login
            sessionStorage.setItem('redirectAfterLogin', '/pages/checkout');
            router.push('/pages/login');
        } else {
            setLoading(false);
        }

        // Redirect to cart if empty
        if (!cartList || cartList.length === 0) {
            router.push('/pages/cart');
        }
    }, [user, loading, router, cartList]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getPrice = (product) => {
        if (typeof product.price === 'number' && product.price > 0) {
            return product.price;
        }
        if (Array.isArray(product.price) && product.price.length > 0) {
            return product.price[0] || 0;
        }
        return 0;
    };

    const calculateSubtotal = () => {
        let total = 0;
        cartList.forEach(item => {
            const price = getPrice(item);
            total += price * item.qty;
        });
        return total;
    };

    const calculateShipping = () => {
        if(user && user.isPro) {
            return 0;
        }
        return 10.00;
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.08;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateShipping() + calculateTax();
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);

        try {
            // Prepare order data for Stripe
            const orderData = {
                customer: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address: {
                        street: formData.address,
                        city: formData.city,
                        state: formData.state,
                        zipCode: formData.zipCode,
                        country: formData.country
                    }
                },
                items: cartList.map(item => ({
                    product_id: item.id,
                    name: item.name,
                    slug: item.slug,
                    variant: item.variant || null,
                    quantity: item.qty,
                    price: getPrice(item),
                    subtotal: getPrice(item) * item.qty,
                    image: item.pictures?.[0]?.url || item.small_pictures?.[0]?.url || null
                })),
                pricing: {
                    subtotal: calculateSubtotal(),
                    shipping: calculateShipping(),
                    tax: calculateTax(),
                    total: calculateTotal()
                },
                notes: formData.notes
            };

            // Store order data in sessionStorage to retrieve after payment
            sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));

            // Redirect to payment page
        router.push({
            pathname: '/pages/payment',
            query: {
                amount: calculateTotal().toFixed(2)
            }
        });
        } catch (error) {
            console.error('Error preparing order:', error);
            alert('Error preparing order. Please try again.');
            setIsProcessing(false);
        }
    };

    if (loading || !user) {
        return (
            <div className="loading-overlay">
                <div className="bounce-loader">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                    <div className="bounce4"></div>
                </div>
            </div>
        );
    }

    if (!cartList || cartList.length === 0) {
        return null;
    }

    return (
        <div className="main checkout-modern">
            <Helmet>
                <title>Aurora | Checkout</title>
            </Helmet>

            <h1 className="d-none">Aurora - Checkout</h1>

            <div className="page-content pt-7 pb-10">
                <div className="container">
                    <div className="checkout-header">
                        <h1 className="checkout-title">
                            <span className="checkout-icon">💳</span>
                            Secure Checkout
                        </h1>
                        <div className="breadcrumb-steps">
                            <div className="step completed">
                                <span className="step-number">✓</span>
                                <span className="step-text">Cart</span>
                            </div>
                            <div className="step-divider"></div>
                            <div className="step active">
                                <span className="step-number">2</span>
                                <span className="step-text">Checkout</span>
                            </div>
                            <div className="step-divider"></div>
                            <div className="step">
                                <span className="step-number">3</span>
                                <span className="step-text">Complete</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-7">

                    <form onSubmit={handlePlaceOrder} className="checkout-form">
                        <div className="row">
                            <div className="col-lg-7 mb-6 mb-lg-0 pr-lg-4">
                                <div className="billing-details-card">
                                    <h3 className="section-title">
                                        <span className="title-icon">📋</span>
                                        Billing Details
                                    </h3>

                                <div className="row">
                                    <div className="col-xs-6">
                                        <div className="form-group-modern">
                                            <label>First Name *</label>
                                            <input 
                                                type="text" 
                                                className={`form-control-modern ${errors.firstName ? 'error' : ''}`}
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                placeholder="John"
                                                required 
                                            />
                                            {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                                        </div>
                                    </div>
                                    <div className="col-xs-6">
                                        <div className="form-group-modern">
                                            <label>Last Name *</label>
                                            <input 
                                                type="text" 
                                                className={`form-control-modern ${errors.lastName ? 'error' : ''}`}
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                placeholder="Doe"
                                                required 
                                            />
                                            {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group-modern">
                                    <label>Email Address *</label>
                                    <input 
                                        type="email" 
                                        className={`form-control-modern ${errors.email ? 'error' : ''}`}
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="john.doe@example.com"
                                        required 
                                    />
                                    {errors.email && <div className="error-message">{errors.email}</div>}
                                </div>

                                <div className="form-group-modern">
                                    <label>Phone *</label>
                                    <input 
                                        type="tel" 
                                        className={`form-control-modern ${errors.phone ? 'error' : ''}`}
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="(555) 123-4567"
                                        required 
                                    />
                                    {errors.phone && <div className="error-message">{errors.phone}</div>}
                                </div>

                                <div className="form-group-modern">
                                    <label>Street Address *</label>
                                    <input 
                                        type="text" 
                                        className={`form-control-modern ${errors.address ? 'error' : ''}`}
                                        name="address"
                                        placeholder="House number and street name"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                    {errors.address && <div className="error-message">{errors.address}</div>}
                                </div>

                                <div className="row">
                                    <div className="col-xs-6">
                                        <div className="form-group-modern">
                                            <label>Town / City *</label>
                                            <input 
                                                type="text" 
                                                className={`form-control-modern ${errors.city ? 'error' : ''}`}
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="New York"
                                                required 
                                            />
                                            {errors.city && <div className="error-message">{errors.city}</div>}
                                        </div>
                                    </div>
                                    <div className="col-xs-6">
                                        <div className="form-group-modern">
                                            <label>State *</label>
                                            <input 
                                                type="text" 
                                                className={`form-control-modern ${errors.state ? 'error' : ''}`}
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                placeholder="NY"
                                                required 
                                            />
                                            {errors.state && <div className="error-message">{errors.state}</div>}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-xs-6">
                                        <div className="form-group-modern">
                                            <label>Zip Code *</label>
                                            <input 
                                                type="text" 
                                                className={`form-control-modern ${errors.zipCode ? 'error' : ''}`}
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                placeholder="10001"
                                                required 
                                            />
                                            {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
                                        </div>
                                    </div>
                                    <div className="col-xs-6">
                                        <div className="form-group-modern">
                                            <label>Country *</label>
                                            <select 
                                                className="form-control-modern"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Canada">Canada</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group-modern">
                                    <label>Order Notes (Optional)</label>
                                    <textarea 
                                        className="form-control-modern" 
                                        rows="5"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        placeholder="Notes about your order, e.g. special notes for delivery"
                                    ></textarea>
                                </div>
                                </div>
                            </div>

                            <aside className="col-lg-5 sticky-sidebar-wrapper">
                                <div className="sticky-sidebar mt-1" data-sticky-options="{'bottom': 50}">
                                    <div className="order-summary-card">
                                        <h3 className="section-title">
                                            <span className="title-icon">📦</span>
                                            Your Order
                                        </h3>
                                        <div className="order-items">
                                            {cartList.map((item, index) => {
                                                const price = getPrice(item);
                                                const subtotal = price * item.qty;
                                                return (
                                                    <div key={index} className="order-item">
                                                        <div className="item-info">
                                                            <div className="item-name-qty">
                                                                <span className="item-name">{item.name}</span>
                                                                {item.variant && <span className="item-variant">({item.variant})</span>}
                                                                <span className="item-qty">× {item.qty}</span>
                                                            </div>
                                                        </div>
                                                        <div className="item-price">${toDecimal(subtotal)}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="order-totals">
                                            <div className="total-row">
                                                <span className="total-label">Subtotal</span>
                                                <span className="total-value">${toDecimal(calculateSubtotal())}</span>
                                            </div>
                                            <div className="total-row">
                                                {!user.isPro ? 
                                                <span className="total-label">Shipping (Join Aurora Pro for free shipping!)</span> 
                                                : <span className="total-label">Shipping (Aurora Pro!)</span> }
                                                <span className="total-value">${toDecimal(calculateShipping())}</span>
                                            </div>
                                            <div className="total-row">
                                                <span className="total-label">Tax (8%)</span>
                                                <span className="total-value">${toDecimal(calculateTax())}</span>
                                            </div>
                                        </div>

                                        <div className="grand-total">
                                            <span className="grand-total-label">Total</span>
                                            <span className="grand-total-value">${toDecimal(calculateTotal())}</span>
                                        </div>

                                        <button 
                                            type="submit" 
                                            className="payment-btn"
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <span className="spinner"></span>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <span>Proceed to Payment</span>
                                                    <i className="fas fa-lock"></i>
                                                </>
                                            )}
                                        </button>

                                        <div className="security-badges">
                                            <div className="security-badge">
                                                <i className="fas fa-shield-alt"></i>
                                                <span>SSL Secure</span>
                                            </div>
                                            <div className="security-badge">
                                                <i className="fas fa-credit-card"></i>
                                                <span>Safe Payment</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .checkout-modern {
                    background: #f8f9fa;
                    min-height: 100vh;
                }

                .checkout-header {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .checkout-title {
                    font-size: 42px;
                    font-weight: 800;
                    color: #222;
                    margin-bottom: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                }

                .checkout-icon {
                    font-size: 48px;
                }

                .breadcrumb-steps {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    opacity: 0.5;
                    transition: all 0.3s ease;
                }

                .step.active,
                .step.completed {
                    opacity: 1;
                }

                .step-number {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: #e0e0e0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 18px;
                    color: #666;
                    transition: all 0.3s ease;
                }

                .step.completed .step-number {
                    background: #22c55e;
                    color: white;
                }

                .step.active .step-number {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                }

                .step-text {
                    font-size: 14px;
                    font-weight: 600;
                    color: #666;
                }

                .step.active .step-text,
                .step.completed .step-text {
                    color: #222;
                }

                .step-divider {
                    width: 60px;
                    height: 2px;
                    background: #e0e0e0;
                    margin-bottom: 30px;
                }

                .checkout-form {
                    width: 100%;
                }

                .billing-details-card,
                .order-summary-card {
                    background: white;
                    border-radius: 24px;
                    padding: 32px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                }

                .section-title {
                    font-size: 24px;
                    font-weight: 800;
                    color: #222;
                    margin: 0 0 32px 0;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #f0f0f0;
                }

                .title-icon {
                    font-size: 28px;
                }

                .form-group-modern {
                    margin-bottom: 24px;
                }

                .form-group-modern label {
                    display: block;
                    font-size: 14px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 8px;
                }

                .form-control-modern {
                    width: 100%;
                    padding: 14px 18px;
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    font-size: 15px;
                    transition: all 0.3s ease;
                    background: white;
                }

                .form-control-modern:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
                }

                .form-control-modern.error {
                    border-color: #f5576c;
                }

                .form-control-modern::placeholder {
                    color: #999;
                }

                .error-message {
                    color: #f5576c;
                    font-size: 13px;
                    margin-top: 6px;
                    font-weight: 500;
                }

                .order-summary-card {
                    position: sticky;
                    top: 100px;
                }

                .order-items {
                    border-bottom: 2px solid #f0f0f0;
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                }

                .order-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 16px 0;
                    border-bottom: 1px solid #f5f5f5;
                }

                .order-item:last-child {
                    border-bottom: none;
                }

                .item-info {
                    flex: 1;
                }

                .item-name-qty {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .item-name {
                    font-size: 15px;
                    font-weight: 600;
                    color: #222;
                }

                .item-variant {
                    font-size: 13px;
                    color: #666;
                    font-style: italic;
                }

                .item-qty {
                    font-size: 13px;
                    color: #999;
                }

                .item-price {
                    font-size: 16px;
                    font-weight: 700;
                    color: #667eea;
                    margin-left: 16px;
                }

                .order-totals {
                    border-bottom: 2px solid #f0f0f0;
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                }

                .total-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 14px;
                }

                .total-label {
                    font-size: 15px;
                    color: #666;
                }

                .total-value {
                    font-size: 16px;
                    font-weight: 700;
                    color: #222;
                }

                .grand-total {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 24px 0;
                    margin-bottom: 24px;
                }

                .grand-total-label {
                    font-size: 20px;
                    font-weight: 800;
                    color: #222;
                }

                .grand-total-value {
                    font-size: 32px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .payment-btn {
                    width: 100%;
                    padding: 18px 28px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 16px;
                    color: white;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .payment-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
                }

                .payment-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .spinner {
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin-right: 10px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .security-badges {
                    display: flex;
                    justify-content: space-around;
                    gap: 16px;
                }

                .security-badge {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    font-size: 12px;
                    color: #666;
                    text-align: center;
                }

                .security-badge i {
                    font-size: 24px;
                    color: #667eea;
                }

                @media (max-width: 992px) {
                    .order-summary-card {
                        position: static;
                        margin-top: 32px;
                    }
                }

                @media (max-width: 768px) {
                    .checkout-title {
                        font-size: 32px;
                        flex-direction: column;
                        gap: 12px;
                    }

                    .checkout-icon {
                        font-size: 40px;
                    }

                    .breadcrumb-steps {
                        gap: 12px;
                    }

                    .step-number {
                        width: 40px;
                        height: 40px;
                        font-size: 16px;
                    }

                    .step-text {
                        font-size: 12px;
                    }

                    .step-divider {
                        width: 40px;
                    }

                    .billing-details-card,
                    .order-summary-card {
                        padding: 24px;
                    }

                    .section-title {
                        font-size: 20px;
                    }

                    .form-control-modern {
                        padding: 12px 16px;
                    }
                }
            `}</style>
        </div>
    )
}

function mapStateToProps( state ) {
    return {
        cartList: state.cart.data ? state.cart.data : []
    }
}

export default connect( mapStateToProps, { removeFromCart: cartActions.removeFromCart } )( Checkout );