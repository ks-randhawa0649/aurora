import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import ALink from '~/components/features/custom-link';
import Quantity from '~/components/features/quantity';

import { cartActions } from '~/store/cart';
import { toDecimal } from '~/utils';
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

    function getItemPrice(item) {
        // Handle different price structures
        if (item.sale_price && typeof item.sale_price === 'number') {
            return item.sale_price;
        }
        if (typeof item.price === 'number') {
            return item.price;
        }
        if (Array.isArray(item.price) && item.price.length > 0) {
            return item.price[0];
        }
        return 0;
    }

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
        <div className="main cart">
            <Helmet>
                <title>SmartStyle | Shopping Cart</title>
            </Helmet>

            <h1 className="d-none">SmartStyle - Cart</h1>

            <nav className="breadcrumb-nav">
                <div className="container">
                    <ul className="breadcrumb shop-breadcrumb">
                        <li className="active"><ALink href="/pages/cart"><i className="d-icon-bag"></i>Shopping Cart</ALink></li>
                        <li><ALink href="/pages/checkout"><i className="d-icon-arrow-right"></i>Checkout</ALink></li>
                        <li><ALink href="/pages/order"><i className="d-icon-arrow-right"></i>Order Complete</ALink></li>
                    </ul>
                </div>
            </nav>

            <div className="page-content pt-7 pb-10">
                <div className="step-by pr-4 pl-4">
                    <h3 className="title title-simple title-step"><ALink href="/pages/cart">1. Shopping Cart</ALink></h3>
                </div>

                <div className="container mt-7 mb-2">
                    <div className="row">
                        {
                            cartItems.length > 0 ?
                                <>
                                    <div className="col-lg-8 col-md-12 pr-lg-4">
                                        <table className="shop-table cart-table">
                                            <thead>
                                                <tr>
                                                    <th><span>Product</span></th>
                                                    <th></th>
                                                    <th><span>Price</span></th>
                                                    <th><span>Quantity</span></th>
                                                    <th>Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    cartItems.map( ( item, index ) => {
                                                        const itemPrice = getItemPrice(item);
                                                        const imageUrl = item.pictures && item.pictures[0] 
                                                            ? (item.pictures[0].url || item.pictures[0]) 
                                                            : '/images/placeholder.jpg';
                                                        
                                                        return (
                                                            <tr key={ 'cart-item' + index }>
                                                                <td className="product-thumbnail">
                                                                    <figure>
                                                                        <ALink href={ '/product/default/' + item.slug }>
                                                                            <img 
                                                                                src={ imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}` } 
                                                                                width="100" 
                                                                                height="100"
                                                                                alt={ item.name || "product" }
                                                                                onError={(e) => {
                                                                                    e.target.src = '/images/placeholder.jpg';
                                                                                }}
                                                                            />
                                                                        </ALink>
                                                                    </figure>
                                                                </td>
                                                                <td className="product-name">
                                                                    <div className="product-name-section">
                                                                        <ALink href={ '/product/default/' + item.slug }>{ item.name }</ALink>
                                                                    </div>
                                                                </td>
                                                                <td className="product-subtotal">
                                                                    <span className="amount">${ toDecimal( itemPrice ) }</span>
                                                                </td>
                                                                <td className="product-quantity">
                                                                    <Quantity 
                                                                        qty={ item.qty || 1 } 
                                                                        max={ item.stock || 100 } 
                                                                        onChangeQty={ qty => changeQty( qty, index ) } 
                                                                    />
                                                                </td>
                                                                <td className="product-price">
                                                                    <span className="amount">${ toDecimal( item.sum || (itemPrice * (item.qty || 1)) ) }</span>
                                                                </td>
                                                                <td className="product-close">
                                                                    <ALink href="#" className="product-remove" title="Remove this product" onClick={ () => removeFromCart( item ) }>
                                                                        <i className="fas fa-times"></i>
                                                                    </ALink>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        <div className="cart-actions mb-6 pt-4">
                                            <ALink href="/pages/shop" className="btn btn-dim btn-rounded btn-icon-left mr-4 mb-4"><i className="d-icon-arrow-left"></i>Continue Shopping</ALink>
                                            <button type="submit" className="btn btn-rounded btn-dark btn-icon-right mb-4" onClick={ updateCartItem }>Update Cart<i className="d-icon-arrow-right"></i></button>
                                        </div>
                                    </div>
                                    <aside className="col-lg-4 sticky-sidebar-wrapper">
                                        <div className="sticky-sidebar" data-sticky-options="{'bottom': 20}">
                                            <div className="summary mb-4">
                                                <h3 className="summary-title text-left">Cart Totals</h3>
                                                <table className="shipping">
                                                    <tbody>
                                                        <tr className="summary-subtotal">
                                                            <td>
                                                                <h4 className="summary-subtitle">Subtotal</h4>
                                                            </td>
                                                            <td>
                                                                <p className="summary-subtotal-price">
                                                                    ${ toDecimal( cartItems.reduce( ( acc, cur ) => {
                                                                        const price = getItemPrice(cur);
                                                                        const qty = cur.qty || 1;
                                                                        return acc + (cur.sum || (price * qty));
                                                                    }, 0 ) ) }
                                                                </p>
                                                            </td>
                                                        </tr>
                                                        <tr className="sumnary-shipping shipping-row-last">
                                                            <td colSpan="2">
                                                                <h4 className="summary-subtitle">Calculate Shipping</h4>

                                                                <ul>
                                                                    <li>
                                                                        <div className="custom-radio">
                                                                            <input type="radio" id="flat_rate" name="shipping" className="custom-control-input" onChange={ () => onChangeShipping( 5 ) } defaultChecked />
                                                                            <label className="custom-control-label" htmlFor="flat_rate">Flat rate</label>
                                                                        </div>
                                                                    </li>

                                                                    <li>
                                                                        <div className="custom-radio">
                                                                            <input type="radio" id="free-shipping" name="shipping" className="custom-control-input" onChange={ () => onChangeShipping( 0 ) } />
                                                                            <label className="custom-control-label" htmlFor="free-shipping">Free shipping</label>
                                                                        </div>
                                                                    </li>

                                                                    <li>
                                                                        <div className="custom-radio">
                                                                            <input type="radio" id="local_pickup" name="shipping" className="custom-control-input" onChange={ () => onChangeShipping( 8 ) } />
                                                                            <label className="custom-control-label" htmlFor="local_pickup">Local pickup</label>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div className="summary-subtotal">
                                                    <h4 className="summary-subtitle">Shipping</h4>
                                                    <p className="summary-subtotal-price">${ toDecimal( shippingCost ) }</p>
                                                </div>
                                                <div className="summary-total">
                                                    <h4 className="summary-subtitle">Total</h4>
                                                    <p className="summary-total-price ls-s">
                                                        ${ toDecimal( cartItems.reduce( ( acc, cur ) => {
                                                            const price = getItemPrice(cur);
                                                            const qty = cur.qty || 1;
                                                            return acc + (cur.sum || (price * qty));
                                                        }, 0 ) + shippingCost ) }
                                                    </p>
                                                </div>
                                                <ALink href="/pages/checkout" className="btn btn-dark btn-rounded btn-checkout">Proceed to checkout</ALink>
                                            </div>
                                        </div>
                                    </aside>
                                </>
                                :
                                <div className="empty-cart text-center">
                                    <p>Your cart is currently empty.</p>
                                    <i className="cart-empty d-icon-bag"></i>
                                    <p className="return-to-shop mb-0">
                                        <ALink className="button wc-backward btn btn-dark btn-md" href="/pages/shop">
                                            Return to shop
                                        </ALink>
                                    </p>
                                </div>
                        }
                    </div>
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

export default connect( mapStateToProps, { removeFromCart: cartActions.removeFromCart, updateCart: cartActions.updateCart } )( Cart );