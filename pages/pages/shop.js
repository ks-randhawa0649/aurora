import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ALink from '~/components/features/custom-link';
import Pagination from '~/components/features/pagination';

function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [perPage] = useState(12);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('/api/products_json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API Response:', data);
            
            // Products are already formatted by the API
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return typeof price === 'number' ? price.toFixed(2) : '0.00';
    };

    if (loading) {
        return (
            <div className="loading-overlay">
                <div className="bounce-loader">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <main className="main shop">
                <Helmet>
                    <title>SmartStyle | Shop</title>
                </Helmet>
                <div className="container">
                    <div className="alert alert-danger mt-10 mb-10">
                        <h4>Error loading products</h4>
                        <p>{error}</p>
                        <button onClick={fetchProducts} className="btn btn-primary mt-3">
                            Try Again
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="main shop">
            <Helmet>
                <title>SmartStyle | Shop</title>
            </Helmet>

            <style jsx>{`
                .product-media {
                    position: relative !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    min-height: auto !important;
                    height: auto !important;
                }
                .product-media::before {
                    display: none !important;
                }
            `}</style>

            <h1 className="d-none">SmartStyle - Shop</h1>

            <nav className="breadcrumb-nav">
                <div className="container">
                    <ul className="breadcrumb">
                        <li><ALink href="/"><i className="d-icon-home"></i></ALink></li>
                        <li>Shop</li>
                    </ul>
                </div>
            </nav>

            <div className="page-content mb-10 pb-3">
                <div className="container">
                    <div className="row main-content-wrap gutter-lg">
                        <div className="col-lg-12">
                            {products.length === 0 ? (
                                <div className="empty-cart text-center mt-10 mb-10">
                                    <p className="mb-4">No products found.</p>
                                    <i className="d-icon-bag" style={{ fontSize: '64px', color: '#ccc' }}></i>
                                    <p className="mt-4">
                                        <ALink href="/" className="btn btn-primary">
                                            Return to Home
                                        </ALink>
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="toolbox">
                                        <div className="toolbox-left">
                                            <p className="showing-info mb-2 mb-sm-0">
                                                Showing <span>{products.length} Product{products.length !== 1 ? 's' : ''}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="row cols-2 cols-sm-3 cols-lg-4 product-wrapper">
                                        {products.map((product) => {
                                            const [regularPrice, salePrice] = product.price || [0, 0];
                                            const hasDiscount = salePrice > 0 && salePrice < regularPrice;
                                            const displayPrice = hasDiscount ? salePrice : regularPrice;
                                            
                                            return (
                                                <div className="product-wrap" key={product.id}>
                                                    <div className="product">
                                                        <figure className="product-media">
                                                            <ALink 
                                                                href={`/product/default/${product.slug}`} 
                                                                style={{ 
                                                                    display: 'block', 
                                                                    position: 'relative', 
                                                                    paddingBottom: '125%', 
                                                                    overflow: 'hidden', 
                                                                    backgroundColor: '#f5f5f5' 
                                                                }}
                                                            >
                                                                <img
                                                                    src={product.pictures[0]?.url || '/images/placeholder.jpg'}
                                                                    alt={product.name}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '0',
                                                                        left: '0',
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'cover'
                                                                    }}
                                                                    onError={(e) => {
                                                                        e.target.src = '/images/placeholder.jpg';
                                                                    }}
                                                                />
                                                            </ALink>
                                                            <div className="product-action-vertical">
                                                                <a href="#" className="btn-product-icon btn-cart" title="Add to cart" onClick={(e) => e.preventDefault()}>
                                                                    <i className="d-icon-bag"></i>
                                                                </a>
                                                                <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist" onClick={(e) => e.preventDefault()}>
                                                                    <i className="d-icon-heart"></i>
                                                                </a>
                                                            </div>
                                                            <div className="product-action">
                                                                <ALink href={`/product/default/${product.slug}`} className="btn-product btn-quickview" title="Quick View">
                                                                    Quick View
                                                                </ALink>
                                                            </div>
                                                            {(product.is_new || hasDiscount) && (
                                                                <div className="product-label-group">
                                                                    {product.is_new && (
                                                                        <label className="product-label label-new">New</label>
                                                                    )}
                                                                    {hasDiscount && (
                                                                        <label className="product-label label-sale">Sale</label>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </figure>
                                                        <div className="product-details">
                                                            {product.categories && product.categories.length > 0 && (
                                                                <div className="product-cat">
                                                                    {product.categories.map((cat, i) => (
                                                                        <React.Fragment key={i}>
                                                                            <ALink href={`/pages/shop?category=${cat.slug}`}>{cat.name}</ALink>
                                                                            {i < product.categories.length - 1 ? ', ' : ''}
                                                                        </React.Fragment>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <h3 className="product-name">
                                                                <ALink href={`/product/default/${product.slug}`}>
                                                                    {product.name}
                                                                </ALink>
                                                            </h3>
                                                            <div className="product-price">
                                                                {hasDiscount ? (
                                                                    <>
                                                                        <ins className="new-price">${formatPrice(salePrice)}</ins>
                                                                        <del className="old-price">${formatPrice(regularPrice)}</del>
                                                                    </>
                                                                ) : (
                                                                    <span className="price">${formatPrice(displayPrice)}</span>
                                                                )}
                                                            </div>
                                                            <div className="ratings-container">
                                                                <div className="ratings-full">
                                                                    <span className="ratings" style={{ width: `${product.ratings * 20}%` }}></span>
                                                                    <span className="tooltiptext tooltip-top">{product.ratings.toFixed(1)}</span>
                                                                </div>
                                                                <ALink href={`/product/default/${product.slug}`} className="rating-reviews">
                                                                    ({product.reviews} reviews)
                                                                </ALink>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {products.length > perPage && (
                                        <Pagination perPage={perPage} total={products.length} />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Shop;