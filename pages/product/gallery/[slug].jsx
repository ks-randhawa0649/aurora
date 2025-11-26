import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import Helmet from 'react-helmet';
import imagesLoaded from 'imagesloaded';

import withApollo from '~/server/apollo';
import { GET_PRODUCT } from '~/server/queries';

import ALink from '~/components/features/custom-link';
import OwlCarousel from '~/components/features/owl-carousel';

import MediaFour from '~/components/partials/product/media/media-four';
import DetailFour from '~/components/partials/product/detail/detail-four';
import DescOne from '~/components/partials/product/desc/desc-one';
import RelatedProducts from '~/components/partials/product/related-products';
import ProductNav from '~/components/partials/product/product-nav';

import { mainSlider17 } from '~/utils/data/carousel';

function ProductGallery() {
    const slug = useRouter().query.slug;

    if ( !slug ) return '';

    const { data, loading, error } = useQuery( GET_PRODUCT, { variables: { slug } } );
    const [ loaded, setLoadingState ] = useState( false );
    const product = data && data.product.data;
    const related = data && data.product.related;

    useEffect( () => {
        if ( !loading && product )
            imagesLoaded( 'main' ).on( 'done', function () {
                setLoadingState( true );
            } ).on( 'progress', function () {
                setLoadingState( false );
            } );
        if ( loading )
            setLoadingState( false )
    }, [ loading, product ] )

    return (
        <main className="main single-product product-layout-gallery">
            <Helmet>
                <title>Riode React eCommerce Template | Product Gallery</title>
            </Helmet>

            <h1 className="d-none">Riode React eCommerce Template - Product Gallery</h1>

            <style jsx global>{`
                /* Mobile Optimizations for Product Detail Page */
                @media (max-width: 767px) {
                    .page-content {
                        padding: 0 !important;
                    }

                    .container.skeleton-body {
                        padding: 0 10px !important;
                    }

                    /* Product Navigation */
                    .product-navigation {
                        margin-bottom: 15px !important;
                    }

                    .breadcrumb {
                        padding: 10px 0 !important;
                        font-size: 12px !important;
                        margin-bottom: 8px !important;
                    }

                    .breadcrumb li {
                        font-size: 11px !important;
                    }

                    /* Product Single */
                    .product.product-single {
                        margin-bottom: 20px !important;
                        display: flex;
                        flex-direction: column;
                    }

                    /* Product Details */
                    .product-details {
                        padding: 15px 10px !important;
                        margin: 0 !important;
                    }

                    .product-details .col-md-6 {
                        padding: 0 8px !important;
                    }

                    .product-name {
                        font-size: 18px !important;
                        margin-top: 10px !important;
                        margin-bottom: 12px !important;
                        line-height: 1.3 !important;
                    }

                    .product-meta {
                        font-size: 11px !important;
                        margin-bottom: 10px !important;
                    }

                    .product-sku, .product-brand {
                        font-size: 10px !important;
                    }

                    .ratings-container {
                        margin-bottom: 12px !important;
                    }

                    .rating-reviews {
                        font-size: 11px !important;
                    }

                    .product-short-desc {
                        font-size: 13px !important;
                        line-height: 1.5 !important;
                        margin-bottom: 12px !important;
                    }

                    .product-status {
                        margin: 12px 0 !important;
                        font-size: 12px !important;
                    }

                    .product-status li {
                        margin-bottom: 6px !important;
                        padding-left: 20px !important;
                    }

                    .product-price {
                        font-size: 20px !important;
                        margin-bottom: 12px !important;
                    }

                    .product-price ins {
                        font-size: 22px !important;
                    }

                    .product-price del {
                        font-size: 16px !important;
                    }

                    /* Product Form */
                    .product-form {
                        padding: 0 !important;
                    }

                    .product-form .product-variations {
                        margin-bottom: 15px !important;
                    }

                    .product-form label {
                        font-size: 12px !important;
                        margin-bottom: 8px !important;
                    }

                    .product-form .size-guide {
                        font-size: 11px !important;
                    }

                    .product-variation {
                        margin-bottom: 12px !important;
                    }

                    .color-select, .size-select {
                        gap: 8px !important;
                    }

                    .color-select a, .size-select a {
                        min-width: 36px !important;
                        height: 36px !important;
                        font-size: 12px !important;
                    }

                    .product-quantity {
                        margin-right: 10px !important;
                    }

                    .product-form .input-group {
                        width: 100px !important;
                    }

                    .product-form button {
                        font-size: 13px !important;
                        padding: 12px 20px !important;
                    }

                    .product-action {
                        margin-top: 15px !important;
                    }

                    /* Tab Navigation */
                    .tabs-nav-modernn {
                        display: flex !important;
                        flex-wrap: nowrap !important;
                        overflow-x: auto !important;
                        gap: 0 !important;
                        padding: 0 5px !important;
                        margin-bottom: 15px !important;
                        -webkit-overflow-scrolling: touch;
                    }

                    .tabs-nav-modernn::-webkit-scrollbar {
                        display: none;
                    }

                    .tab-item-modern {
                        flex: 0 0 auto !important;
                        min-width: fit-content !important;
                    }

                    .tab-link-modern {
                        font-size: 12px !important;
                        padding: 10px 12px !important;
                        white-space: nowrap !important;
                    }

                    /* Tab Content */
                    .tab-content-modern {
                        padding: 0 8px !important;
                    }

                    .tab-panel-modern {
                        padding: 15px 0 !important;
                    }

                    /* Features Card */
                    .features-card, .specs-card {
                        padding: 15px !important;
                        margin-bottom: 15px !important;
                    }

                    .section-title-modern {
                        font-size: 16px !important;
                        margin-bottom: 12px !important;
                    }

                    .feature-description {
                        font-size: 13px !important;
                        line-height: 1.5 !important;
                        margin-bottom: 12px !important;
                    }

                    .features-list {
                        font-size: 12px !important;
                        padding-left: 20px !important;
                    }

                    .features-list li {
                        margin-bottom: 6px !important;
                    }

                    /* Specs Table */
                    .specs-table {
                        font-size: 12px !important;
                    }

                    .specs-table th, .specs-table td {
                        padding: 8px 10px !important;
                    }

                    /* Virtual Try-On Section */
                    .virtual-tryon-card {
                        padding: 15px !important;
                        margin-top: 15px !important;
                    }

                    .tryon-header h5 {
                        font-size: 16px !important;
                    }

                    .upload-area {
                        padding: 20px 15px !important;
                        min-height: 180px !important;
                    }

                    .upload-icon svg {
                        font-size: 40px !important;
                    }

                    .upload-text {
                        font-size: 13px !important;
                    }

                    .upload-hint {
                        font-size: 11px !important;
                    }

                    .preview-container {
                        max-height: 250px !important;
                    }

                    .tryon-actions {
                        gap: 8px !important;
                        flex-direction: column !important;
                    }

                    .btn-tryon, .btn-reset {
                        width: 100% !important;
                        font-size: 13px !important;
                        padding: 12px 20px !important;
                    }

                    /* Reviews Section */
                    .reviews-container {
                        padding: 0 !important;
                    }

                    .review-stats {
                        padding: 15px !important;
                        margin-bottom: 15px !important;
                    }

                    .overall-rating h2 {
                        font-size: 40px !important;
                    }

                    .rating-breakdown {
                        font-size: 12px !important;
                    }

                    .review-item {
                        padding: 15px !important;
                        margin-bottom: 12px !important;
                    }

                    .reviewer-name {
                        font-size: 13px !important;
                    }

                    .review-date {
                        font-size: 11px !important;
                    }

                    .review-text {
                        font-size: 12px !important;
                        line-height: 1.5 !important;
                    }

                    .review-form {
                        padding: 15px !important;
                    }

                    .review-form input,
                    .review-form textarea {
                        font-size: 13px !important;
                        padding: 10px 12px !important;
                    }

                    .review-form button {
                        font-size: 13px !important;
                        padding: 12px 24px !important;
                    }

                    /* Related Products Section */
                    .related-products-section {
                        margin-top: 20px !important;
                        padding: 15px 0 !important;
                    }

                    .related-products-section h2 {
                        font-size: 18px !important;
                        margin-bottom: 15px !important;
                        padding: 0 10px !important;
                    }

                    .product-card-premium {
                        min-width: 140px !important;
                        max-width: 140px !important;
                        margin-bottom: 0 !important;
                    }

                    .infinite-scroll-track {
                        gap: 12px !important;
                        padding: 0 10px !important;
                    }

                    .image-wrapper {
                        height: 180px !important;
                    }

                    .product-info {
                        padding: 10px 8px !important;
                    }

                    .category-badge {
                        font-size: 9px !important;
                        padding: 3px 8px !important;
                    }

                    .product-title {
                        font-size: 12px !important;
                        line-height: 1.3 !important;
                        margin: 6px 0 !important;
                        -webkit-line-clamp: 2 !important;
                    }

                    .rating-row {
                        margin-bottom: 6px !important;
                    }

                    .stars-display svg {
                        font-size: 12px !important;
                    }

                    .review-count {
                        font-size: 10px !important;
                    }

                    .price-row {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 4px !important;
                    }

                    .current-price {
                        font-size: 14px !important;
                    }

                    .original-price {
                        font-size: 11px !important;
                    }

                    .savings-badge {
                        font-size: 9px !important;
                        padding: 2px 6px !important;
                    }

                    .badge-premium {
                        padding: 3px 6px !important;
                        font-size: 8px !important;
                    }

                    .quick-actions {
                        gap: 4px !important;
                        top: 6px !important;
                        right: 6px !important;
                    }

                    .quick-action-btn {
                        width: 28px !important;
                        height: 28px !important;
                    }

                    .quick-action-btn svg {
                        font-size: 16px !important;
                    }

                    /* Hide elements on mobile for cleaner look */
                    .product-nav {
                        display: none !important;
                    }

                    /* Additional Info Tab */
                    .additional-info-table {
                        font-size: 12px !important;
                    }

                    .additional-info-table th,
                    .additional-info-table td {
                        padding: 8px 10px !important;
                    }

                    /* Size Guide */
                    .size-guide-table {
                        font-size: 11px !important;
                        overflow-x: auto !important;
                        display: block !important;
                    }

                    .size-guide-table th,
                    .size-guide-table td {
                        padding: 6px 8px !important;
                        min-width: 60px !important;
                    }
                }

                /* Smaller mobile screens */
                @media (max-width: 575px) {
                    .product-name {
                        font-size: 16px !important;
                    }

                    .tab-link-modern {
                        font-size: 11px !important;
                        padding: 8px 10px !important;
                    }

                    .product-card-premium {
                        min-width: 130px !important;
                        max-width: 130px !important;
                    }

                    .image-wrapper {
                        height: 160px !important;
                    }
                }
            `}</style>

            {
                product !== undefined ?
                    <div className={ `page-content mb-10 pb-6 ${ loaded ? '' : 'd-none' }` }>
                        <div className="container skeleton-body">

                            <div className="product-navigation">
                                <ul className="breadcrumb breadcrumb-lg">
                                    <li><ALink href="/"><i className="d-icon-home"></i></ALink></li>
                                    <li><ALink href="#" className="active">Products</ALink></li>
                                    <li>Detail</li>
                                </ul>

                                <ProductNav product={ data.product } />
                            </div>

                            <div className="product product-single mb-4">
                                <MediaFour product={ product } />

                                <DetailFour data={ data } />
                            </div>

                            <DescOne product={ product } />

                            <RelatedProducts products={ related } />
                        </div>
                    </div> : ''
            }
            {
                loaded && !loading ? ''
                    : <div className="skeleton-body product product-single container mt-10 pt-3 mb-10">
                        <div className="pg-gallery mb-4">
                            <div className="skel-pro-gallery mb-6"></div>

                            <div className="skel-pro-summary"></div>
                        </div>

                        <div className="skel-pro-tabs"></div>

                        <section className="pt-3 mt-4">
                            <h2 className="title justify-content-center">Related Products</h2>

                            <OwlCarousel adClass="owl-carousel owl-theme owl-nav-full" options={ mainSlider17 }>
                                {
                                    [ 1, 2, 3, 4, 5, 6 ].map( ( item ) =>
                                        <div className="product-loading-overlay" key={ 'popup-skel-' + item }></div>
                                    )
                                }
                            </OwlCarousel>
                        </section>
                    </div>
            }
        </main>
    )
}

export default withApollo( { ssr: typeof window === 'undefined' } )( ProductGallery );