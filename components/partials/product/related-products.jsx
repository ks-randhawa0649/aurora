import React from 'react';
import { useRouter } from 'next/router';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import OwlCarousel from '~/components/features/owl-carousel';
import ALink from '~/components/features/custom-link';

export default function RelatedProducts( props ) {
    const { products, adClass = "" } = props;
    const router = useRouter();

    if (!products || products.length === 0) {
        return null;
    }

    // Duplicate products for infinite scroll effect
    const infiniteProducts = [...products, ...products, ...products];

    const renderStars = (rating) => {
        return (
            <div className="stars-display">
                {[1, 2, 3, 4, 5].map((star) => (
                    star <= Math.floor(rating) ? (
                        <StarIcon key={star} sx={{ fontSize: 18, color: '#FFB800' }} />
                    ) : (
                        <StarBorderIcon key={star} sx={{ fontSize: 18, color: '#FFB800' }} />
                    )
                ))}
            </div>
        );
    };

    return (
        <>
        <section className={ `related-products-section ${ adClass }` }>
            <div className="infinite-scroll-container">
                <div className="infinite-scroll-track">
                {
                    infiniteProducts.map( ( product, index ) => {
                        const imageUrl = product.pictures?.[0]?.url || '/images/placeholder.jpg';
                        const price = Array.isArray(product.price) ? product.price : [0, 0];
                        const hasDiscount = price[0] !== price[1] && price[1] > 0;
                        
                        return (
                            <div key={`related-${index}`} className="product-card-premium">
                                <div className="image-container">
                                    <ALink href={`/product/default/${product.slug}`}>
                                        <div className="image-wrapper">
                                            <img 
                                                src={imageUrl} 
                                                alt={product.name}
                                                className="product-image"
                                            />
                                            <div className="image-overlay">
                                                <div className="overlay-content">
                                                    <RemoveRedEyeIcon sx={{ fontSize: 24, color: 'white' }} />
                                                    <span className="view-text">Quick View</span>
                                                </div>
                                            </div>
                                        </div>
                                    </ALink>
                                    
                                    <div className="badges-container">
                                        {product.is_new && (
                                            <span className="badge-premium badge-new">
                                                <span className="badge-icon">✨</span>
                                                NEW
                                            </span>
                                        )}
                                        {hasDiscount && (
                                            <span className="badge-premium badge-sale">
                                                <span className="badge-icon">🔥</span>
                                                -{Math.round(((price[1] - price[0]) / price[1]) * 100)}%
                                            </span>
                                        )}
                                    </div>

                                    <div className="quick-actions">
                                        <button className="quick-action-btn wishlist-btn" title="Add to Wishlist">
                                            <FavoriteBorderIcon sx={{ fontSize: 22 }} />
                                        </button>
                                        <button className="quick-action-btn cart-btn" title="Add to Cart">
                                            <ShoppingCartIcon sx={{ fontSize: 22 }} />
                                        </button>
                                    </div>
                                </div>

                                <div className="product-info">
                                    {product.categories?.[0] && (
                                        <div className="category-wrapper">
                                            <span className="category-badge">{product.categories[0].name}</span>
                                        </div>
                                    )}
                                    
                                    <h3 className="product-title">
                                        <ALink href={`/product/default/${product.slug}`}>
                                            {product.name}
                                        </ALink>
                                    </h3>
                                    
                                    <div className="rating-row">
                                        {renderStars(product.ratings || 4)}
                                        <span className="review-count">({product.reviews || 0} reviews)</span>
                                    </div>
                                    
                                    <div className="price-row">
                                        <div className="price-main">
                                            <span className="current-price">${price[0].toFixed(2)}</span>
                                            {hasDiscount && (
                                                <span className="original-price">${price[1].toFixed(2)}</span>
                                            )}
                                        </div>
                                        {hasDiscount && (
                                            <span className="savings-badge">
                                                Save ${(price[1] - price[0]).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
                </div>
            </div>
        </section>

        <style jsx>{`
            .related-products-section {
                padding: 0;
                overflow: hidden;
                position: relative;
            }

            .infinite-scroll-container {
                width: 100%;
                overflow: hidden;
                position: relative;
            }

            .infinite-scroll-track {
                display: flex;
                gap: 24px;
                animation: infiniteScroll 60s linear infinite;
                width: fit-content;
            }

            .infinite-scroll-track:hover {
                animation-play-state: paused;
            }

            @keyframes infiniteScroll {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(-33.333%);
                }
            }

            .product-card-premium {
                background: white;
                border-radius: 20px;
                overflow: hidden;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                border: 2px solid transparent;
                flex-shrink: 0;
                width: 320px;
            }

            .product-card-premium:hover {
                transform: translateY(-12px);
                box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
                border-color: rgba(38, 0, 204, 0.2);
            }

            .image-container {
                position: relative;
                overflow: hidden;
            }

            .image-wrapper {
                position: relative;
                height: 320px;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                overflow: hidden;
            }

            .product-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .product-card-premium:hover .product-image {
                transform: scale(1.15);
            }

            .image-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.4s ease;
            }

            .product-card-premium:hover .image-overlay {
                opacity: 1;
            }

            .overlay-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                transform: translateY(20px);
                transition: transform 0.4s ease;
            }

            .product-card-premium:hover .overlay-content {
                transform: translateY(0);
            }

            .view-text {
                color: white;
                font-size: 14px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .badges-container {
                position: absolute;
                top: 16px;
                left: 0;
                right: 0;
                display: flex;
                justify-content: space-between;
                padding: 0 16px;
                z-index: 3;
            }

            .badge-premium {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 8px 16px;
                border-radius: 24px;
                font-size: 12px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                backdrop-filter: blur(10px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                animation: badgePulse 2s ease-in-out infinite;
            }

            @keyframes badgePulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            .badge-icon {
                font-size: 14px;
                animation: iconSpin 3s linear infinite;
            }

            @keyframes iconSpin {
                0%, 90%, 100% { transform: rotate(0deg); }
                95% { transform: rotate(15deg); }
            }

            .badge-new {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
                color: white;
            }

            .badge-sale {
                background: linear-gradient(135deg, rgba(240, 147, 251, 0.95) 0%, rgba(245, 87, 108, 0.95) 100%);
                color: white;
            }

            .quick-actions {
                position: absolute;
                top: 50%;
                right: 16px;
                transform: translateY(-50%) translateX(60px);
                display: flex;
                flex-direction: column;
                gap: 12px;
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 4;
            }

            .product-card-premium:hover .quick-actions {
                transform: translateY(-50%) translateX(0);
                opacity: 1;
            }

            .quick-action-btn {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: white;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                color: #666;
                position: relative;
                overflow: hidden;
            }

            .quick-action-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                transform: scale(0);
                transition: transform 0.3s ease;
                border-radius: 50%;
            }

            .quick-action-btn:hover::before {
                transform: scale(1);
            }

            .quick-action-btn :global(svg) {
                position: relative;
                z-index: 1;
                transition: color 0.3s ease;
            }

            .quick-action-btn:hover :global(svg) {
                color: white;
            }

            .quick-action-btn:hover {
                transform: scale(1.15);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }

            .product-info {
                padding: 24px;
            }

            .category-wrapper {
                margin-bottom: 12px;
            }

            .category-badge {
                display: inline-flex;
                align-items: center;
                background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
                color: #26c;
                padding: 6px 14px;
                border-radius: 16px;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                border: 1px solid rgba(38, 0, 204, 0.2);
            }

            .product-title {
                margin: 0 0 14px 0;
                font-size: 17px;
                font-weight: 700;
                line-height: 1.4;
                min-height: 48px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .product-title a {
                color: #222;
                text-decoration: none;
                transition: all 0.3s ease;
                background: linear-gradient(to right, #26c, #667eea);
                background-size: 0% 2px;
                background-repeat: no-repeat;
                background-position: left bottom;
            }

            .product-title a:hover {
                color: #26c;
                background-size: 100% 2px;
            }

            .rating-row {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 16px;
                padding-bottom: 14px;
                border-bottom: 2px solid #f0f0f0;
            }

            .stars-display {
                display: flex;
                gap: 3px;
            }

            .review-count {
                font-size: 13px;
                color: #999;
                font-weight: 500;
            }

            .price-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 10px;
            }

            .price-main {
                display: flex;
                align-items: baseline;
                gap: 10px;
            }

            .current-price {
                font-size: 26px;
                font-weight: 800;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .original-price {
                font-size: 16px;
                color: #999;
                text-decoration: line-through;
                font-weight: 500;
            }

            .savings-badge {
                background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
                color: white;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 700;
                box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
            }

            @media (max-width: 992px) {
                .product-card-premium {
                    width: 280px;
                }

                .image-wrapper {
                    height: 280px;
                }
            }

            @media (max-width: 768px) {
                .product-card-premium {
                    width: 260px;
                }

                .infinite-scroll-track {
                    gap: 16px;
                }

                .image-wrapper {
                    height: 260px;
                }

                .product-info {
                    padding: 20px;
                }

                .product-title {
                    font-size: 15px;
                    min-height: 42px;
                }

                .current-price {
                    font-size: 22px;
                }

                .quick-actions {
                    position: static;
                    transform: none;
                    opacity: 1;
                    flex-direction: row;
                    justify-content: center;
                    padding: 12px 0;
                    background: #f8f9fa;
                }

                .product-card-premium:hover .quick-actions {
                    transform: none;
                }
            }

            @media (max-width: 576px) {
                .product-card-premium {
                    width: 240px;
                }

                .infinite-scroll-track {
                    gap: 12px;
                }

                .image-wrapper {
                    height: 220px;
                }

                .badges-container {
                    padding: 0 12px;
                }

                .badge-premium {
                    padding: 6px 12px;
                    font-size: 10px;
                }

                .quick-action-btn {
                    width: 42px;
                    height: 42px;
                }
            }
        `}</style>
        </>
    );
}