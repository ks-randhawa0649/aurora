import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import ALink from '~/components/features/custom-link';
import Pagination from '~/components/features/pagination';

function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [perPage] = useState(12);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products_json');
            const data = await response.json();
            console.log('Fetched data:', data);
            
            const productList = data.data || data.products || [];
            console.log('Product list:', productList);
            
            setProducts(productList);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
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

    return (
        <main className="main shop">
            <Helmet>
                <title>SmartStyle | Shop</title>
            </Helmet>

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
                                <div className="empty-cart text-center">
                                    <p>No products found.</p>
                                    <i className="d-icon-bag"></i>
                                </div>
                            ) : (
                                <>
                                    <div className="toolbox">
                                        <div className="toolbox-left">
                                            <p className="showing-info mb-2 mb-sm-0">
                                                Showing <span>{products.length} Products</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="row cols-2 cols-sm-3 cols-lg-4 product-wrapper">
                                        {products.map((product, index) => (
                                            <div className="product-wrap" key={`product-${product.id || index}`}>
                                                <div className="product">
                                                    <figure className="product-media">
                                                        <ALink href={`/product/default/${product.slug}`}>
                                                            <img
                                                                src={product.pictures[0]?.url || '/images/placeholder.jpg'}
                                                                alt={product.name}
                                                                width="280"
                                                                height="315"
                                                            />
                                                            {product.pictures[1] && (
                                                                <img
                                                                    src={product.pictures[1].url}
                                                                    alt={product.name}
                                                                    width="280"
                                                                    height="315"
                                                                />
                                                            )}
                                                        </ALink>
                                                        <div className="product-action-vertical">
                                                            <a href="#" className="btn-product-icon btn-cart" data-toggle="modal" data-target="#addCartModal" title="Add to cart">
                                                                <i className="d-icon-bag"></i>
                                                            </a>
                                                            <a href="#" className="btn-product-icon btn-wishlist" title="Add to wishlist">
                                                                <i className="d-icon-heart"></i>
                                                            </a>
                                                        </div>
                                                        <div className="product-action">
                                                            <ALink href={`/product/default/${product.slug}`} className="btn-product btn-quickview" title="Quick View">Quick View</ALink>
                                                        </div>
                                                        {product.is_new && (
                                                            <div className="product-label-group">
                                                                <label className="product-label label-new">New</label>
                                                            </div>
                                                        )}
                                                        {product.discount > 0 && (
                                                            <div className="product-label-group">
                                                                <label className="product-label label-sale">Sale</label>
                                                            </div>
                                                        )}
                                                    </figure>
                                                    <div className="product-details">
                                                        <div className="product-cat">
                                                            {product.categories?.map((cat, i) => (
                                                                <React.Fragment key={i}>
                                                                    <ALink href="#">{cat.name}</ALink>
                                                                    {i < product.categories.length - 1 ? ', ' : ''}
                                                                </React.Fragment>
                                                            ))}
                                                        </div>
                                                        <h3 className="product-name">
                                                            <ALink href={`/product/default/${product.slug}`}>
                                                                {product.name}
                                                            </ALink>
                                                        </h3>
                                                        <div className="product-price">
                                                            {product.discount > 0 ? (
                                                                <>
                                                                    <ins className="new-price">${product.price[1].toFixed(2)}</ins>
                                                                    <del className="old-price">${product.price[0].toFixed(2)}</del>
                                                                </>
                                                            ) : (
                                                                <span className="price">${product.price[0].toFixed(2)}</span>
                                                            )}
                                                        </div>
                                                        <div className="ratings-container">
                                                            <div className="ratings-full">
                                                                <span className="ratings" style={{ width: `${product.ratings * 20}%` }}></span>
                                                                <span className="tooltiptext tooltip-top">{product.ratings?.toFixed(2)}</span>
                                                            </div>
                                                            <ALink href={`/product/default/${product.slug}`} className="rating-reviews">( {product.reviews} reviews )</ALink>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Pagination perPage={perPage} total={products.length} />
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