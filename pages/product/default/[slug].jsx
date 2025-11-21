import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Helmet from 'react-helmet';

import ALink from '~/components/features/custom-link';
import MediaOne from '~/components/partials/product/media/media-one';
import DetailOne from '~/components/partials/product/detail/detail-one';
import DescOne from '~/components/partials/product/desc/desc-one';
import RelatedProducts from '~/components/partials/product/related-products';

const generateSlug = (name) => 
    (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const getCategoryName = (categoryCode) => {
    const map = {
        'unisex_topwear': 'Tops',
        'unisex_bottomwear': 'Pants'
    };
    return map[categoryCode] || 'Clothing';
};

const isNewProduct = (createdAt) => {
    if (!createdAt) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(createdAt) > thirtyDaysAgo;
};

function ProductDefault() {
    const router = useRouter();
    const { slug } = router.query;
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (slug) {
            fetchProduct();
        }
    }, [slug]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`/api/product_json?slug=${encodeURIComponent(slug)}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch product');
            }
            
            if (!data.product?.data) {
                throw new Error('Invalid product data');
            }
            
            const raw = data.product.data;
            
            // Process variants from database
            const processedVariants = Array.isArray(raw.variants) && raw.variants.length > 0
                ? raw.variants.map(v => ({
                    variant_id: v.variant_id,
                    sku: v.sku,
                    size: v.size || 'One Size',
                    color: v.color ? (typeof v.color === 'string' ? [v.color] : v.color) : [],
                    price: parseFloat(v.price) || 0,
                    currency: v.currency || 'USD',
                    stock: parseInt(v.stock_qty) || 0
                }))
                : [];

            // Ensure images is an array and has at least one item
            const imageUrls = Array.isArray(raw.images) && raw.images.length > 0 
                ? raw.images 
                : ['/images/placeholder.jpg'];

            // Format product
            const formattedProduct = {
                id: raw.product_id,
                slug: slug,
                name: raw.name,
                brand: raw.brand || 'SmartStyle',
                sku: raw.product_id.substring(0, 8).toUpperCase(),
                category: raw.category,
                description: raw.description || 'No description available.',
                short_description: raw.description 
                    ? (raw.description.length > 150 ? raw.description.substring(0, 150) + '...' : raw.description)
                    : 'No description available.',
                
                pictures: imageUrls.map(url => ({ 
                    url: url,
                    width: 800, 
                    height: 1000 
                })),
                
                small_pictures: imageUrls.map(url => ({ 
                    url: url,
                    width: 300, 
                    height: 375 
                })),
                
                price: [
                    parseFloat(raw.min_price) || 0,
                    parseFloat(raw.max_price) || parseFloat(raw.min_price) || 0
                ],
                
                ratings: 4.5,
                reviews: Math.floor(Math.random() * 50) + 10,
                stock: processedVariants.reduce((sum, v) => sum + v.stock, 0) || 100,
                discount: 0,
                is_new: isNewProduct(raw.created_at),
                
                categories: [{
                    name: getCategoryName(raw.category),
                    slug: raw.category
                }],
                
                brands: [{
                    name: raw.brand || 'SmartStyle',
                    slug: generateSlug(raw.brand || 'SmartStyle')
                }],
                
                variants: processedVariants,
                
                size: [...new Set(processedVariants.map(v => v.size).filter(Boolean))],
                colors: [...new Set(processedVariants.flatMap(v => v.color).filter(Boolean))]
            };
            
            setProduct(formattedProduct);
            
            // Process related products
            if (Array.isArray(data.product.related) && data.product.related.length > 0) {
                const formattedRelated = data.product.related.map(rel => {
                    const relImageUrls = Array.isArray(rel.images) && rel.images.length > 0 
                        ? rel.images 
                        : ['/images/placeholder.jpg'];
                    
                    return {
                        id: rel.product_id,
                        slug: generateSlug(rel.name),
                        name: rel.name,
                        brand: rel.brand || 'SmartStyle',
                        category: rel.category,
                        
                        // Use images directly - they're already full paths from API
                        pictures: relImageUrls.map(url => ({ 
                            url: url,
                            width: 280, 
                            height: 350 
                        })),
                        
                        price: [
                            parseFloat(rel.min_price) || 0,
                            parseFloat(rel.max_price) || parseFloat(rel.min_price) || 0
                        ],
                        
                        ratings: 4,
                        reviews: Math.floor(Math.random() * 30) + 5,
                        is_new: isNewProduct(rel.created_at),
                        
                        categories: [{
                            name: getCategoryName(rel.category),
                            slug: rel.category
                        }],
                        
                        variants: []
                    };
                });
                
                setRelated(formattedRelated);
            }
            
        } catch (error) {
            console.error('Error loading product:', error);
            setError(error.message);
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

    if (error || !product) {
        return (
            <main className="main">
                <Helmet>
                    <title>Product Not Found | SmartStyle</title>
                </Helmet>
                <div className="container text-center mt-10 mb-10">
                    <h2 className="mb-4">Product Not Found</h2>
                    <p className="mb-4 text-grey">{error || "The product you're looking for doesn't exist."}</p>
                    <p className="mb-6"><small className="text-muted">Slug: {slug}</small></p>
                    <ALink href="/pages/shop" className="btn btn-primary btn-rounded">
                        <i className="d-icon-arrow-left"></i> Back to Shop
                    </ALink>
                </div>
            </main>
        );
    }

    return (
        <main className="main mt-6 single-product">
            <Helmet>
                <title>{product.name} | SmartStyle</title>
                <meta name="description" content={product.short_description} />
            </Helmet>

            <h1 className="d-none">{product.name} - SmartStyle</h1>

            <nav className="breadcrumb-nav">
                <div className="container">
                    <ul className="breadcrumb">
                        <li><ALink href="/"><i className="d-icon-home"></i></ALink></li>
                        <li><ALink href="/pages/shop">Shop</ALink></li>
                        {product.categories?.[0] && (
                            <li>
                                <ALink href={`/pages/shop?category=${product.categories[0].slug}`}>
                                    {product.categories[0].name}
                                </ALink>
                            </li>
                        )}
                        <li>{product.name}</li>
                    </ul>
                </div>
            </nav>

            <div className="page-content mb-10 pb-6">
                <div className="container">
                    <div className="product product-single row mb-8">
                        <div className="col-md-6 mb-6">
                            <MediaOne product={product} />
                        </div>

                        <div className="col-md-6 mb-6">
                            <DetailOne data={{ product: { data: product } }} />
                        </div>
                    </div>

                    <DescOne product={product} />

                    {related.length > 0 && (
                        <div className="mt-8">
                            <RelatedProducts products={related} />
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default ProductDefault;