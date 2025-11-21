import React from 'react';
import { connect } from 'react-redux';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import ALink from '~/components/features/custom-link';
import { cartActions } from '~/store/cart';
import { modalActions } from '~/store/modal';
import { wishlistActions } from '~/store/wishlist';

function ProductTwo( props ) {
    const { product, adClass = '', toggleWishlist, addToCart, openQuickview } = props;

    if (!product) {
        return null;
    }

    // Get image URL safely
    const getImageUrl = () => {
        if (product.pictures && Array.isArray(product.pictures) && product.pictures.length > 0) {
            return product.pictures[0].url;
        }
        return '/images/placeholder.jpg';
    };

    const imageUrl = getImageUrl();

    const wishlistHandler = (e) => {
        e.preventDefault();
        if (props.wishlist.findIndex(item => item.slug === product.slug) === -1) {
            toggleWishlist(product);
        }
    };

    const addToCartHandler = (e) => {
        e.preventDefault();
        addToCart({ ...product, qty: 1, price: product.price[0] });
    };

    const quickViewHandler = (e) => {
        e.preventDefault();
        openQuickview(product.slug);
    };

    return (
        <div className={ `product ${ adClass }` }>
            <figure className="product-media">
                <ALink href={ `/product/default/${ product.slug }` }>
                    <LazyLoadImage
                        alt={ product.name }
                        src={ imageUrl }
                        threshold={ 500 }
                        effect="opacity"
                        width="300"
                        height="338"
                        onError={(e) => {
                            e.target.src = '/images/placeholder.jpg';
                        }}
                    />
                </ALink>

                <div className="product-action-vertical">
                    <a 
                        href="#" 
                        className="btn-product-icon btn-cart" 
                        title="Add to cart"
                        onClick={ addToCartHandler }
                    >
                        <i className="d-icon-bag"></i>
                    </a>
                    <a 
                        href="#" 
                        className="btn-product-icon btn-wishlist" 
                        title="Add to wishlist"
                        onClick={ wishlistHandler }
                    >
                        <i className="d-icon-heart"></i>
                    </a>
                </div>

                <div className="product-action">
                    <ALink 
                        href="#" 
                        className="btn-product btn-quickview" 
                        title="Quick View"
                        onClick={ quickViewHandler }
                    >
                        Quick View
                    </ALink>
                </div>

                {product.is_new && (
                    <div className="product-label-group">
                        <label className="product-label label-new">New</label>
                    </div>
                )}
            </figure>

            <div className="product-details">
                {product.categories && product.categories.length > 0 && (
                    <div className="product-cat">
                        {product.categories.map((cat, i) => (
                            <React.Fragment key={i}>
                                <ALink href={`/pages/shop?category=${cat.slug}`}>
                                    {cat.name}
                                </ALink>
                                {i < product.categories.length - 1 ? ', ' : ''}
                            </React.Fragment>
                        ))}
                    </div>
                )}

                <h3 className="product-name">
                    <ALink href={ `/product/default/${ product.slug }` }>
                        { product.name }
                    </ALink>
                </h3>

                <div className="product-price">
                    {product.price[0] !== product.price[1] ? (
                        <>
                            <ins className="new-price">${product.price[0].toFixed(2)}</ins>
                            <del className="old-price">${product.price[1].toFixed(2)}</del>
                        </>
                    ) : (
                        <ins className="new-price">${product.price[0].toFixed(2)}</ins>
                    )}
                </div>

                {product.ratings > 0 && (
                    <div className="ratings-container">
                        <div className="ratings-full">
                            <span className="ratings" style={{ width: `${product.ratings * 20}%` }}></span>
                            <span className="tooltiptext tooltip-top">{product.ratings.toFixed(1)}</span>
                        </div>
                        <ALink href={ `/product/default/${ product.slug }` } className="rating-reviews">
                            ({ product.reviews } reviews)
                        </ALink>
                    </div>
                )}
            </div>
        </div>
    );
}

function mapStateToProps( state ) {
    return {
        wishlist: state.wishlist.data || []
    };
}

export default connect( mapStateToProps, { 
    toggleWishlist: wishlistActions.toggleWishlist, 
    addToCart: cartActions.addToCart, 
    ...modalActions 
} )( ProductTwo );