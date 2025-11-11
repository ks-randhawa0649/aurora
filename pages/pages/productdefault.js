import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Helmet from 'react-helmet';
import imagesLoaded from 'imagesloaded';

import MediaOne from '~/components/partials/product/media/media-one';
import DetailOne from '~/components/partials/product/detail/detail-one';
import DescOne from '~/components/partials/product/desc/desc-one';
import RelatedProducts from '~/components/partials/product/related-products';

function ProductDefault() {
    const router = useRouter();
    const { slug } = router.query;
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loaded, setLoadingState] = useState(false);

    useEffect(() => {
        if (slug) {
            fetchProduct();
        }
    }, [slug]);

    useEffect(() => {
        if (!loading && product) {
            imagesLoaded('main').on('done', function () {
                setLoadingState(true);
            }).on('progress', function () {
                setLoadingState(false);
            });
        }
        if (loading) {
            setLoadingState(false);
        }
    }, [loading, product]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/product/${slug}`);
            const data = await response.json();
            
            if (data.product) {
                setProduct(data.product.data);
                setRelated(data.product.related || []);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
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

    if (!product) {
        return (
            <main className="main">
                <div className="container text-center mt-10 mb-10">
                    <h2>Product not found</h2>
                </div>
            </main>
        );
    }

    return (
        <main className="main mt-6 single-product">
            <Helmet>
                <title>{product.name} | SmartStyle</title>
            </Helmet>

            <h1 className="d-none">SmartStyle - {product.name}</h1>

            {
                product !== undefined ?
                    <div className={`page-content mb-10 pb-6 ${loaded ? '' : 'd-none'}`}>
                        <div className="container vertical">
                            <div className="product product-single row mb-7">
                                <div className="col-md-6 sticky-sidebar-wrapper">
                                    <MediaOne product={product} />
                                </div>

                                <div className="col-md-6">
                                    <DetailOne data={{ product: { data: product } }} />
                                </div>
                            </div>

                            <DescOne product={product} />

                            <RelatedProducts products={related} />
                        </div>
                    </div> : ''
            }
        </main>
    );
}

export default ProductDefault;