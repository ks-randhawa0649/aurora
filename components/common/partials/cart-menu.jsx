import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import ALink from '~/components/features/custom-link';

import { cartActions } from '~/store/cart';

import { toDecimal } from '~/utils';

function CartMenu( props ) {
    const { cartList, removeFromCart } = props;
    const router = useRouter();

    useEffect( () => {
        router.events.on( 'routeChangeComplete', closeCartMenu );

        return () => {
            router.events.off( 'routeChangeComplete', closeCartMenu );
        };
    }, [] );

    function toggleCartMenu( e ) {
        e.preventDefault();
        
        const body = document.querySelector( 'body' );
        const cartDropdown = document.querySelector( '.cart-dropdown' );
        
        if ( cartDropdown && cartDropdown.classList.contains( 'opened' ) ) {
            closeCartMenu();
        } else {
            openCartMenu();
        }
    }

    function openCartMenu() {
        const body = document.querySelector( 'body' );
        const cartDropdown = document.querySelector( '.cart-dropdown' );
        
        if ( cartDropdown ) {
            cartDropdown.classList.add( 'opened' );
            body.classList.add( 'cart-opened' );
        }
    }

    function closeCartMenu() {
        const body = document.querySelector( 'body' );
        const cartDropdown = document.querySelector( '.cart-dropdown' );
        
        if ( cartDropdown ) {
            cartDropdown.classList.remove( 'opened' );
        }
        if ( body ) {
            body.classList.remove( 'cart-opened' );
        }
    }

    function removeCart( item ) {
        removeFromCart( item );
    }

    function getImageUrl( product ) {
        if ( !product ) return '/images/placeholder.jpg';
        
        // Check pictures array
        if ( product.pictures && Array.isArray( product.pictures ) && product.pictures.length > 0 ) {
            const pic = product.pictures[ 0 ];
            if ( pic && pic.url ) return pic.url;
        }
        
        // Check small_pictures array
        if ( product.small_pictures && Array.isArray( product.small_pictures ) && product.small_pictures.length > 0 ) {
            const pic = product.small_pictures[ 0 ];
            if ( pic && pic.url ) return pic.url;
        }
        
        // Check direct image property
        if ( product.image ) return product.image;
        
        return '/images/placeholder.jpg';
    }

    function getPrice( product ) {
        if ( !product ) return 0;
        
        // First check direct price property (this is what we set when adding to cart)
        if ( typeof product.price === 'number' && product.price > 0 ) {
            return product.price;
        }
        
        // Check if price is in product.price array
        if ( Array.isArray( product.price ) && product.price.length > 0 ) {
            return product.price[ 0 ] || 0;
        }
        
        // Check priceArray (backup)
        if ( Array.isArray( product.priceArray ) && product.priceArray.length > 0 ) {
            return product.priceArray[ 0 ] || 0;
        }
        
        return 0;
    }

    const getTotalPrice = () => {
        let total = 0;
        if ( cartList && Array.isArray( cartList ) ) {
            cartList.forEach( item => {
                const price = getPrice( item );
                const qty = item.qty || 1;
                total += price * qty;
            } );
        }
        return total;
    };

    return (
        <div className="dropdown cart-dropdown type2 cart-offcanvas mr-0 mr-lg-2">
            <a 
                href="#" 
                className="cart-toggle label-block link"
                onClick={ toggleCartMenu }
            >
                <span className="cart-label">
                    <span className="cart-name">Shopping Cart:</span>
                    <span className="cart-price">${ toDecimal( getTotalPrice() ) }</span>
                </span>
                {cartList && cartList.length > 0 && (
                    <span className="cart-count">{ cartList.length }</span>
                )}
            </a>

            <div className="canvas-overlay" onClick={ closeCartMenu }></div>

            <div className="dropdown-box">
                <div className="canvas-header">
                    <h4 className="canvas-title">Shopping Cart</h4>
                    <a 
                        href="#" 
                        className="btn btn-dark btn-link btn-icon-right btn-close" 
                        onClick={ (e) => { e.preventDefault(); closeCartMenu(); } }
                    >
                        close<i className="d-icon-arrow-right"></i>
                        <span className="sr-only">Cart</span>
                    </a>
                </div>

                <div className="products scrollable">
                    {
                        cartList && cartList.length > 0 ?
                            cartList.map( ( item, index ) => {
                                const imageUrl = getImageUrl( item );
                                const price = getPrice( item );
                                const subtotal = price * ( item.qty || 1 );

                                return (
                                    <div className="product product-cart" key={ `cart-menu-product-${ index }` }>
                                        <figure className="product-media pure-media">
                                            <ALink href={ `/product/default/${ item.slug }` } onClick={ closeCartMenu }>
                                                <img 
                                                    src={ imageUrl } 
                                                    alt={ item.name || 'Product' } 
                                                    width="80" 
                                                    height="88"
                                                    onError={ ( e ) => {
                                                        e.target.src = '/images/placeholder.jpg';
                                                    } }
                                                />
                                            </ALink>

                                            <button 
                                                className="btn btn-link btn-close" 
                                                onClick={ () => removeCart( item ) }
                                            >
                                                <i className="fas fa-times"></i>
                                                <span className="sr-only">Close</span>
                                            </button>
                                        </figure>

                                        <div className="product-detail">
                                            <ALink 
                                                href={ `/product/default/${ item.slug }` } 
                                                className="product-name"
                                                onClick={ closeCartMenu }
                                            >
                                                { item.UI_pname || 'Unnamed Product' }
                                            </ALink>
                                            
                                            {item.variant && (
                                                <div className="product-variant">
                                                    <small>{ item.variant }</small>
                                                </div>
                                            )}

                                            <div className="price-box">
                                                <span className="product-quantity">{ item.qty || 1 }</span>
                                                <span className="product-price">${ toDecimal( price ) }</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            } )
                            :
                            <p className="mt-4 text-center">No products in the cart.</p>
                    }
                </div>

                {
                    cartList && cartList.length > 0 &&
                    <>
                        <div className="cart-total">
                            <label>Subtotal:</label>
                            <span className="price">${ toDecimal( getTotalPrice() ) }</span>
                        </div>

                        <div className="cart-action">
                            <ALink 
                                href="/pages/cart" 
                                className="btn btn-dark btn-link"
                                onClick={ closeCartMenu }
                            >
                                View Cart
                            </ALink>
                            <ALink 
                                href="/pages/checkout" 
                                className="btn btn-dark"
                                onClick={ closeCartMenu }
                            >
                                <span>Go To Checkout</span>
                            </ALink>
                        </div>
                    </>
                }
            </div>

            <style jsx>{`
                .cart-dropdown.opened .dropdown-box {
                    right: 0;
                    visibility: visible;
                    opacity: 1;
                }
                
                .cart-dropdown.opened .canvas-overlay {
                    visibility: visible;
                    opacity: 1;
                }
                
                body.cart-opened {
                    overflow: hidden;
                }
                
                .cart-dropdown .dropdown-box {
                    position: fixed;
                    top: 0;
                    right: -420px;
                    width: 420px;
                    max-width: 100%;
                    height: 100vh;
                    background: #fff;
                    z-index: 10000;
                    transition: right 0.3s ease;
                    visibility: hidden;
                    opacity: 0;
                    display: flex;
                    flex-direction: column;
                }
                
                .cart-dropdown .canvas-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 9999;
                    visibility: hidden;
                    opacity: 0;
                    transition: opacity 0.3s ease, visibility 0.3s ease;
                }
                
                .cart-dropdown .canvas-header {
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .cart-dropdown .canvas-title {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                }
                
                .cart-dropdown .products {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                }
                
                .cart-dropdown .cart-total {
                    padding: 20px;
                    border-top: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    font-size: 16px;
                    font-weight: 600;
                }
                
                .cart-dropdown .cart-action {
                    padding: 0 20px 20px;
                    display: flex;
                    gap: 10px;
                }
                
                .cart-dropdown .cart-action .btn {
                    flex: 1;
                }

                .cart-count {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #000;
                    color: #fff;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: 600;
                }

                .cart-toggle {
                    position: relative;
                    display: inline-block;
                }
            `}</style>
        </div>
    );
}

function mapStateToProps( state ) {
    return {
        cartList: state.cart.data || []
    };
}

export default connect( mapStateToProps, { removeFromCart: cartActions.removeFromCart } )( CartMenu );