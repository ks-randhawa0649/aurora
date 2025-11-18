import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useRouter } from 'next/router';
import ALink from '~/components/features/custom-link';
import ProductTwo from '~/components/features/product/product-two';

function Shop() {
    const router = useRouter();
    const query = router.query;
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState(4); // Default columns
    const [sortBy, setSortBy] = useState('default');
    const [perPage] = useState(12);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Prices array for filter
    const prices = [
        { min: '0', max: '50' },
        { min: '50', max: '100' },
        { min: '100', max: '200' },
        { min: '200', max: '' }
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [products, query, sortBy]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 992) {
                setSidebarOpen(false);
                document.querySelector('body')?.classList.remove('sidebar-active');
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products_json');
            const data = await response.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...products];

        // Filter by category
        if (query.category) {
            filtered = filtered.filter(p => p.category === query.category);
        }

        // Filter by price range
        if (query.min_price || query.max_price) {
            const minPrice = query.min_price ? parseInt(query.min_price) : 0;
            const maxPrice = query.max_price ? parseInt(query.max_price) : Infinity;
            filtered = filtered.filter(p => {
                const price = p.discount > 0 ? p.price[1] : p.price[0];
                return price >= minPrice && price <= maxPrice;
            });
        }

        // Filter by colors
        if (query.colors) {
            const colorArray = query.colors.split(',');
            filtered = filtered.filter(p =>
                p.variants.some(v => colorArray.includes(v.color.name.toLowerCase()))
            );
        }

        // Filter by sizes
        if (query.sizes) {
            const sizeArray = query.sizes.split(',');
            filtered = filtered.filter(p =>
                p.variants.some(v => sizeArray.includes(v.size.name))
            );
        }

        // Sort products
        if (sortBy === 'price-asc') {
            filtered.sort((a, b) => (a.discount > 0 ? a.price[1] : a.price[0]) - (b.discount > 0 ? b.price[1] : b.price[0]));
        } else if (sortBy === 'price-desc') {
            filtered.sort((a, b) => (b.discount > 0 ? b.price[1] : b.price[0]) - (a.discount > 0 ? a.price[1] : a.price[0]));
        } else if (sortBy === 'newest') {
            filtered.sort((a, b) => b.is_new - a.is_new);
        } else if (sortBy === 'rating') {
            filtered.sort((a, b) => b.ratings - a.ratings);
        }

        setFilteredProducts(filtered);
    };

    const containsAttrInUrl = (type, value) => {
        if (!query[type]) return false;
        const currentQueries = query[type].split(',');
        return currentQueries.includes(value) || (type === 'max_price' && value === '' && query[type]) || (type === 'min_price' && value === '' && query[type]);
    };

    const selectFilterHandler = () => {
        if (document.querySelectorAll('.select-items .select-item').length === 1) {
            document.querySelector('.select-items')?.removeAttribute('style');
        }
    };

    const cleanAllHandler = () => {
        document.querySelector('.select-items')?.removeAttribute('style');
    };

    const toggleSidebar = (e) => {
        e.preventDefault();
        setSidebarOpen(!sidebarOpen);
        document.querySelector('body')?.classList.toggle('sidebar-active');
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
        document.querySelector('body')?.classList.remove('sidebar-active');
    };

    const hideSidebarOverlay = (e) => {
        if (e.target.classList.contains('sidebar-overlay')) {
            closeSidebar();
        }
    };

    const gridClasses = {
        2: 'cols-2',
        3: 'cols-2 cols-md-3',
        4: 'cols-2 cols-sm-3 cols-lg-4',
        5: 'cols-2 cols-sm-3 cols-md-4 cols-xl-5',
        6: 'cols-2 cols-sm-3 cols-md-4 cols-xl-6'
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
        <main className="main">
            <Helmet>
                <title>SmartStyle | Shop</title>
            </Helmet>

            <h1 className="d-none">SmartStyle - Shop</h1>

            <div className="page-header page-header-bg" style={{ backgroundImage: 'url(/images/page-header-bg.jpg)' }}>
                <div className="container">
                    <h1 className="page-title">Shop</h1>
                    <ul className="breadcrumb">
                        <li><ALink href="/">Home</ALink></li>
                        <li>Shop</li>
                    </ul>
                </div>
            </div>

            <div className="page-content mb-lg-10 mb-0 pb-lg-3 pb-0">
                <div className="container">
                    <div className="row main-content-wrap gutter-lg">
                        {/* Sidebar Filter */}
                        <aside className="col-lg-3 shop-sidebar sidebar-fixed sticky-sidebar-wrapper sidebar">
                            <div className="sidebar-overlay" onClick={hideSidebarOverlay}></div>
                            <ALink className="sidebar-close" href="#" onClick={closeSidebar}>
                                <i className="d-icon-times"></i>
                            </ALink>

                            <div className="sidebar-content">
                                <div className="sticky-sidebar">
                                    {/* Filter Actions */}
                                    <div className="filter-actions mb-4">
                                        <button 
                                            className="btn btn-outline btn-primary btn-icon-right btn-rounded filter-close-btn"
                                            onClick={closeSidebar}
                                        >
                                            Filter
                                            <i className="d-icon-arrow-left"></i>
                                        </button>
                                        <ALink 
                                            href={{ pathname: router.pathname }} 
                                            scroll={false} 
                                            className="filter-clean"
                                        >
                                            Clean All
                                        </ALink>
                                    </div>

                                    {/* Category Filter Widget */}
                                    <div className="widget widget-collapsible">
                                        <h3 className="widget-title">
                                            <span>All Categories</span>
                                            <span className="toggle-btn"></span>
                                        </h3>
                                        <ul className="widget-body filter-items">
                                            {['All Products', 'tops', 'pants', 'shoes', 'accessories', 'outerwear'].map((cat, index) => (
                                                <li key={`cat-${index}`} className={query.category === (cat === 'All Products' ? '' : cat) ? 'show' : ''}>
                                                    <ALink
                                                        href={{
                                                            pathname: router.pathname,
                                                            query: cat === 'All Products' ? {} : { ...query, page: 1, category: cat }
                                                        }}
                                                        className={query.category === (cat === 'All Products' ? '' : cat) ? 'active' : ''}
                                                        scroll={false}
                                                    >
                                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                    </ALink>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Price Filter Widget */}
                                    <div className="widget widget-collapsible">
                                        <h3 className="widget-title">
                                            <span>Filter by Price</span>
                                            <span className="toggle-btn"></span>
                                        </h3>
                                        <div className="widget-body">
                                            <ul className="filter-items">
                                                {[
                                                    { min: '0', max: '50', label: '$0 - $50' },
                                                    { min: '50', max: '100', label: '$50 - $100' },
                                                    { min: '100', max: '200', label: '$100 - $200' },
                                                    { min: '200', max: '', label: '$200+' }
                                                ].map((price, index) => (
                                                    <li key={`price-${index}`} className={query.min_price === price.min ? 'show' : ''}>
                                                        <ALink
                                                            href={{
                                                                pathname: router.pathname,
                                                                query: {
                                                                    ...query,
                                                                    page: 1,
                                                                    min_price: query.min_price === price.min ? '' : price.min,
                                                                    max_price: query.min_price === price.min ? '' : price.max
                                                                }
                                                            }}
                                                            className={query.min_price === price.min ? 'active' : ''}
                                                            scroll={false}
                                                        >
                                                            {price.label}
                                                        </ALink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="col-lg-9 main-content">
                            {/* Toolbox */}
                            <div className="toolbox">
                                <div className="toolbox-left">
                                    <p className="showing-info mb-2 mb-sm-0">
                                        Showing <span>{filteredProducts.length}</span> of <span>{products.length}</span> Products
                                    </p>
                                </div>

                                <div className="toolbox-right">
                                    {/* Sort */}
                                    <div className="toolbox-item">
                                        <label htmlFor="sort-by" className="toolbox-label">Sort by:</label>
                                        <select
                                            id="sort-by"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="form-control form-control-sm select-form"
                                        >
                                            <option value="default">Default</option>
                                            <option value="price-asc">Price (Low to High)</option>
                                            <option value="price-desc">Price (High to Low)</option>
                                            <option value="newest">Newest First</option>
                                            <option value="rating">Top Rated</option>
                                        </select>
                                    </div>

                                    {/* Column Toggle */}
                                    <div className="toolbox-item">
                                        <label htmlFor="columns" className="toolbox-label">Columns:</label>
                                        <select
                                            id="columns"
                                            value={columns}
                                            onChange={(e) => setColumns(parseInt(e.target.value))}
                                            className="form-control form-control-sm select-form"
                                        >
                                            <option value={2}>2 Columns</option>
                                            <option value={3}>3 Columns</option>
                                            <option value={4}>4 Columns</option>
                                            <option value={5}>5 Columns</option>
                                            <option value={6}>6 Columns</option>
                                        </select>
                                    </div>

                                    {/* Filter Toggle Button */}
                                    <div className="toolbox-item">
                                        <button 
                                            className="btn btn-primary btn-sm" 
                                            onClick={toggleSidebar}
                                        >
                                            <i className="d-icon-filter"></i> Filter
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Products Grid */}
                            {filteredProducts.length === 0 ? (
                                <div className="empty-cart text-center">
                                    <p>No products found.</p>
                                    <i className="d-icon-bag"></i>
                                </div>
                            ) : (
                                <div className={`row product-wrapper ${gridClasses[columns]}`}>
                                    {filteredProducts.slice(0, perPage).map((product, index) => (
                                        <div className="product-wrap" key={`product-${product.id || index}`}>
                                            <ProductTwo product={product} adClass="" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Shop;