import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import ALink from '~/components/features/custom-link';
import Quantity from '~/components/features/quantity';

import { cartActions } from '~/store/cart';
import { toDecimal, getTotalPrice } from '~/utils';
import { UserContext } from '../_app';

function Cart( props ) {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const { cartList, removeFromCart, updateCart } = props;
    const [ shippingCost, setShippingCost ] = useState( 0 );
    const [ cartItems, setCartItems ] = useState( [] );

    useEffect(() => {
        // Check authentication
        if (!user && !loading) {
            // Save current path to redirect back after login
            sessionStorage.setItem('redirectAfterLogin', '/pages/cart');
            router.push('/pages/login');
        } else {
            setLoading(false);
        }
    }, [user, loading, router]);

    useEffect( () => {
        setCartItems( [ ...cartList ] );
    }, [ cartList ] )

    function onChangeShipping( val ) {
        setShippingCost( val );
    }

    const getImageUrl = ( product ) => {
        if ( !product ) return '/images/placeholder.jpg';
        
        if ( product.pictures && Array.isArray( product.pictures ) && product.pictures.length > 0 ) {
            const pic = product.pictures[ 0 ];
            if ( pic && pic.url ) return pic.url;
        }
        
        if ( product.small_pictures && Array.isArray( product.small_pictures ) && product.small_pictures.length > 0 ) {
            const pic = product.small_pictures[ 0 ];
            if ( pic && pic.url ) return pic.url;
        }
        
        if ( product.image ) return product.image;
        
        return '/images/placeholder.jpg';
    };

    const getPrice = ( product ) => {
        if ( !product ) return 0;
        
        console.log('Getting price for product:', product);
        
        if ( typeof product.price === 'number' && product.price > 0 ) {
            console.log('Direct price:', product.price);
            return product.price;
        }
        
        if ( Array.isArray( product.price ) && product.price.length > 0 ) {
            console.log('Array price:', product.price[0]);
            return product.price[ 0 ] || 0;
        }
        
        console.log('No price found, returning 0');
        return 0;
    };

    function changeQty( value, index ) {
        setCartItems( cartItems.map( ( item, id ) => {
            if (id === index) {
                const itemPrice = getItemPrice(item);
                return { 
                    ...item, 
                    qty: value, 
                    sum: itemPrice * value 
                };
            }
            return item;
        } ) );
    }

    function updateCartItem() {
        updateCart( cartItems );
    }

    const onChangeQty = ( product, qty ) => {
        updateCart( product, qty );
    };

    const removeItem = ( product ) => {
        removeFromCart( product );
    };

    const calculateTotal = () => {
        let total = 0;
        cartList.forEach( item => {
            const price = getPrice( item );
            total += price * item.qty;
        } );
        return total;
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

    return (
        <div className="main cart-modern">
            <Helmet>
                <title>SmartStyle | Shopping Cart</title>
            </Helmet>

            <h1 className="d-none">SmartStyle - Cart</h1>

            <div className="page-content pt-7 pb-10">
                <div className="container">
                    <div className="cart-header">
                        <h1 className="cart-title">
                            <span className="cart-icon">🛒</span>
                            Shopping Cart
                            {cartList.length > 0 && (
                                <span className="cart-count-badge">{cartList.length} {cartList.length === 1 ? 'Item' : 'Items'}</span>
                            )}
                        </h1>
                        <div className="breadcrumb-steps">
                            <div className="step active">
                                <span className="step-number">1</span>
                                <span className="step-text">Cart</span>
                            </div>
                            <div className="step-divider"></div>
                            <div className="step">
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
                    {
                        cartList.length > 0 ?
                            <div className="row">
                                <div className="col-lg-8 col-md-12 pr-lg-4">
                                    <div className="cart-items-container">
                                        {
                                            cartList.map( ( item, index ) => {
                                                const imageUrl = getImageUrl( item );
                                                const price = getPrice( item );
                                                const subtotal = price * item.qty;

                                                return (
                                                    <div key={ `cart-item-${ index }` } className="cart-item-card">
                                                        <div className="item-image-section">
                                                            <ALink href={ `/product/default/${ item.slug }` }>
                                                                <div className="item-image-wrapper">
                                                                    <LazyLoadImage
                                                                        alt={ item.name }
                                                                        src={ imageUrl }
                                                                        width={ 120 }
                                                                        height={ 120 }
                                                                        effect="opacity"
                                                                        className="item-image"
                                                                        onError={ ( e ) => {
                                                                            e.target.src = '/images/placeholder.jpg';
                                                                        } }
                                                                    />
                                                                </div>
                                                            </ALink>
                                                        </div>

                                                        <div className="item-details-section">
                                                            <div className="item-header">
                                                                <div className="item-info">
                                                                    <h3 className="item-name">
                                                                        <ALink href={ `/product/default/${ item.slug }` }>
                                                                            { item.UI_pname }
                                                                        </ALink>
                                                                    </h3>
                                                                    {item.variant && (
                                                                        <div className="item-variant">
                                                                            <span className="variant-label">Variant:</span>
                                                                            <span className="variant-value">{ item.variant }</span>
                                                                        </div>
                                                                    )}
                                                                    {item.stock && item.stock < 10 && (
                                                                        <div className="stock-warning">
                                                                            ⚠️ Only {item.stock} left in stock
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <button 
                                                                    className="item-remove-btn" 
                                                                    onClick={ () => removeItem( item ) }
                                                                    title="Remove item"
                                                                >
                                                                    <i className="fas fa-trash-alt"></i>
                                                                </button>
                                                            </div>

                                                            <div className="item-actions">
                                                                <div className="price-section">
                                                                    <span className="price-label">Price</span>
                                                                    <span className="price-value">${ toDecimal( price ) }</span>
                                                                </div>

                                                                <div className="quantity-section">
                                                                    <span className="quantity-label">Quantity</span>
                                                                    <Quantity 
                                                                        qty={ item.qty } 
                                                                        max={ item.stock || 100 } 
                                                                        onChangeQty={ ( current ) => onChangeQty( item, current ) } 
                                                                    />
                                                                </div>

                                                                <div className="subtotal-section">
                                                                    <span className="subtotal-label">Subtotal</span>
                                                                    <span className="subtotal-value">${ toDecimal( subtotal ) }</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            } )
                                        }
                                        
                                        <div className="cart-actions-bar">
                                            <ALink href="/shop" className="continue-shopping-btn">
                                                <i className="fas fa-arrow-left"></i>
                                                Continue Shopping
                                            </ALink>
                                        </div>
                                    </div>
                                </div>

                                <aside className="col-lg-4 sticky-sidebar-wrapper">
                                    <div className="sticky-sidebar" data-sticky-options="{'bottom': 20}">
                                        <div className="cart-summary-card">
                                            <h3 className="summary-title">
                                                <span className="title-icon">💳</span>
                                                Order Summary
                                            </h3>
                                            
                                            <div className="summary-details">
                                                <div className="summary-row">
                                                    <span className="summary-label">Subtotal ({cartList.length} {cartList.length === 1 ? 'item' : 'items'})</span>
                                                    <span className="summary-value">${ toDecimal( calculateTotal() ) }</span>
                                                </div>
                                                <div className="summary-row">
                                                    <span className="summary-label">Shipping</span>
                                                    <span className="summary-value free">FREE</span>
                                                </div>
                                                <div className="summary-row">
                                                    <span className="summary-label">Tax</span>
                                                    <span className="summary-value">Calculated at checkout</span>
                                                </div>
                                            </div>

                                            <div className="promo-section">
                                                <div className="promo-input-wrapper">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Enter promo code" 
                                                        className="promo-input"
                                                    />
                                                    <button className="promo-apply-btn">Apply</button>
                                                </div>
                                            </div>

                                            <div className="summary-total-row">
                                                <span className="total-label">Total</span>
                                                <span className="total-value">${ toDecimal( calculateTotal() ) }</span>
                                            </div>

                                            <ALink href="/pages/checkout" className="checkout-btn">
                                                <button className="promo-apply-btn">Proceed to Checkout    <i className="fas fa-arrow-right"></i></button>            
                                            </ALink>

                                            <div className="trust-badges">
                                                <div className="trust-badge">
                                                    <i className="fas fa-shield-alt"></i>
                                                    <span>Secure Checkout</span>
                                                </div>
                                                <div className="trust-badge">
                                                    <i className="fas fa-undo"></i>
                                                    <span>Easy Returns</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                            :
                            <div className="empty-cart-container">
                                <div className="empty-cart-card">
                                    <div className="empty-icon">🛒</div>
                                    <h2 className="empty-title">Your Cart is Empty</h2>
                                    <p className="empty-message">Looks like you haven't added any items to your cart yet.</p>
                                    <ALink href="/shop" className="shop-now-btn">
                                        <i className="fas fa-shopping-bag"></i>
                                        Start Shopping
                                    </ALink>
                                    <div className="empty-features">
                                        <div className="empty-feature">
                                            <i className="fas fa-truck"></i>
                                            <span>Free Shipping</span>
                                        </div>
                                        <div className="empty-feature">
                                            <i className="fas fa-shield-alt"></i>
                                            <span>Secure Payment</span>
                                        </div>
                                        <div className="empty-feature">
                                            <i className="fas fa-headset"></i>
                                            <span>24/7 Support</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }
                    </div>
                </div>
            </div>

            <style jsx>{`
                .cart-modern {
                    background: #f8f9fa;
                    min-height: 100vh;
                }

                .cart-header {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .cart-title {
                    font-size: 42px;
                    font-weight: 800;
                    color: #222;
                    margin-bottom: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                }

                .cart-icon {
                    font-size: 48px;
                }

                .cart-count-badge {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 8px 20px;
                    border-radius: 24px;
                    font-size: 16px;
                    font-weight: 600;
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

                .step.active {
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

                .step.active .step-text {
                    color: #222;
                }

                .step-divider {
                    width: 60px;
                    height: 2px;
                    background: #e0e0e0;
                    margin-bottom: 30px;
                }

                .cart-items-container {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .cart-item-card {
                    background: white;
                    border-radius: 20px;
                    padding: 24px;
                    display: flex;
                    gap: 24px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                    transition: all 0.3s ease;
                }

                .cart-item-card:hover {
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                    transform: translateY(-2px);
                }

                .item-image-section {
                    flex-shrink: 0;
                }

                .item-image-wrapper {
                    width: 120px;
                    height: 120px;
                    border-radius: 16px;
                    overflow: hidden;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                }

                .item-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .cart-item-card:hover .item-image {
                    transform: scale(1.05);
                }

                .item-details-section {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .item-info {
                    flex: 1;
                }

                .item-name {
                    font-size: 18px;
                    font-weight: 700;
                    margin: 0 0 8px 0;
                }

                .item-name a {
                    color: #222;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .item-name a:hover {
                    color: #667eea;
                }

                .item-variant {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 8px;
                }

                .variant-label {
                    font-weight: 600;
                }

                .variant-value {
                    background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-weight: 600;
                    color: #26c;
                }

                .stock-warning {
                    font-size: 13px;
                    color: #f5576c;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .item-remove-btn {
                    background: #fff;
                    border: 2px solid #ffebee;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: #f5576c;
                }

                .item-remove-btn:hover {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    color: white;
                    border-color: #f5576c;
                    transform: rotate(90deg);
                }

                .item-actions {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 24px;
                    padding-top: 20px;
                    border-top: 2px solid #f0f0f0;
                }

                .price-section,
                .quantity-section,
                .subtotal-section {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .price-label,
                .quantity-label,
                .subtotal-label {
                    font-size: 12px;
                    font-weight: 600;
                    color: #999;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .price-value {
                    font-size: 18px;
                    font-weight: 700;
                    color: #666;
                }

                .subtotal-value {
                    font-size: 22px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .cart-actions-bar {
                    background: white;
                    border-radius: 20px;
                    padding: 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                }

                .continue-shopping-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 24px;
                    background: white;
                    border: 2px solid #667eea;
                    border-radius: 12px;
                    color: #667eea;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .continue-shopping-btn:hover {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    transform: translateX(-5px);
                }

                .cart-summary-card {
                    background: white;
                    border-radius: 24px;
                    padding: 32px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
                    position: sticky;
                    top: 100px;
                }

                .summary-title {
                    font-size: 24px;
                    font-weight: 800;
                    color: #222;
                    margin: 0 0 24px 0;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .title-icon {
                    font-size: 28px;
                }

                .summary-details {
                    border-bottom: 2px solid #f0f0f0;
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                }

                .summary-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .summary-label {
                    font-size: 15px;
                    color: #666;
                }

                .summary-value {
                    font-size: 16px;
                    font-weight: 700;
                    color: #222;
                }

                .summary-value.free {
                    color: #22c55e;
                }

                .promo-section {
                    margin-bottom: 24px;
                }

                .promo-input-wrapper {
                    display: flex;
                    gap: 8px;
                }

                .promo-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }

                .promo-input:focus {
                    outline: none;
                    border-color: #667eea;
                }

                .promo-apply-btn {
                    padding: 12px 24px;
                    background: white;
                    border: 2px solid #667eea;
                    border-radius: 12px;
                    color: #667eea;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .promo-apply-btn:hover {
                    background: #667eea;
                    color: white;
                }

                .summary-total-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 24px 0;
                    border-top: 2px solid #f0f0f0;
                    border-bottom: 2px solid #f0f0f0;
                    margin-bottom: 24px;
                }

                .total-label {
                    font-size: 20px;
                    font-weight: 800;
                    color: #222;
                }

                .total-value {
                    font-size: 32px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .checkout-btn {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    padding: 18px 28px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 16px;
                    color: white;
                    font-size: 16px;
                    font-weight: 700;
                    text-decoration: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
                    margin-bottom: 24px;
                }

                .checkout-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
                    color: white;
                }

                .trust-badges {
                    display: flex;
                    justify-content: space-around;
                    gap: 16px;
                }

                .trust-badge {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    font-size: 12px;
                    color: #666;
                    text-align: center;
                }

                .trust-badge i {
                    font-size: 24px;
                    color: #667eea;
                }

                .empty-cart-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 500px;
                }

                .empty-cart-card {
                    background: white;
                    border-radius: 24px;
                    padding: 60px 40px;
                    text-align: center;
                    max-width: 500px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
                }

                .empty-icon {
                    font-size: 80px;
                    margin-bottom: 24px;
                }

                .empty-title {
                    font-size: 32px;
                    font-weight: 800;
                    color: #222;
                    margin: 0 0 16px 0;
                }

                .empty-message {
                    font-size: 16px;
                    color: #666;
                    margin-bottom: 32px;
                }

                .shop-now-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 40px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 16px;
                    color: white;
                    font-size: 16px;
                    font-weight: 700;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
                    margin-bottom: 32px;
                }

                .shop-now-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
                    color: white;
                }

                .empty-features {
                    display: flex;
                    justify-content: center;
                    gap: 32px;
                    padding-top: 32px;
                    border-top: 2px solid #f0f0f0;
                }

                .empty-feature {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    color: #666;
                }

                .checkout-btn {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    padding: 18px 28px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 16px;
                    color: white;
                    font-size: 16px;
                    font-weight: 700;
                    text-decoration: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
                    margin-bottom: 40px; /* Increased from 24px to 32px */
                }

                .checkout-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
                    color: white;
                }

                .trust-badges {
                    display: flex;
                    justify-content: space-around;
                    gap: 24px; /* Increased from 16px to 24px */
                    padding-top: 20px; /* Added top padding */
                }

                .trust-badge {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px; /* Increased from 8px to 10px */
                    font-size: 12px;
                    color: #666;
                    text-align: center;
                }

                .trust-badge i {
                    font-size: 28px; /* Increased from 24px to 28px */
                    color: #667eea;
                }

                .trust-badge span {
                    font-weight: 600; /* Added for better visibility */
                }

                .empty-feature i {
                    font-size: 24px;
                    color: #667eea;
                }

                @media (max-width: 992px) {
                    .cart-summary-card {
                        position: static;
                        margin-top: 32px;
                    }
                }

                @media (max-width: 768px) {
                    .cart-title {
                        font-size: 32px;
                        flex-direction: column;
                        gap: 12px;
                    }

                    .cart-icon {
                        font-size: 40px;
                    }

                    .cart-count-badge {
                        font-size: 14px;
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

                    .cart-item-card {
                        flex-direction: column;
                        padding: 20px;
                    }

                    .item-image-wrapper {
                        width: 100%;
                        height: 200px;
                    }

                    .item-actions {
                        flex-direction: column;
                        align-items: stretch;
                        gap: 16px;
                    }

                    .price-section,
                    .quantity-section,
                    .subtotal-section {
                        flex-direction: row;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .cart-actions-bar {
                        flex-direction: column;
                        gap: 16px;
                    }

                    .continue-shopping-btn {
                        width: 100%;
                        justify-content: center;
                    }

                    .empty-cart-card {
                        padding: 40px 24px;
                    }

                    .empty-features {
                        flex-direction: column;
                        gap: 16px;
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

export default connect( mapStateToProps, { removeFromCart: cartActions.removeFromCart, updateCart: cartActions.updateCart } )( Cart );