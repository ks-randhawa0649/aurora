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
        <div className="main checkout">
            <Helmet>
                <title>Aurora | Checkout</title>
            </Helmet>

            <h1 className="d-none">Aurora - Checkout</h1>

            <nav className="breadcrumb-nav">
                <div className="container">
                    <ul className="breadcrumb shop-breadcrumb">
                        <li className="passed"><ALink href="/pages/cart"><i className="d-icon-bag"></i>Shopping Cart</ALink></li>
                        <li className="active"><ALink href="/pages/checkout"><i className="d-icon-arrow-right"></i>Checkout</ALink></li>
                        <li><ALink href="/pages/order"><i className="d-icon-arrow-right"></i>Order Complete</ALink></li>
                    </ul>
                </div>
            </nav>

            <div className="page-content pt-7 pb-10 mb-10">
                <div className="step-by pr-4 pl-4">
                    <h3 className="title title-simple title-step active"><ALink href="#">2. Checkout</ALink></h3>
                </div>

                <div className="container mt-8">
                    <div className="card accordion">
                        <Card title="
                            <div class='alert alert-light alert-primary alert-icon mb-4 card-header'>
                                <i class='fas fa-exclamation-circle'></i>
                                <span class='text-body'>Have a coupon?</span>
                                <a href='#' class='text-primary'>Click here to enter your code</a>
                            </div>" type="parse">

                            <div className="alert-body mb-4 collapsed">
                                <p>If you have a coupon code, please apply it below.</p>
                                <form className="check-coupon-box d-flex">
                                    <input type="text" name="coupon_code" className="input-text form-control text-grey ls-m mr-4"
                                        id="coupon_code" placeholder="Coupon code" />
                                    <button type="submit" className="btn btn-dark btn-rounded btn-outline">Apply Coupon</button>
                                </form>
                            </div>
                        </Card>
                    </div>

                    <form onSubmit={handlePlaceOrder} className="form">
                        <div className="row">
                            <div className="col-lg-7 mb-6 mb-lg-0 pr-lg-4">
                                <h3 className="title title-simple text-left text-uppercase">Billing Details</h3>

                                <div className="row">
                                    <div className="col-xs-6">
                                        <label>First Name *</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                        {errors.firstName && <div className="invalid-feedback d-block">{errors.firstName}</div>}
                                    </div>
                                    <div className="col-xs-6">
                                        <label>Last Name *</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                        {errors.lastName && <div className="invalid-feedback d-block">{errors.lastName}</div>}
                                    </div>
                                </div>

                                <label>Email Address *</label>
                                <input 
                                    type="email" 
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required 
                                />
                                {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}

                                <label>Phone *</label>
                                <input 
                                    type="tel" 
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required 
                                />
                                {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}

                                <label>Street Address *</label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                    name="address"
                                    placeholder="House number and street name"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required 
                                />
                                {errors.address && <div className="invalid-feedback d-block">{errors.address}</div>}

                                <div className="row">
                                    <div className="col-xs-6">
                                        <label>Town / City *</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                        {errors.city && <div className="invalid-feedback d-block">{errors.city}</div>}
                                    </div>
                                    <div className="col-xs-6">
                                        <label>State *</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                        {errors.state && <div className="invalid-feedback d-block">{errors.state}</div>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-xs-6">
                                        <label>Zip Code *</label>
                                        <input 
                                            type="text" 
                                            className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                        {errors.zipCode && <div className="invalid-feedback d-block">{errors.zipCode}</div>}
                                    </div>
                                    <div className="col-xs-6">
                                        <label>Country *</label>
                                        <select 
                                            className="form-control"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                        >
                                            <option value="United States">United States</option>
                                            <option value="Canada">Canada</option>
                                            <option value="United Kingdom">United Kingdom</option>
                                            <option value="Australia">Australia</option>
                                        </select>
                                    </div>
                                </div>

                                <label>Order Notes (Optional)</label>
                                <textarea 
                                    className="form-control pb-2 pt-2 mb-0" 
                                    cols="30" 
                                    rows="5"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Notes about your order, e.g. special notes for delivery"
                                ></textarea>
                            </div>

                            <aside className="col-lg-5 sticky-sidebar-wrapper">
                                <div className="sticky-sidebar mt-1" data-sticky-options="{'bottom': 50}">
                                    <div className="summary pt-5">
                                        <h3 className="title title-simple text-left text-uppercase">Your Order</h3>
                                        <table className="order-table">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cartList.map((item, index) => {
                                                    const price = getPrice(item);
                                                    const subtotal = price * item.qty;
                                                    return (
                                                        <tr key={index}>
                                                            <td className="product-name">
                                                                {item.name} 
                                                                {item.variant && <span className="product-quantity"> ({item.variant})</span>}
                                                                <span className="product-quantity"> × {item.qty}</span>
                                                            </td>
                                                            <td className="product-total text-body">${toDecimal(subtotal)}</td>
                                                        </tr>
                                                    );
                                                })}
                                                <tr className="summary-subtotal">
                                                    <td>
                                                        <h4 className="summary-subtitle">Subtotal</h4>
                                                    </td>
                                                    <td className="summary-subtotal-price pb-0 pt-0">
                                                        ${toDecimal(calculateSubtotal())}
                                                    </td>
                                                </tr>
                                                <tr className="summary-subtotal">
                                                    <td>
                                                        <h4 className="summary-subtitle">Shipping</h4>
                                                    </td>
                                                    <td className="summary-subtotal-price pb-0 pt-0">
                                                        ${toDecimal(calculateShipping())}
                                                    </td>
                                                </tr>
                                                <tr className="summary-subtotal">
                                                    <td>
                                                        <h4 className="summary-subtitle">Tax</h4>
                                                    </td>
                                                    <td className="summary-subtotal-price pb-0 pt-0">
                                                        ${toDecimal(calculateTax())}
                                                    </td>
                                                </tr>
                                                <tr className="summary-total">
                                                    <td className="pb-0">
                                                        <h4 className="summary-subtitle">Total</h4>
                                                    </td>
                                                    <td className="pt-0 pb-0">
                                                        <p className="summary-total-price ls-s text-primary">
                                                            ${toDecimal(calculateTotal())}
                                                        </p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <button 
                                            type="submit" 
                                            className="btn btn-dark btn-rounded btn-order"
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                                        </button>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

function mapStateToProps( state ) {
    return {
        cartList: state.cart.data ? state.cart.data : []
    }
}

export default connect( mapStateToProps, { removeFromCart: cartActions.removeFromCart } )( Checkout );