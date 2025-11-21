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
                    {
                        cartList.length > 0 ?
                            <div className="row">
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
                                                cartList.map( ( item, index ) => {
                                                    const imageUrl = getImageUrl( item );
                                                    const price = getPrice( item );
                                                    const subtotal = price * item.qty;

                                                    console.log(`Cart item ${index}:`, item);
                                                    console.log(`Price: ${price}, Qty: ${item.qty}, Subtotal: ${subtotal}`);

                                                    return (
                                                        <tr key={ `cart-item-${ index }` }>
                                                            <td className="product-thumbnail">
                                                                <figure>
                                                                    <ALink href={ `/product/default/${ item.slug }` }>
                                                                        <LazyLoadImage
                                                                            alt={ item.name }
                                                                            src={ imageUrl }
                                                                            width={ 100 }
                                                                            height={ 100 }
                                                                            effect="opacity"
                                                                            onError={ ( e ) => {
                                                                                e.target.src = '/images/placeholder.jpg';
                                                                            } }
                                                                        />
                                                                    </ALink>
                                                                </figure>
                                                            </td>
                                                            <td className="product-name">
                                                                <div className="product-name-section">
                                                                    <ALink href={ `/product/default/${ item.slug }` }>
                                                                        { item.name }
                                                                    </ALink>
                                                                    {item.variant && (
                                                                        <div className="product-variant">
                                                                            <small>{ item.variant }</small>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="product-subtotal">
                                                                <span className="amount">${ toDecimal( price ) }</span>
                                                            </td>
                                                            <td className="product-quantity">
                                                                <Quantity 
                                                                    qty={ item.qty } 
                                                                    max={ item.stock || 100 } 
                                                                    onChangeQty={ ( current ) => onChangeQty( item, current ) } 
                                                                />
                                                            </td>
                                                            <td className="product-price">
                                                                <span className="amount">${ toDecimal( subtotal ) }</span>
                                                            </td>
                                                            <td className="product-close">
                                                                <a href="#" className="product-remove" onClick={ ( e ) => { e.preventDefault(); removeItem( item ); } }>
                                                                    <i className="fas fa-times"></i>
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    );
                                                } )
                                            }
                                        </tbody>
                                    </table>
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
                                                            <p className="summary-subtotal-price">${ toDecimal( calculateTotal() ) }</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table>
                                                <tbody>
                                                    <tr className="summary-total">
                                                        <td>
                                                            <h4 className="summary-subtitle">Total</h4>
                                                        </td>
                                                        <td>
                                                            <p className="summary-total-price ls-s">${ toDecimal( calculateTotal() ) }</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <ALink href="/pages/checkout" className="btn btn-dark btn-rounded btn-checkout">
                                                Proceed to checkout
                                            </ALink>
                                        </div>
                                    </div>
                                </aside>
                            </div>
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
    )
}

function mapStateToProps( state ) {
    return {
        cartList: state.cart.data ? state.cart.data : []
    }
}

export default connect( mapStateToProps, { removeFromCart: cartActions.removeFromCart, updateCart: cartActions.updateCart } )( Cart );