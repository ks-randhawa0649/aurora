import React from 'react';
import { useRouter } from 'next/router';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import OwlCarousel from '~/components/features/owl-carousel';
import ALink from '~/components/features/custom-link';

import { mainSlider17 } from '~/utils/data/carousel';

export default function RelatedProducts( props ) {
    const { products, adClass = "" } = props;
    const router = useRouter();

    if (!products || products.length === 0) {
        return null;
    }

    const renderStars = (rating) => {
        return (
            <div className="stars-display">
                {[1, 2, 3, 4, 5].map((star) => (
                    star <= Math.floor(rating) ? (
                        <StarIcon key={star} sx={{ fontSize: 16, color: '#FFB800' }} />
                    ) : (
                        <StarBorderIcon key={star} sx={{ fontSize: 16, color: '#FFB800' }} />
                    )
                ))}
            </div>
        );
    };

    return (
        <>
        <section className={ `related-products-modern ${ adClass }` }>
            <OwlCarousel adClass="owl-carousel owl-theme owl-nav-modern" options={ mainSlider17 }>
                {
                    products.map( ( product, index ) => {
                        const imageUrl = product.pictures?.[0]?.url || '/images/placeholder.jpg';
                        const price = Array.isArray(product.price) ? product.price : [0, 0];
                        const hasDiscount = price[0] !== price[1] && price[1] > 0;
                        
                        return (
                            <div key={`related-${index}`} className="related-product-card">
                                <div className="card-image-wrapper">
                                    <ALink href={`/product/default/${product.slug}`}>
                                        <img 
                                            src={imageUrl} 
                                            alt={product.name}
                                            className="card-image"
                                        />
                                    </ALink>
                                    {product.is_new && (
                                        <span className="badge-new">NEW</span>
                                    )}
                                    {hasDiscount && (
                                        <span className="badge-sale">
                                            -{Math.round(((price[1] - price[0]) / price[1]) * 100)}%
                                        </span>
                                    )}
                                    <div className="card-actions">
                                        <button className="action-btn" title="Add to Wishlist">
                                            <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                                        </button>
                                        <button className="action-btn" title="Quick Add">
                                            <ShoppingCartIcon sx={{ fontSize: 20 }} />
                                        </button>
                                    </div>
                                </div>
                                <div className="card-content">
                                    {product.categories?.[0] && (
                                        <span className="card-category">{product.categories[0].name}</span>
                                    )}
                                    <h3 className="card-title">
                                        <ALink href={`/product/default/${product.slug}`}>
                                            {product.name}
                                        </ALink>
                                    </h3>
                                    <div className="card-rating">
                                        {renderStars(product.ratings || 4)}
                                        <span className="rating-count">({product.reviews || 0})</span>
                                    </div>
                                    <div className="card-price">
                                        <span className="price-current">${price[0].toFixed(2)}</span>
                                        {hasDiscount && (
                                            <span className="price-old">${price[1].toFixed(2)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </OwlCarousel>
        </section>

        <style jsx>{`
            .related-products-modern {
                padding: 0;
            }

            .related-product-card {
                background: white;
                border-radius: 16px;
                overflow: hidden;
                transition: all 0.3s ease;
                margin: 0 10px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }

            .related-product-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            }

            .card-image-wrapper {
                position: relative;
                overflow: hidden;
                background: #f8f9fa;
                height: 280px;
            }

            .card-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.4s ease;
            }

            .related-product-card:hover .card-image {
                transform: scale(1.08);
            }

            .badge-new,
            .badge-sale {
                position: absolute;
                top: 12px;
                left: 12px;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                z-index: 2;
            }

            .badge-new {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }

            .badge-sale {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
                left: auto;
                right: 12px;
            }

            .card-actions {
                position: absolute;
                bottom: 12px;
                right: 12px;
                display: flex;
                gap: 8px;
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.3s ease;
            }

            .related-product-card:hover .card-actions {
                opacity: 1;
                transform: translateY(0);
            }

            .action-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: white;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                color: #666;
            }

            .action-btn:hover {
                background: #26c;
                color: white;
                transform: scale(1.1);
            }

            .card-content {
                padding: 20px;
            }

            .card-category {
                display: inline-block;
                color: #26c;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
            }

            .card-title {
                margin: 0 0 12px 0;
                font-size: 16px;
                font-weight: 600;
                line-height: 1.4;
            }

            .card-title a {
                color: #333;
                text-decoration: none;
                transition: color 0.3s ease;
            }

            .card-title a:hover {
                color: #26c;
            }

            .card-rating {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 12px;
            }

            .stars-display {
                display: flex;
                gap: 2px;
            }

            .rating-count {
                font-size: 13px;
                color: #999;
            }

            .card-price {
                display: flex;
                align-items: baseline;
                gap: 10px;
            }

            .price-current {
                font-size: 22px;
                font-weight: 700;
                color: #26c;
            }

            .price-old {
                font-size: 16px;
                color: #999;
                text-decoration: line-through;
            }

            :global(.owl-nav-modern .owl-nav) {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 100%;
                display: flex;
                justify-content: space-between;
                pointer-events: none;
                padding: 0 -15px;
            }

            :global(.owl-nav-modern .owl-nav button) {
                background: white !important;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                pointer-events: all;
                border: 2px solid #26c;
                transition: all 0.3s ease;
            }

            :global(.owl-nav-modern .owl-nav button:hover) {
                background: #26c !important;
                transform: scale(1.1);
            }

            :global(.owl-nav-modern .owl-nav button span) {
                color: #26c;
                font-size: 24px;
                font-weight: bold;
            }

            :global(.owl-nav-modern .owl-nav button:hover span) {
                color: white;
            }

            @media (max-width: 768px) {
                .card-image-wrapper {
                    height: 240px;
                }

                .card-content {
                    padding: 16px;
                }

                .card-title {
                    font-size: 14px;
                }

                .price-current {
                    font-size: 18px;
                }
            }
        `}</style>
        </>
    );
}