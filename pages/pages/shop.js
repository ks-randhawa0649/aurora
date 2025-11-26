import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import Reveal from 'react-awesome-reveal';
import ALink from '~/components/features/custom-link';
import Pagination from '~/components/features/pagination';
import { fadeInUpShorter } from '~/utils/data/keyframes';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

function Shop() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [perPage] = useState(12);
    const [gridView, setGridView] = useState(4); // Default 4 columns for desktop
    
    // Filter states
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [selectedRating, setSelectedRating] = useState(0);
    const [sortBy, setSortBy] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [products, selectedCategory, priceRange, selectedRating, sortBy, searchQuery]);

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
            
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const router = useRouter();
    const { search } = router.query;

    // Sync search query from URL safely (avoid setState during render)
    useEffect(() => {
        console.log('Search query from URL:', search);  
        setSearchQuery(typeof search === 'string' ? search : '');
    }, [router.isReady, search]);

    const applyFilters = () => {
        let filtered = [...products];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(product => 
                product.UI_pname.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product => 
                product.categories?.some(cat => cat.slug === selectedCategory)
            );
        }

        // Price filter
        filtered = filtered.filter(product => {
            const [regularPrice, salePrice] = product.price || [0, 0];
            const price = salePrice > 0 ? salePrice : regularPrice;
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Rating filter
        if (selectedRating > 0) {
            filtered = filtered.filter(product => product.ratings >= selectedRating);
        }

        // Sort
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => {
                    const priceA = a.price[1] > 0 ? a.price[1] : a.price[0];
                    const priceB = b.price[1] > 0 ? b.price[1] : b.price[0];
                    return priceA - priceB;
                });
                break;
            case 'price-high':
                filtered.sort((a, b) => {
                    const priceA = a.price[1] > 0 ? a.price[1] : a.price[0];
                    const priceB = b.price[1] > 0 ? b.price[1] : b.price[0];
                    return priceB - priceA;
                });
                break;
            case 'rating':
                filtered.sort((a, b) => b.ratings - a.ratings);
                break;
            case 'newest':
                filtered.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
                break;
            default:
                break;
        }

        setFilteredProducts(filtered);
    };

    const getCategories = () => {
        const categories = new Set();
        products.forEach(product => {
            product.categories?.forEach(cat => {
                categories.add(JSON.stringify({ name: cat.name, slug: cat.slug }));
            });
        });
        return Array.from(categories).map(cat => JSON.parse(cat));
    };

    const resetFilters = () => {
        setSelectedCategory('all');
        setPriceRange([0, 500]);
        setSelectedRating(0);
        setSortBy('default');
        setSearchQuery('');
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
                .shop-page {
                    background: #f8f9fa;
                    padding: 40px 0 60px;
                }

                .shop-header {
                    background: linear-gradient(135deg, 
                        #667eea 0%, 
                        #764ba2 25%, 
                        #f093fb 50%, 
                        #4facfe 75%, 
                        #00f2fe 100%);
                    padding: 60px 0;
                    margin-bottom: 40px;
                    margin-top: 4rem;
                    color: #fff;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }

                .shop-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: 
                        radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
                }

                .shop-title {
                    font-size: 48px;
                    font-weight: 800;
                    margin-bottom: 12px;
                    color: #fff;
                    position: relative;
                    z-index: 1;
                }

                .shop-subtitle {
                    font-size: 18px;
                    opacity: 0.9;
                    position: relative;
                    z-index: 1;
                }

                .filter-toggle-btn {
                    display: none;
                    width: 100%;
                    padding: 12px 20px;
                    background: #26c;
                    color: #fff;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .filter-toggle-btn:hover {
                    background: #1a5bb8;
                    transform: translateY(-2px);
                }

                .filters-sidebar {
                    background: #fff;
                    padding: 30px;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                    position: sticky;
                    top: 100px;
                    max-height: calc(100vh - 120px);
                    overflow-y: auto;
                }

                .filter-section {
                    margin-bottom: 30px;
                    padding-bottom: 30px;
                    border-bottom: 1px solid #eee;
                }

                .filter-section:last-child {
                    border-bottom: none;
                    margin-bottom: 0;
                }

                .filter-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #222;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .filter-title i {
                    color: #26c;
                }

                .search-box {
                    position: relative;
                    margin-bottom: 20px;
                }

                .search-box input {
                    width: 100%;
                    padding: 12px 40px 12px 16px;
                    border: 2px solid #e9ecef;
                    border-radius: 10px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }

                .search-box input:focus {
                    outline: none;
                    border-color: #26c;
                }

                .search-box i {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #999;
                }

                .category-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .category-item {
                    padding: 10px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-bottom: 6px;
                    font-size: 14px;
                    color: #555;
                }

                .category-item:hover {
                    background: #f8f9fa;
                    color: #26c;
                    transform: translateX(4px);
                }

                .category-item.active {
                    background: #e3f2fd;
                    color: #26c;
                    font-weight: 600;
                }

                .price-range-display {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 16px;
                    font-size: 14px;
                    color: #666;
                    font-weight: 600;
                }

                .price-slider {
                    width: 100%;
                    height: 6px;
                    background: #e9ecef;
                    border-radius: 3px;
                    position: relative;
                    margin-bottom: 20px;
                }

                .price-input {
                    width: 100%;
                    margin-bottom: 10px;
                }

                .price-input input {
                    width: 100%;
                }

                .rating-filter {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .rating-option {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 14px;
                }

                .rating-option:hover {
                    background: #f8f9fa;
                }

                .rating-option.active {
                    background: #e3f2fd;
                    color: #26c;
                }

                .rating-stars {
                    display: flex;
                    gap: 2px;
                }

                .rating-stars i {
                    color: #ffd700;
                    font-size: 14px;
                }

                .reset-btn {
                    width: 100%;
                    padding: 12px;
                    background: #f8f9fa;
                    border: 2px solid #e9ecef;
                    border-radius: 10px;
                    color: #666;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 20px;
                }

                .reset-btn:hover {
                    background: #fff;
                    border-color: #26c;
                    color: #26c;
                }

                .products-section {
                    background: #fff;
                    padding: 30px;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                }

                .products-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                    gap: 16px;
                }

                .products-controls {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    flex-wrap: wrap;
                }

                .grid-view-toggle {
                    display: flex;
                    gap: 8px;
                    background: #f8f9fa;
                    padding: 4px;
                    border-radius: 8px;
                }

                .grid-btn {
                    width: 36px;
                    height: 36px;
                    border: none;
                    background: transparent;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #666;
                    font-weight: 600;
                    font-size: 12px;
                }

                .grid-btn:hover {
                    background: rgba(34, 102, 204, 0.1);
                    color: #26c;
                }

                .grid-btn.active {
                    background: #26c;
                    color: #fff;
                }

                .products-count {
                    font-size: 16px;
                    color: #666;
                }

                .products-count span {
                    font-weight: 700;
                    color: #26c;
                }

                .sort-select {
                    padding: 10px 40px 10px 16px;
                    border: 2px solid #e9ecef;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #555;
                    cursor: pointer;
                    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23555' d='M6 9L1 4h10z'/%3E%3C/svg%3E") no-repeat right 12px center;
                    appearance: none;
                    transition: all 0.3s ease;
                }

                .sort-select:focus {
                    outline: none;
                    border-color: #26c;
                }

                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 30px;
                    margin-bottom: 40px;
                }

                .products-grid.grid-1 {
                    grid-template-columns: 1fr;
                }

                .products-grid.grid-2 {
                    grid-template-columns: repeat(2, 1fr);
                }

                .products-grid.grid-3 {
                    grid-template-columns: repeat(3, 1fr);
                }

                .products-grid.grid-4 {
                    grid-template-columns: repeat(4, 1fr);
                }

                .product-card {
                    background: #fff;
                    border-radius: 16px;
                    overflow: hidden;
                    transition: all 0.4s ease;
                    border: 1px solid #f0f0f0;
                    position: relative;
                }

                .product-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
                }

                .product-image-wrapper {
                    position: relative;
                    padding-bottom: 125%;
                    overflow: hidden;
                    background: #f8f9fa;
                }

                .product-image {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.6s ease;
                }

                .product-card:hover .product-image {
                    transform: scale(1.1);
                }

                .product-badges {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    z-index: 10;
                }

                .product-badge {
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .badge-new {
                    background: #4caf50;
                    color: #fff;
                }

                .badge-sale {
                    background: #f44336;
                    color: #fff;
                }

                .product-actions {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    opacity: 0;
                    transform: translateX(10px);
                    transition: all 0.3s ease;
                }

                .product-card:hover .product-actions {
                    opacity: 1;
                    transform: translateX(0);
                }

                .action-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #fff;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    transition: all 0.3s ease;
                    color: #555;
                }

                .action-btn:hover {
                    background: #26c;
                    color: #fff;
                    transform: scale(1.1);
                }

                .quick-view-btn {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    padding: 12px;
                    background: rgba(34, 102, 204, 0.95);
                    color: #fff;
                    border: none;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transform: translateY(100%);
                    transition: all 0.3s ease;
                }

                .product-card:hover .quick-view-btn {
                    transform: translateY(0);
                }

                .quick-view-btn:hover {
                    background: rgba(26, 91, 184, 1);
                }

                .product-info {
                    padding: 20px;
                }

                .product-category {
                    font-size: 12px;
                    color: #26c;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 8px;
                }

                .product-name {
                    font-size: 16px;
                    font-weight: 700;
                    color: #222;
                    margin-bottom: 12px;
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .product-name a {
                    color: #222;
                    text-decoration: none;
                    transition: color 0.3s ease;
                }

                .product-name a:hover {
                    color: #26c;
                }

                .product-rating {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;
                }

                .stars {
                    display: flex;
                    gap: 2px;
                    align-items: center;
                }

                .reviews-count {
                    font-size: 12px;
                    color: #999;
                }

                .product-price {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 700;
                }

                .current-price {
                    font-size: 20px;
                    color: #26c;
                }

                .original-price {
                    font-size: 16px;
                    color: #999;
                    text-decoration: line-through;
                }

                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                }

                .empty-state i {
                    font-size: 80px;
                    color: #ddd;
                    margin-bottom: 20px;
                }

                .empty-state h3 {
                    font-size: 24px;
                    color: #555;
                    margin-bottom: 12px;
                }

                .empty-state p {
                    color: #999;
                    margin-bottom: 24px;
                }

                @media (max-width: 991px) {
                    .shop-title {
                        font-size: 36px;
                    }

                    .filters-sidebar {
                        position: static;
                        margin-bottom: 30px;
                    }

                    .products-grid {
                        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                        gap: 20px;
                    }

                    .filter-toggle-btn {
                        display: block;
                    }

                    .filters-sidebar {
                        display: none;
                    }

                    .filters-sidebar.show {
                        display: block;
                    }
                }

                @media (max-width: 767px) {
                    .shop-header {
                        padding: 30px 0;
                        margin-bottom: 20px;
                    }

                    .shop-title {
                        font-size: 24px;
                        margin-bottom: 8px;
                    }

                    .shop-subtitle {
                        font-size: 14px;
                    }

                    .shop-page {
                        padding: 20px 0 30px;
                    }

                    .products-grid,
                    .products-grid.grid-1,
                    .products-grid.grid-2,
                    .products-grid.grid-3,
                    .products-grid.grid-4 {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 8px;
                    }

                    .products-section {
                        padding: 15px 10px;
                        border-radius: 15px;
                    }

                    .product-card {
                        border-radius: 10px;
                    }

                    .product-image-wrapper {
                        padding-bottom: 140%;
                    }

                    .product-info {
                        padding: 10px;
                    }

                    .product-name {
                        font-size: 12px;
                        margin-bottom: 6px;
                        -webkit-line-clamp: 2;
                    }

                    .product-category {
                        font-size: 9px;
                        margin-bottom: 4px;
                    }

                    .product-rating {
                        margin-bottom: 6px;
                    }

                    .stars svg {
                        width: 11px !important;
                        height: 11px !important;
                    }

                    .reviews-count {
                        font-size: 9px;
                    }

                    .current-price {
                        font-size: 14px;
                    }

                    .original-price {
                        font-size: 11px;
                    }

                    .product-badge {
                        padding: 3px 6px;
                        font-size: 8px;
                    }

                    .product-badges {
                        top: 6px;
                        left: 6px;
                        gap: 4px;
                    }

                    .action-btn {
                        width: 28px;
                        height: 28px;
                    }

                    .action-btn svg {
                        width: 14px !important;
                        height: 14px !important;
                    }

                    .product-actions {
                        top: 6px;
                        right: 6px;
                        gap: 4px;
                    }

                    .quick-view-btn {
                        font-size: 11px;
                        padding: 8px;
                    }

                    .products-header {
                        gap: 10px;
                        margin-bottom: 15px;
                    }

                    .products-count {
                        font-size: 12px;
                        width: 100%;
                    }

                    .products-controls {
                        width: 100%;
                        justify-content: space-between;
                        gap: 8px;
                    }

                    .sort-select {
                        flex: 1;
                        font-size: 12px;
                        padding: 7px 28px 7px 10px;
                        border-radius: 8px;
                    }

                    .grid-view-toggle {
                        flex-shrink: 0;
                        padding: 3px;
                        gap: 4px;
                    }

                    .grid-btn {
                        width: 28px;
                        height: 28px;
                        font-size: 10px;
                    }

                    .filter-toggle-btn {
                        font-size: 13px;
                        padding: 10px 16px;
                        margin-bottom: 15px;
                    }
                }

                @media (max-width: 575px) {
                    .products-grid.grid-1 {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div className="shop-header">
                <div className="container">
                    <Reveal keyframes={fadeInUpShorter} delay={100} duration={800} triggerOnce>
                        <h1 className="shop-title">Shop Collection</h1>
                        <p className="shop-subtitle">Discover premium fashion pieces curated just for you</p>
                    </Reveal>
                </div>
            </div>

            <div className="shop-page">
                <div className="container">
                    <div className="row">
                        {/* Filters Sidebar */}
                        <div className="col-lg-3">
                            <button 
                                className="filter-toggle-btn"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <i className="d-icon-filter-2"></i> {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>

                            <Reveal keyframes={fadeInUpShorter} delay={200} duration={800} triggerOnce>
                                <div className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
                                    {/* Search */}
                                    <div className="filter-section">
                                        <h3 className="filter-title">
                                            <i className="d-icon-search"></i> Search
                                        </h3>
                                        <div className="search-box">
                                            <input
                                                type="text"
                                                placeholder="Search products..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            <i className="d-icon-search"></i>
                                        </div>
                                    </div>

                                    {/* Categories */}
                                    <div className="filter-section">
                                        <h3 className="filter-title">
                                            <i className="d-icon-layer"></i> Categories
                                        </h3>
                                        <ul className="category-list">
                                            <li 
                                                className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
                                                onClick={() => setSelectedCategory('all')}
                                            >
                                                All Products
                                            </li>
                                            {getCategories().map((cat, index) => (
                                                <li
                                                    key={index}
                                                    className={`category-item ${selectedCategory === cat.slug ? 'active' : ''}`}
                                                    onClick={() => setSelectedCategory(cat.slug)}
                                                >
                                                    {cat.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Price Range */}
                                    <div className="filter-section">
                                        <h3 className="filter-title">
                                            <i className="d-icon-money"></i> Price Range
                                        </h3>
                                        <div className="price-range-display">
                                            <span>${priceRange[0]}</span>
                                            <span>${priceRange[1]}</span>
                                        </div>
                                        <div className="price-input">
                                            <input
                                                type="range"
                                                min="0"
                                                max="500"
                                                value={priceRange[1]}
                                                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                            />
                                        </div>
                                    </div>

                                    {/* Rating Filter */}
                                    {/* <div className="filter-section">
                                        <h3 className="filter-title">
                                            <i className="d-icon-star-full"></i> Minimum Rating
                                        </h3>
                                        <div className="rating-filter">
                                            {[4, 3, 2, 1].map((rating) => (
                                                <div
                                                    key={rating}
                                                    className={`rating-option ${selectedRating === rating ? 'active' : ''}`}
                                                    onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                                                >
                                                    <div className="rating-stars">
                                                        {[...Array(5)].map((_, i) => (
                                                            <i key={i} className={`d-icon-star-full ${i >= rating ? 'empty' : ''}`}></i>
                                                        ))}
                                                    </div>
                                                    <span>& Up</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div> */}

                                    {/* Reset Button */}
                                    <button className="reset-btn" onClick={resetFilters}>
                                        <i className="d-icon-rotate-left"></i> Reset Filters
                                    </button>
                                </div>
                            </Reveal>
                        </div>

                        {/* Products Section */}
                        <div className="col-lg-9">
                            <Reveal keyframes={fadeInUpShorter} delay={300} duration={800} triggerOnce>
                                <div className="products-section">
                                    <div className="products-header">
                                        <p className="products-count">
                                            Showing <span>{filteredProducts.length}</span> of <span>{products.length}</span> Products
                                        </p>
                                        <div className="products-controls">
                                            <div className="grid-view-toggle">
                                                <button 
                                                    className={`grid-btn ${gridView === 1 ? 'active' : ''}`}
                                                    onClick={() => setGridView(1)}
                                                    title="1 Column"
                                                >
                                                    1
                                                </button>
                                                <button 
                                                    className={`grid-btn ${gridView === 2 ? 'active' : ''}`}
                                                    onClick={() => setGridView(2)}
                                                    title="2 Columns"
                                                >
                                                    2
                                                </button>
                                                <button 
                                                    className={`grid-btn ${gridView === 3 ? 'active' : ''}`}
                                                    onClick={() => setGridView(3)}
                                                    title="3 Columns"
                                                >
                                                    3
                                                </button>
                                                <button 
                                                    className={`grid-btn ${gridView === 4 ? 'active' : ''}`}
                                                    onClick={() => setGridView(4)}
                                                    title="4 Columns"
                                                >
                                                    4
                                                </button>
                                            </div>
                                            <select 
                                                className="sort-select"
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                            >
                                                <option value="default">Sort By: Default</option>
                                                <option value="price-low">Price: Low to High</option>
                                                <option value="price-high">Price: High to Low</option>
                                                <option value="rating">Highest Rated</option>
                                                <option value="newest">Newest First</option>
                                            </select>
                                        </div>
                                    </div>

                                    {filteredProducts.length === 0 ? (
                                        <div className="empty-state">
                                            <i className="d-icon-bag"></i>
                                            <h3>No Products Found</h3>
                                            <p>Try adjusting your filters or search query</p>
                                            <button onClick={resetFilters} className="btn btn-primary">
                                                Clear Filters
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className={`products-grid grid-${gridView}`}>
                                                {filteredProducts.map((product) => {
                                                    const [regularPrice, salePrice] = product.price || [0, 0];
                                                    const hasDiscount = salePrice > 0 && salePrice < regularPrice;
                                                    const displayPrice = hasDiscount ? salePrice : regularPrice;
                                                    
                                                    return (
                                                        <div className="product-card" key={product.id}>
                                                            <div className="product-image-wrapper">
                                                                <ALink href={`/product/default/${product.slug}`}>
                                                                    <img
                                                                        src={product.pictures[0]?.url || '/images/placeholder.jpg'}
                                                                        alt={product.name}
                                                                        className="product-image"
                                                                        onError={(e) => {
                                                                            e.target.src = '/images/placeholder.jpg';
                                                                        }}
                                                                    />
                                                                </ALink>

                                                                {(product.is_new || hasDiscount) && (
                                                                    <div className="product-badges">
                                                                        {product.is_new && (
                                                                            <span className="product-badge badge-new">New</span>
                                                                        )}
                                                                        {hasDiscount && (
                                                                            <span className="product-badge badge-sale">Sale</span>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                <div className="product-actions">
                                                                    <button className="action-btn" title="Add to Wishlist">
                                                                        <FavoriteIcon sx={{ fontSize: 20 }} />
                                                                    </button>
                                                                    <button className="action-btn" title="Add to Cart">
                                                                        <ShoppingCartIcon sx={{ fontSize: 20 }} />
                                                                    </button>
                                                                </div>

                                                                <ALink href={`/product/default/${product.slug}`} className="quick-view-btn">
                                                                    <i className="d-icon-search"></i> Quick View
                                                                </ALink>
                                                            </div>

                                                            <div className="product-info">
                                                                {product.categories && product.categories.length > 0 && (
                                                                    <div className="product-category">
                                                                        {product.categories[0].name}
                                                                    </div>
                                                                )}

                                                                <h3 className="product-name">
                                                                    <ALink href={`/product/default/${product.slug}`}>
                                                                        {product.UI_pname}
                                                                    </ALink>
                                                                </h3>

                                                                <div className="product-rating">
                                                                    <div className="stars">
                                                                        {[...Array(5)].map((_, i) => (
                                                                            i < Math.floor(product.ratings) ? (
                                                                                <StarIcon key={i} sx={{ fontSize: 16, color: '#ffd700' }} />
                                                                            ) : (
                                                                                <StarBorderIcon key={i} sx={{ fontSize: 16, color: '#ddd' }} />
                                                                            )
                                                                        ))}
                                                                    </div>
                                                                    <span className="reviews-count">({product.reviews})</span>
                                                                </div>

                                                                <div className="product-price">
                                                                    <span className="current-price">${formatPrice(displayPrice)}</span>
                                                                    {hasDiscount && (
                                                                        <span className="original-price">${formatPrice(regularPrice)}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {filteredProducts.length > perPage && (
                                                <Pagination perPage={perPage} total={filteredProducts.length} />
                                            )}
                                        </>
                                    )}
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Shop;