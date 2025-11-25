import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

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
        <>
        <div className={`product-details ${isSticky ? 'sticky' : ''} ${adClass}`}>
            <h1 className="product-name">{product.name}</h1>

            <div className="product-meta">
                <span className="sku-badge">SKU: {product.sku}</span>
                {product.categories && product.categories.length > 0 && (
                    <div className="category-tags">
                        {product.categories.map((cat, index) => (
                            <ALink 
                                key={index}
                                href={`/pages/shop?category=${cat.slug}`} 
                                className="category-tag"
                            >
                                {cat.name}
                            </ALink>
                        ))}
                    </div>
                )}
            </div>

            <div className="price-rating-row">
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
                    <div className="ratings-container-modern">
                        <div className="stars-display">
                            {[1, 2, 3, 4, 5].map((star) => (
                                star <= Math.floor(product.ratings) ? (
                                    <StarIcon key={star} sx={{ fontSize: 20, color: '#FFB800' }} />
                                ) : (
                                    <StarBorderIcon key={star} sx={{ fontSize: 20, color: '#FFB800' }} />
                                )
                            ))}
                        </div>
                        <span className="rating-text">
                            {product.ratings.toFixed(1)} ({product.reviews} reviews)
                        </span>
                    </div>
                )}
            </div>

            {/* <div className="product-description-box">
                <p className="product-short-desc">{product.short_description}</p>
            </div> */}

            <div className="shipping-info-box">
                <LocalShippingOutlinedIcon sx={{ fontSize: 24, color: '#26c' }} />
                <span>Free shipping on orders over $50</span>
            </div>

            {product.variants && product.variants.length > 0 && (
                <div className="variants-section">
                    {product.size && product.size.length > 0 && (
                        <div className="variant-group">
                            <label className="variant-label">Size:</label>
                            <div className="size-options">
                                {product.size.map((size, index) => (
                                    <button
                                        key={index}
                                        className={`size-btn ${curSize === size ? 'active' : ''}`}
                                        onClick={() => selectSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.colors && product.colors.length > 0 && (
                        <div className="variant-group">
                            <label className="variant-label">Color:</label>
                            <div className="color-options">
                                {product.colors.map((color, index) => (
                                    <button
                                        key={index}
                                        className={`color-btn ${curColor === color ? 'active' : ''}`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        onClick={() => selectColor(color)}
                                        title={color}
                                    >
                                        <span className="sr-only">{color}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="quantity-section">
                <label className="qty-label">Quantity:</label>
                <div className="qty-controls">
                    <Quantity max={product.stock} value={qty} onChangeQty={changeQty} />
                    <span className="stock-info">{product.stock} in stock</span>
                </div>
            </div>

            <div className="action-buttons">
                <button
                    className={`btn-add-cart ${!(product.stock > 0) ? 'disabled' : ''}`}
                    onClick={onCartClick}
                    disabled={!(product.stock > 0)}
                >
                    <ShoppingCartIcon sx={{ fontSize: 20, marginRight: '8px' }} />
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                    className="btn-wishlist-modern"
                    onClick={onWishlistClick}
                    title={isInWishlist() ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                    {isInWishlist() ? (
                        <FavoriteIcon sx={{ fontSize: 24, color: '#ff6b6b' }} />
                    ) : (
                        <FavoriteBorderIcon sx={{ fontSize: 24, color: '#666' }} />
                    )}
                </button>
            </div>

            <div className="product-footer-modern">
                <div className="share-text">Share:</div>
                <div className="social-links-modern">
                    <ALink
                        href="#"
                        className="social-link-modern facebook"
                        onClick={(e) => e.preventDefault()}
                    >
                        <i className="fab fa-facebook-f"></i>
                    </ALink>
                    <ALink
                        href="#"
                        className="social-link-modern twitter"
                        onClick={(e) => e.preventDefault()}
                    >
                        <i className="fab fa-twitter"></i>
                    </ALink>
                    <ALink
                        href="#"
                        className="social-link-modern pinterest"
                        onClick={(e) => e.preventDefault()}
                    >
                        <i className="fab fa-pinterest-p"></i>
                    </ALink>
                </div>
            </div>
        </div>

        <style jsx>{`
            .product-details {
                height: 100%;
            }

            .product-name {
                font-size: 32px;
                font-weight: 700;
                color: #222;
                margin-bottom: 16px;
                line-height: 1.3;
            }

            .product-meta {
                display: flex;
                align-items: center;
                gap: 16px;
                flex-wrap: wrap;
                margin-bottom: 20px;
            }

            .sku-badge {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .category-tags {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }

            .category-tag {
                background: #f8f9fa;
                color: #26c;
                padding: 6px 14px;
                border-radius: 16px;
                font-size: 13px;
                font-weight: 500;
                text-decoration: none;
                transition: all 0.3s ease;
                border: 1px solid #e0e0e0;
            }

            .category-tag:hover {
                background: #26c;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 102, 204, 0.2);
            }

            .price-rating-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 24px;
                padding-bottom: 24px;
                border-bottom: 2px solid #f0f0f0;
            }

            .product-price {
                display: flex;
                align-items: baseline;
                gap: 12px;
            }

            .new-price {
                font-size: 36px;
                font-weight: 700;
                color: #26c;
                text-decoration: none;
            }

            .old-price {
                font-size: 24px;
                color: #999;
                text-decoration: line-through;
            }

            .ratings-container-modern {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .stars-display {
                display: flex;
                gap: 2px;
            }

            .rating-text {
                font-size: 14px;
                color: #666;
                font-weight: 500;
            }

            .product-description-box {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 12px;
                margin-bottom: 20px;
                border-left: 4px solid #26c;
            }

            .product-short-desc {
                color: #666;
                line-height: 1.8;
                margin: 0;
                font-size: 15px;
            }

            .shipping-info-box {
                display: flex;
                align-items: center;
                gap: 12px;
                background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
                padding: 14px 20px;
                border-radius: 12px;
                margin-bottom: 24px;
                border: 1px solid rgba(38, 0, 204, 0.1);
            }

            .shipping-info-box span {
                color: #26c;
                font-weight: 600;
                font-size: 14px;
            }

            .variants-section {
                margin-bottom: 24px;
            }

            .variant-group {
                margin-bottom: 20px;
            }

            .variant-label {
                display: block;
                font-weight: 600;
                color: #333;
                margin-bottom: 12px;
                font-size: 15px;
            }

            .size-options {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }

            .size-btn {
                padding: 10px 20px;
                border: 2px solid #e0e0e0;
                background: white;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                font-size: 14px;
                color: #666;
                transition: all 0.3s ease;
                min-width: 50px;
            }

            .size-btn:hover {
                border-color: #26c;
                color: #26c;
                transform: translateY(-2px);
            }

            .size-btn.active {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-color: #667eea;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            }

            .color-options {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
            }

            .color-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 3px solid #e0e0e0;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            }

            .color-btn:hover {
                transform: scale(1.15);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .color-btn.active {
                border-color: #26c;
                box-shadow: 0 0 0 4px rgba(38, 0, 204, 0.2);
                transform: scale(1.15);
            }

            .color-btn.active::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-weight: bold;
                font-size: 16px;
                text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
            }

            .quantity-section {
                margin-bottom: 24px;
            }

            .qty-label {
                display: block;
                font-weight: 600;
                color: #333;
                margin-bottom: 12px;
                font-size: 15px;
            }

            .qty-controls {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .stock-info {
                color: #28a745;
                font-weight: 600;
                font-size: 14px;
            }

            .action-buttons {
                display: flex;
                gap: 12px;
                margin-bottom: 24px;
            }

            .btn-add-cart {
                flex: 1;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 16px 32px;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            }

            .btn-add-cart:hover:not(.disabled) {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }

            .btn-add-cart.disabled {
                background: #ccc;
                cursor: not-allowed;
                box-shadow: none;
            }

            .btn-wishlist-modern {
                width: 60px;
                height: 60px;
                background: white;
                border: 2px solid #e0e0e0;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .btn-wishlist-modern:hover {
                border-color: #ff6b6b;
                background: #fff5f5;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
            }

            .product-footer-modern {
                display: flex;
                align-items: center;
                gap: 16px;
                padding-top: 24px;
                border-top: 2px solid #f0f0f0;
            }

            .share-text {
                font-weight: 600;
                color: #333;
                font-size: 14px;
            }

            .social-links-modern {
                display: flex;
                gap: 10px;
            }

            .social-link-modern {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                transition: all 0.3s ease;
                text-decoration: none;
            }

            .social-link-modern.facebook {
                background: #3b5998;
            }

            .social-link-modern.twitter {
                background: #1da1f2;
            }

            .social-link-modern.pinterest {
                background: #bd081c;
            }

            .social-link-modern:hover {
                transform: translateY(-3px) scale(1.1);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }

            @media (max-width: 768px) {
                .product-name {
                    font-size: 24px;
                }

                .price-rating-row {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 16px;
                }

                .new-price {
                    font-size: 28px;
                }

                .old-price {
                    font-size: 20px;
                }

                .action-buttons {
                    flex-direction: column;
                }

                .btn-wishlist-modern {
                    width: 100%;
                }
            }
        `}</style>
        </>
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