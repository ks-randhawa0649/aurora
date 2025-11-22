import React from 'react';
import Reveal from 'react-awesome-reveal';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import ALink from '~/components/features/custom-link';

import { fadeIn, fadeInUpShorter, fadeInLeftShorter, fadeInRightShorter } from '~/utils/data/keyframes';

function BestCollection ( props ) {
    const { products, loading } = props;

    const collectionItems = [
        {
            id: 1,
            image: '/photodump/IMG_0056.JPG',
            title: 'Winter Collection',
            description: 'Cozy & Stylish',
            category: 'Outerwear'
        },
        {
            id: 2,
            image: '/photodump/IMG_0069.JPG',
            title: 'Street Style',
            description: 'Urban Fashion',
            category: 'Casual Wear'
        },
        {
            id: 3,
            image: '/photodump/IMG_0568.JPG',
            title: 'Classic Elegance',
            description: 'Timeless Pieces',
            category: 'Premium'
        },
        {
            id: 4,
            image: '/photodump/IMG_4586.JPG',
            title: 'Modern Vibes',
            description: 'Contemporary Look',
            category: 'Trending'
        },
        {
            id: 5,
            image: '/photodump/IMG_5264.JPG',
            title: 'Signature Style',
            description: 'Exclusive Design',
            category: 'Limited Edition'
        },
        {
            id: 6,
            image: '/photodump/IMG_8353.JPG',
            title: 'Bold & Beautiful',
            description: 'Statement Pieces',
            category: 'New Arrival'
        }
    ];

    return (
        <section className="best-collection-section">
            <div className="container">
                <Reveal keyframes={ fadeIn } delay={ 200 } duration={ 1000 } triggerOnce>
                    <div className="section-header">
                        <span className="section-subtitle">Curated Collections</span>
                        <h2 className="section-title">Best Sellers</h2>
                        <p className="section-description">
                            Discover our most loved pieces, handpicked just for you
                        </p>
                    </div>
                </Reveal>

                <div className="collection-grid">
                    {/* Featured Large Item */}
                    <Reveal keyframes={ fadeInLeftShorter } delay={ 300 } duration={ 1000 } triggerOnce>
                        <div className="collection-item featured-item">
                            <div className="collection-image-wrapper">
                                <LazyLoadImage
                                    src={collectionItems[0].image}
                                    alt={collectionItems[0].title}
                                    effect="opacity"
                                    className="collection-image"
                                />
                                <div className="overlay"></div>
                            </div>
                            <div className="collection-content">
                                <span className="collection-category">{collectionItems[0].category}</span>
                                <h3 className="collection-title">{collectionItems[0].title}</h3>
                                <p className="collection-description">{collectionItems[0].description}</p>
                                <ALink href="/pages/shop" className="collection-btn">
                                    Explore Now
                                    <i className="d-icon-arrow-right"></i>
                                </ALink>
                            </div>
                        </div>
                    </Reveal>

                    {/* Grid Items */}
                    <div className="collection-grid-items">
                        {collectionItems.slice(1, 5).map((item, index) => (
                            <Reveal 
                                key={item.id} 
                                keyframes={ index % 2 === 0 ? fadeInUpShorter : fadeInRightShorter } 
                                delay={ 400 + (index * 100) } 
                                duration={ 1000 } 
                                triggerOnce
                            >
                                <div className="collection-item grid-item">
                                    <div className="collection-image-wrapper">
                                        <LazyLoadImage
                                            src={item.image}
                                            alt={item.title}
                                            effect="opacity"
                                            className="collection-image"
                                        />
                                        <div className="overlay"></div>
                                    </div>
                                    <div className="collection-content">
                                        <span className="collection-category">{item.category}</span>
                                        <h3 className="collection-title">{item.title}</h3>
                                        <p className="collection-description">{item.description}</p>
                                        <ALink href="/pages/shop" className="collection-link">
                                            Shop Now →
                                        </ALink>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>

                {/* View All Button */}
                <Reveal keyframes={ fadeInUpShorter } delay={ 800 } duration={ 1000 } triggerOnce>
                    <div className="collection-footer">
                        <ALink href="/pages/shop" className="btn btn-primary btn-modern btn-lg">
                            View All Collections
                            <i className="d-icon-arrow-right"></i>
                        </ALink>
                    </div>
                </Reveal>
            </div>

            <style jsx>{`
                .best-collection-section {
                    padding: 80px 0;
                    background: #fff;
                    position: relative;
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 60px;
                }

                .section-subtitle {
                    display: inline-block;
                    font-size: 14px;
                    font-weight: 600;
                    color: #26c;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 12px;
                }

                .section-title {
                    font-size: 48px;
                    font-weight: 800;
                    color: #222;
                    margin-bottom: 16px;
                    line-height: 1.2;
                }

                .section-description {
                    font-size: 16px;
                    color: #666;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .collection-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-bottom: 50px;
                }

                .featured-item {
                    grid-row: span 2;
                }

                .collection-grid-items {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                }

                .collection-item {
                    position: relative;
                    border-radius: 20px;
                    overflow: hidden;
                    background: #f8f9fa;
                    transition: all 0.4s ease;
                    cursor: pointer;
                }

                .collection-item:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                }

                .collection-image-wrapper {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                }

                .featured-item .collection-image-wrapper {
                    height: 700px;
                }

                .grid-item .collection-image-wrapper {
                    height: 335px;
                }

                .collection-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }

                .collection-item:hover .collection-image {
                    transform: scale(1.1);
                }

                .overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.95) 100%);
                    transition: all 0.4s ease;
                }

                .collection-item:hover .overlay {
                    background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.98) 100%);
                }

                .collection-content {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 40px 30px;
                    color: #fff;
                    z-index: 10;
                }

                .grid-item .collection-content {
                    padding: 25px 20px;
                }

                .collection-category {
                    display: inline-block;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    color: #ffd700;
                    margin-bottom: 8px;
                }

                .collection-title {
                    font-size: 32px;
                    font-weight: 800;
                    color: #fff;
                    margin-bottom: 8px;
                    line-height: 1.2;
                }

                .grid-item .collection-title {
                    font-size: 22px;
                    margin-bottom: 6px;
                }

                .collection-description {
                    font-size: 16px;
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: 20px;
                }

                .grid-item .collection-description {
                    font-size: 14px;
                    margin-bottom: 12px;
                }

                .collection-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 14px 32px;
                    background: #fff;
                    color: #222;
                    font-size: 15px;
                    font-weight: 700;
                    border-radius: 50px;
                    transition: all 0.3s ease;
                    text-decoration: none;
                }

                .collection-btn:hover {
                    background: #26c;
                    color: #fff;
                    transform: translateX(5px);
                }

                .collection-link {
                    display: inline-block;
                    color: #fff;
                    font-size: 14px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .collection-link:hover {
                    color: #ffd700;
                    transform: translateX(5px);
                }

                .collection-footer {
                    text-align: center;
                }

                .btn-modern {
                    padding: 18px 48px;
                    font-size: 16px;
                    font-weight: 700;
                    border-radius: 50px;
                    transition: all 0.3s ease;
                }

                .btn-primary {
                    background: #26c;
                    border: none;
                    color: #fff;
                }

                .btn-primary:hover {
                    background: #1a5bb8;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 30px rgba(34, 102, 204, 0.4);
                }

                .btn-lg {
                    padding: 18px 48px;
                    font-size: 18px;
                }

                /* Responsive */
                @media (max-width: 991px) {
                    .best-collection-section {
                        padding: 60px 0;
                    }

                    .section-title {
                        font-size: 38px;
                    }

                    .collection-grid {
                        grid-template-columns: 1fr;
                    }

                    .featured-item {
                        grid-row: span 1;
                    }

                    .featured-item .collection-image-wrapper {
                        height: 500px;
                    }

                    .collection-grid-items {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                @media (max-width: 767px) {
                    .best-collection-section {
                        padding: 50px 0;
                    }

                    .section-header {
                        margin-bottom: 40px;
                    }

                    .section-title {
                        font-size: 32px;
                    }

                    .collection-grid {
                        gap: 20px;
                    }

                    .collection-grid-items {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }

                    .featured-item .collection-image-wrapper {
                        height: 400px;
                    }

                    .grid-item .collection-image-wrapper {
                        height: 300px;
                    }

                    .collection-title {
                        font-size: 26px;
                    }

                    .grid-item .collection-title {
                        font-size: 20px;
                    }

                    .collection-content {
                        padding: 30px 20px;
                    }
                }

                @media (max-width: 575px) {
                    .section-title {
                        font-size: 28px;
                    }

                    .collection-btn {
                        padding: 12px 24px;
                        font-size: 14px;
                    }

                    .btn-modern {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>
        </section>
    )
}

export default React.memo( BestCollection );
