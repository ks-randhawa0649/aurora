import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';

import ALink from '~/components/features/custom-link';
import Quantity from '~/components/features/quantity';

import { cartActions } from '~/store/cart';
import { modalActions } from '~/store/modal';
import { wishlistActions } from '~/store/wishlist';

function DetailOne( props ) {
    const router = useRouter();
    const { data, isSticky = false, isDesc = false, adClass = '' } = props;
    const { addToCart, toggleWishlist, showQuickview, openLoginModal } = props;
    
    const product = data?.product?.data;

    const [curColor, setCurColor] = useState('');
    const [curSize, setSize] = useState('');
    const [qty, setQty] = useState(1);

    useEffect(() => {
        if (product) {
            resetValue();
        }
    }, [product]);

    const isInWishlist = () => {
        return product && props.wishlist.findIndex(item => item.slug === product.slug) > -1;
    };

    const onWishlistClick = (e) => {
        e.preventDefault();
        if (!isInWishlist()) {
            let target = e.currentTarget;
            target.classList.add("load-more-overlay", "loading");
            toggleWishlist(product);

            setTimeout(() => {
                target.classList.remove('load-more-overlay', 'loading');
            }, 1000);
        } else {
            router.push('/pages/wishlist');
        }
    };

    const onCartClick = (e) => {
        e.preventDefault();

        console.log('Product object:', product);
        console.log('Product price:', product.price);

        // Get the current price - handle both array and direct price
        let currentPrice = 0;
        if (Array.isArray(product.price) && product.price.length > 0) {
            currentPrice = parseFloat(product.price[0]);
            console.log('Price from array:', currentPrice);
        } else if (typeof product.price === 'number') {
            currentPrice = product.price;
            console.log('Direct price:', currentPrice);
        }

        // If we have variants and selections, find the specific variant price
        if (product.variants?.length > 0 && (curSize || curColor)) {
            const selectedVariant = product.variants.find(v => {
                const sizeMatch = !curSize || v.size === curSize;
                const colorMatch = !curColor || (Array.isArray(v.color) ? v.color.includes(curColor) : v.color === curColor);
                return sizeMatch && colorMatch;
            });

            if (selectedVariant && selectedVariant.price) {
                currentPrice = parseFloat(selectedVariant.price);
                console.log('Price from variant:', currentPrice);
            }
        }

        console.log('Final price to cart:', currentPrice);

        let newProduct = { ...product };
        
        // Build variant string and product name
        if (curSize !== '' && curColor !== '') {
            newProduct = {
                ...product,
                name: product.name + ' - ' + curColor + ', ' + curSize,
                variant: curColor + ', ' + curSize
            };
        } else if (curSize !== '') {
            newProduct = {
                ...product,
                name: product.name + ' - ' + curSize,
                variant: curSize
            };
        } else if (curColor !== '') {
            newProduct = {
                ...product,
                name: product.name + ' - ' + curColor,
                variant: curColor
            };
        }

        // Create cart item with explicit price field
        const cartItem = {
            ...newProduct,
            qty: qty,
            price: currentPrice,
            sum: currentPrice * qty
        };

        console.log('Cart item being added:', cartItem);
        console.log('Cart item price:', cartItem.price);
        console.log('Cart item sum:', cartItem.sum);

        addToCart(cartItem);
    };

    const changeQty = (qty) => {
        setQty(qty);
    };

    const resetValue = () => {
        setCurColor('');
        setSize('');
        setQty(1);
    };

    const selectColor = (color) => {
        setCurColor(color);
    };

    const selectSize = (size) => {
        setSize(size);
    };

    if (!product) {
        return <div className="container mt-5 mb-5">Loading product details...</div>;
    }

    // Safely get price for display
    const displayPrice = Array.isArray(product.price) && product.price.length > 0 
        ? product.price 
        : [0, 0];

    return (
        <div className={`product-details ${isSticky ? 'sticky' : ''} ${adClass}`}>
            <div className="product-navigation">
                <ul className="breadcrumb breadcrumb-lg">
                    <li><ALink href="/"><i className="d-icon-home"></i></ALink></li>
                    <li><ALink href="/pages/shop" className="active">Products</ALink></li>
                    <li>{product.name}</li>
                </ul>
            </div>

            <h1 className="product-name">{product.name}</h1>

            <div className="product-meta">
                SKU: <span className="product-sku">{product.sku}</span>
                {product.categories && product.categories.length > 0 && (
                    <>
                        {' '}CATEGORIES: {product.categories.map((cat, index) => (
                            <React.Fragment key={index}>
                                <ALink href={`/pages/shop?category=${cat.slug}`} className="product-category">
                                    {cat.name}
                                </ALink>
                                {index < product.categories.length - 1 ? ', ' : ''}
                            </React.Fragment>
                        ))}
                    </>
                )}
            </div>

            <div className="product-price">
                {displayPrice[0] !== displayPrice[1] && displayPrice[1] > 0 ? (
                    <>
                        <ins className="new-price">${displayPrice[0].toFixed(2)}</ins>
                        <del className="old-price">${displayPrice[1].toFixed(2)}</del>
                    </>
                ) : (
                    <ins className="new-price">${displayPrice[0].toFixed(2)}</ins>
                )}
            </div>

            {product.ratings > 0 && (
                <div className="ratings-container">
                    <div className="ratings-full">
                        <span className="ratings" style={{ width: `${product.ratings * 20}%` }}></span>
                        <span className="tooltiptext tooltip-top">{product.ratings.toFixed(2)}</span>
                    </div>
                    <ALink href="#" className="rating-reviews" onClick={(e) => e.preventDefault()}>
                        ({product.reviews} Reviews)
                    </ALink>
                </div>
            )}

            <p className="product-short-desc">{product.short_description}</p>

            {product.variants && product.variants.length > 0 && (
                <>
                    {product.size && product.size.length > 0 && (
                        <div className="product-form product-variations product-size mb-4">
                            <label>Size:</label>
                            <div className="select-box">
                                <select 
                                    className="form-control"
                                    value={curSize}
                                    onChange={(e) => selectSize(e.target.value)}
                                >
                                    <option value="">Choose an option</option>
                                    {product.size.map((size, index) => (
                                        <option value={size} key={index}>{size}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {product.colors && product.colors.length > 0 && (
                        <div className="product-form product-variations product-color mb-4">
                            <label>Color:</label>
                            <div className="product-variations">
                                {product.colors.map((color, index) => (
                                    <a
                                        href="#"
                                        key={index}
                                        className={`color ${curColor === color ? 'active' : ''}`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            selectColor(color);
                                        }}
                                        title={color}
                                    >
                                        <span className="sr-only">{color}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            <hr className="product-divider" />

            <div className="product-form product-qty pb-0">
                <label className="mr-2">QTY:</label>
                <div className="product-form-group">
                    <Quantity max={product.stock} value={qty} onChangeQty={changeQty} />
                    <button
                        className={`btn-product btn-cart text-normal ls-normal font-weight-semi-bold ${!(product.stock > 0) ? 'disabled' : ''}`}
                        onClick={onCartClick}
                        disabled={!(product.stock > 0)}
                    >
                        <i className="d-icon-bag"></i>
                        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>

            <hr className="product-divider mb-3" />

            <div className="product-footer">
                <div className="social-links mr-4">
                    <ALink
                        href="#"
                        className="social-link social-facebook fab fa-facebook-f"
                        onClick={(e) => e.preventDefault()}
                    ></ALink>
                    <ALink
                        href="#"
                        className="social-link social-twitter fab fa-twitter"
                        onClick={(e) => e.preventDefault()}
                    ></ALink>
                    <ALink
                        href="#"
                        className="social-link social-pinterest fab fa-pinterest-p"
                        onClick={(e) => e.preventDefault()}
                    ></ALink>
                </div>
                <span className="divider d-lg-show"></span>
                <a
                    href="#"
                    className={`btn-product btn-wishlist`}
                    onClick={onWishlistClick}
                    title={isInWishlist() ? 'Go to Wishlist' : 'Add to Wishlist'}
                >
                    <i className={isInWishlist() ? 'd-icon-heart-full' : 'd-icon-heart'}></i>
                    {isInWishlist() ? 'Go to Wishlist' : 'Add to Wishlist'}
                </a>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        wishlist: state.wishlist.data ? state.wishlist.data : []
    };
}

export default connect(mapStateToProps, {
    toggleWishlist: wishlistActions.toggleWishlist,
    addToCart: cartActions.addToCart,
    ...modalActions
})(DetailOne);