import React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

import ALink from '~/components/features/custom-link';

import { modalActions } from '~/store/modal';

import { toDecimal } from '~/utils';

function DescOne( props ) {
    const { product, isGuide = true, isDivider = true, openModal } = props;

    let colors = [], sizes = [];

    if ( product.variants.length > 0 ) {
        if ( product.variants[ 0 ].size )
            product.variants.forEach( item => {
                if ( sizes.findIndex( size => size.name === item.size.name ) === -1 ) {
                    sizes.push( { name: item.size.name, value: item.size.size } );
                }
            } );

        if ( product.variants[ 0 ].color ) {
            product.variants.forEach( item => {
                if ( colors.findIndex( color => color.name === item.color.name ) === -1 )
                    colors.push( { name: item.color.name, value: item.color.color } );
            } );
        }
    }

    const setRating = ( e ) => {
        e.preventDefault();

        if ( e.currentTarget.parentNode.querySelector( '.active' ) ) {
            e.currentTarget.parentNode.querySelector( '.active' ).classList.remove( 'active' );
        }

        e.currentTarget.classList.add( 'active' );
    }

    const showVideoModalHandler = ( e ) => {
        e.preventDefault();
        let link = e.currentTarget.closest( '.btn-play' ).getAttribute( 'data' );
        openModal( link );
    }

    const renderStars = (rating) => {
        return (
            <div className="stars-display-review">
                {[1, 2, 3, 4, 5].map((star) => (
                    star <= Math.floor(rating) ? (
                        <StarIcon key={star} sx={{ fontSize: 18, color: '#FFB800' }} />
                    ) : (
                        <StarBorderIcon key={star} sx={{ fontSize: 18, color: '#FFB800' }} />
                    )
                ))}
            </div>
        );
    };

    return (
        <>
        <Tabs className="tab product-tabs-modern" selectedTabClassName="active" selectedTabPanelClassName="active" defaultIndex={ 0 } >
            <TabList className="tabs-nav-modernn" role="tablist">
                <Tab className="tab-item-modern">
                    <span className="tab-link-modern">📋 Description</span>
                </Tab>
                {
                    product && product.brands.length > 0 || colors.length > 0 || sizes.length > 0 ?
                        <Tab className="tab-item-modern">
                            <span className="tab-link-modern">ℹ️ Additional Info</span>
                        </Tab> : ''
                }
                {
                    isGuide ?
                        <Tab className="tab-item-modern">
                            <span className="tab-link-modern">📏 Size Guide</span>
                        </Tab> : ''
                }
                <Tab className="tab-item-modern">
                    <span className="tab-link-modern">⭐ Reviews ({ product.reviews })</span>
                </Tab>
            </TabList>

            <div className="tab-content-modern">
                <TabPanel className="tab-panel-modern">
                    <div className="row mt-6">
                        <div className="col-md-6 mb-6">
                            <div className="features-card">
                                <h5 className="section-title-modern">✨ Key Features</h5>
                                <p className="feature-description">
                                    {product.description || 'Experience premium quality with our carefully crafted product. Designed with attention to detail and built to last, this item combines style and functionality perfectly.'}
                                </p>
                                <ul className="features-list">
                                    <li>Premium quality materials for durability</li>
                                    <li>Modern design with attention to detail</li>
                                    <li>Comfortable fit for all-day wear</li>
                                    <li>Easy care and maintenance</li>
                                </ul>
                            </div>

                            <div className="specs-card mt-4">
                                <h5 className="section-title-modern">📊 Specifications</h5>
                                <table className="specs-table">
                                    <tbody>
                                        <tr>
                                            <th>Material</th>
                                            <td>Premium Cotton Blend</td>
                                        </tr>
                                        <tr>
                                            <th>Care</th>
                                            <td>Machine Washable</td>
                                        </tr>
                                        <tr>
                                            <th>Origin</th>
                                            <td>Designed in Canada</td>
                                        </tr>
                                        <tr>
                                            <th>Manufacturer</th>
                                            <td>{product.brand || 'SmartStyle'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="video-card">
                                <h5 className="section-title-modern">🎥 Product Video</h5>
                                <figure className="video-wrapper">
                                    <img src="./images/product.jpg" alt="Product" className="video-thumbnail" />
                                    <button className="play-button" onClick={ showVideoModalHandler } data="/uploads/video/video-1.mp4">
                                        <PlayCircleOutlineIcon sx={{ fontSize: 64, color: 'white' }} />
                                    </button>
                                </figure>
                            </div>

                            <div className="benefits-grid mt-4">
                                <div className="benefit-card">
                                    <div className="benefit-icon">
                                        <LockOutlinedIcon sx={{ fontSize: 32, color: '#26c' }} />
                                    </div>
                                    <div className="benefit-content">
                                        <h4>2 Year Warranty</h4>
                                        <p>Guarantee with no doubt</p>
                                    </div>
                                </div>
                                <div className="benefit-card">
                                    <div className="benefit-icon">
                                        <LocalShippingOutlinedIcon sx={{ fontSize: 32, color: '#26c' }} />
                                    </div>
                                    <div className="benefit-content">
                                        <h4>Free Shipping</h4>
                                        <p>On orders over $50.00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabPanel>

                {
                    product && product.brands.length > 0 || colors.length > 0 || sizes.length > 0 ?
                        <TabPanel className="tab-panel-modern">
                            <div className="additional-info-card">
                                <h5 className="section-title-modern mb-4">Product Information</h5>
                                <div className="info-grid">
                                    {
                                        product.categories.length > 0 ?
                                            <div className="info-item">
                                                <label className="info-label">Categories</label>
                                                <div className="info-value">
                                                    { product.categories.map( ( item, index ) => (
                                                        <span key={ item.name + '-' + index } className="info-tag">
                                                            { item.name }
                                                        </span>
                                                    ) ) }
                                                </div>
                                            </div> : ""
                                    }

                                    {
                                        product.brands.length > 0 ?
                                            <div className="info-item">
                                                <label className="info-label">Brand</label>
                                                <div className="info-value">
                                                    { product.brands.map( ( item, index ) => (
                                                        <span key={ item.name + '-' + index } className="info-tag brand-tag">
                                                            { item.name }
                                                        </span>
                                                    ) ) }
                                                </div>
                                            </div> : ""
                                    }

                                    {
                                        colors.length > 0 ?
                                            <div className="info-item">
                                                <label className="info-label">Available Colors</label>
                                                <div className="info-value">
                                                    { colors.map( ( item, index ) => (
                                                        <span key={ item.name + '-' + index } className="color-tag" style={{backgroundColor: item.value}}>
                                                            { item.name }
                                                        </span>
                                                    ) ) }
                                                </div>
                                            </div> : ""
                                    }

                                    {
                                        sizes.length > 0 ?
                                            <div className="info-item">
                                                <label className="info-label">Available Sizes</label>
                                                <div className="info-value">
                                                    {
                                                        sizes.map( ( item, index ) => (
                                                            <span key={ item.name + '-' + index } className="size-tag">
                                                                { item.name }
                                                            </span>
                                                        ) ) }
                                                </div>
                                            </div> : ""
                                    }
                                </div>
                            </div>
                        </TabPanel>
                        : ''
                }
                {
                    isGuide ?
                        <TabPanel className="tab-panel-modern">
                            <div className="size-guide-card">
                                <h5 className="section-title-modern mb-4">Size Guide</h5>
                                <div className="row">
                                    <div className="col-md-4 mb-4 mb-md-0">
                                        <div className="size-image-card">
                                            <img src="./images/size_guide.png" alt="Size Guide" className="size-guide-img" />
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="size-table-wrapper">
                                            <table className="size-table-modern">
                                                <thead>
                                                    <tr>
                                                        <th>SIZE</th>
                                                        <th>CHEST (IN.)</th>
                                                        <th>WAIST (IN.)</th>
                                                        <th>HIPS (IN.)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="size-col">XS</td>
                                                        <td>34-36</td>
                                                        <td>27-29</td>
                                                        <td>34.5-36.5</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="size-col">S</td>
                                                        <td>36-38</td>
                                                        <td>29-31</td>
                                                        <td>36.5-38.5</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="size-col">M</td>
                                                        <td>38-40</td>
                                                        <td>31-33</td>
                                                        <td>38.5-40.5</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="size-col">L</td>
                                                        <td>40-42</td>
                                                        <td>33-36</td>
                                                        <td>40.5-43.5</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="size-col">XL</td>
                                                        <td>42-45</td>
                                                        <td>36-40</td>
                                                        <td>43.5-47.5</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="size-col">XXL</td>
                                                        <td>45-48</td>
                                                        <td>40-44</td>
                                                        <td>47.5-51.5</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="size-note mt-4">
                                            <p><strong>📌 Note:</strong> All measurements are in inches. For the best fit, please measure yourself and compare with the size chart above.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPanel> : ''
                }

                <TabPanel className="tab-panel-modern">
                    {
                        product.reviews === 0 ?
                            <div className="no-reviews-card">
                                <div className="no-reviews-icon">⭐</div>
                                <h4>No Reviews Yet</h4>
                                <p>Be the first to review this product!</p>
                            </div> :
                            <div className="reviews-list">
                                <div className="review-card">
                                    <div className="review-header">
                                        <div className="reviewer-info">
                                            <img src="./images/blog/comments/1.jpg" alt="avatar" className="reviewer-avatar" />
                                            <div className="reviewer-details">
                                                <h4 className="reviewer-name">John Doe</h4>
                                                <span className="review-date">September 22, 2020</span>
                                            </div>
                                        </div>
                                        {renderStars(product.ratings)}
                                    </div>
                                    <div className="review-content">
                                        <p>Excellent quality! The fit is perfect and the material feels premium. Very satisfied with my purchase. Would definitely recommend to others looking for quality products.</p>
                                    </div>
                                </div>

                                {
                                    product.reviews > 1 ?
                                        <div className="review-card">
                                            <div className="review-header">
                                                <div className="reviewer-info">
                                                    <img src="./images/blog/comments/2.jpg" alt="avatar" className="reviewer-avatar" />
                                                    <div className="reviewer-details">
                                                        <h4 className="reviewer-name">Jane Smith</h4>
                                                        <span className="review-date">September 25, 2020</span>
                                                    </div>
                                                </div>
                                                {renderStars(product.ratings)}
                                            </div>
                                            <div className="review-content">
                                                <p>Love this product! Great attention to detail and the shipping was fast. The quality exceeded my expectations. Will definitely be ordering more items from this brand.</p>
                                            </div>
                                        </div>
                                        : ""
                                }
                            </div>
                    }

                    <div className="reply">
                        <div className="title-wrapper text-left">
                            <h3 className="title title-simple text-left text-normal">
                                {
                                    product.reviews > 0 ? "Add a Review" :
                                        "Be The First To Review “" + product.name + "”"
                                }
                            </h3>
                            <p>Your email address will not be published. Required fields are marked *</p>
                        </div>
                        <div className="rating-form">
                            <label htmlFor="rating" className="text-dark">Your rating * </label>
                            <span className="rating-stars selected">
                                { [ 1, 2, 3, 4, 5 ].map( ( num, index ) =>
                                    <a className={ `star-${ num }` } href="#" onClick={ setRating } key={ 'star-' + index }>{ num }</a>
                                ) }
                            </span>

                            <select name="rating" id="rating" required="" style={ { display: 'none' } }>
                                <option value="">Rate…</option>
                                <option value="5">Perfect</option>
                                <option value="4">Good</option>
                                <option value="3">Average</option>
                                <option value="2">Not that bad</option>
                                <option value="1">Very poor</option>
                            </select>
                        </div>
                    </div>

                    <div className="review-form-card">
                        <h3 className="review-form-title">
                            {
                                product.reviews > 0 ? "Add Your Review" :
                                    `Be The First To Review "${product.name}"`
                            }
                        </h3>
                        <p className="review-form-subtitle">Your email address will not be published. Required fields are marked *</p>
                        
                        <div className="rating-input-group">
                            <label htmlFor="rating" className="rating-label">Your Rating *</label>
                            <span className="rating-stars-input">
                                { [ 1, 2, 3, 4, 5 ].map( ( num, index ) =>
                                    <a className={ `star-input star-${ num }` } href="#" onClick={ setRating } key={ 'star-' + index }>
                                        <StarBorderIcon sx={{ fontSize: 28, color: '#FFB800' }} />
                                    </a>
                                ) }
                            </span>
                        </div>

                        <form action="#" className="review-form-modern">
                            <div className="form-group-modern">
                                <label htmlFor="reply-message">Your Review *</label>
                                <textarea 
                                    id="reply-message" 
                                    rows="5" 
                                    className="form-input-modern"
                                    placeholder="Share your experience with this product..." 
                                    required
                                ></textarea>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group-modern">
                                        <label htmlFor="reply-name">Name *</label>
                                        <input 
                                            type="text" 
                                            className="form-input-modern" 
                                            id="reply-name"
                                            name="reply-name" 
                                            placeholder="Your name" 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group-modern">
                                        <label htmlFor="reply-email">Email *</label>
                                        <input 
                                            type="email" 
                                            className="form-input-modern" 
                                            id="reply-email"
                                            name="reply-email" 
                                            placeholder="your.email@example.com" 
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-checkbox-modern">
                                <input 
                                    type="checkbox" 
                                    className="checkbox-input" 
                                    id="signin-remember"
                                    name="signin-remember" 
                                />
                                <label className="checkbox-label" htmlFor="signin-remember">
                                    Save my information for next time
                                </label>
                            </div>
                            
                            <button type="submit" className="btn-submit-review">
                                Submit Review
                                <i className="d-icon-arrow-right"></i>
                            </button>
                        </form>
                    </div>

                </TabPanel>
            </div>
        </Tabs>

        <style jsx>{`
            .product-tabs-modern {
                margin-top: 50px;
            }

            .tabs-nav-modern {
                display: flex;
                flex-direction:column   ;
                justify-content: center;
                gap: 8px;
                margin-bottom: 40px;
                flex-wrap: wrap;
                border-bottom: none;
            }

            .tab-item-modern {
                background: #f8f9fa;
                border-radius: 12px;
                overflow: hidden;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }

            .tab-item-modern:hover {
                background: #e9ecef;
                transform: translateY(-2px);
            }

            .tab-item-modern.active {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-color: #667eea;
            }

            .tab-link-modern {
                display: block;
                padding: 14px 28px;
                font-size: 15px;
                font-weight: 600;
                color: #666;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .tab-item-modern.active .tab-link-modern {
                color: white;
            }

            .tab-content-modern {
                animation: fadeIn 0.5s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .tab-panel-modern {
                padding: 30px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
            }

            .section-title-modern {
                font-size: 22px;
                font-weight: 700;
                color: #222;
                margin-bottom: 20px;
                padding-bottom: 12px;
                border-bottom: 3px solid #26c;
                display: inline-block;
            }

            .features-card,
            .specs-card,
            .video-card,
            .additional-info-card,
            .size-guide-card {
                background: white;
                padding: 30px;
                border-radius: 16px;
                border: 2px solid #f0f0f0;
            }

            .feature-description {
                color: #666;
                line-height: 1.8;
                margin-bottom: 20px;
                font-size: 15px;
            }

            .features-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .features-list li {
                padding: 12px 0;
                padding-left: 32px;
                position: relative;
                color: #555;
                font-size: 15px;
                border-bottom: 1px solid #f0f0f0;
            }

            .features-list li:last-child {
                border-bottom: none;
            }

            .features-list li::before {
                content: '✓';
                position: absolute;
                left: 0;
                color: #26c;
                font-weight: bold;
                font-size: 18px;
            }

            .specs-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
            }

            .specs-table tr {
                border-bottom: 1px solid #f0f0f0;
            }

            .specs-table tr:last-child {
                border-bottom: none;
            }

            .specs-table th,
            .specs-table td {
                padding: 16px;
                text-align: left;
            }

            .specs-table th {
                font-weight: 600;
                color: #333;
                width: 40%;
            }

            .specs-table td {
                color: #666;
            }

            .video-wrapper {
                position: relative;
                border-radius: 16px;
                overflow: hidden;
                margin-bottom: 0;
            }

            .video-thumbnail {
                width: 100%;
                height: auto;
                display: block;
            }

            .play-button {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.5);
                border: none;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }

            .play-button:hover {
                background: rgba(38, 0, 204, 0.8);
                transform: translate(-50%, -50%) scale(1.1);
            }

            .benefits-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
            }

            .benefit-card {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 20px;
                background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
                border-radius: 12px;
                border: 2px solid rgba(38, 0, 204, 0.1);
            }

            .benefit-icon {
                flex-shrink: 0;
            }

            .benefit-content h4 {
                font-size: 16px;
                font-weight: 700;
                color: #333;
                margin: 0 0 4px 0;
            }

            .benefit-content p {
                font-size: 13px;
                color: #666;
                margin: 0;
            }

            .info-grid {
                display: flex;
                flex-direction: column;
                gap: 24px;
            }

            .info-item {
                padding-bottom: 24px;
                border-bottom: 2px solid #f0f0f0;
            }

            .info-item:last-child {
                border-bottom: none;
                padding-bottom: 0;
            }

            .info-label {
                display: block;
                font-weight: 700;
                color: #333;
                margin-bottom: 12px;
                font-size: 15px;
            }

            .info-value {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            }

            .info-tag,
            .brand-tag,
            .size-tag {
                background: #f8f9fa;
                color: #26c;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                border: 2px solid #e0e0e0;
            }

            .brand-tag {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-color: #667eea;
            }

            .color-tag {
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                color: white;
                border: 2px solid rgba(0, 0, 0, 0.1);
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            }

            .size-image-card {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 12px;
                text-align: center;
            }

            .size-guide-img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
            }

            .size-table-wrapper {
                overflow-x: auto;
            }

            .size-table-modern {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }

            .size-table-modern thead {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }

            .size-table-modern thead th {
                color: white;
                padding: 16px;
                font-weight: 700;
                text-align: center;
                font-size: 13px;
                letter-spacing: 0.5px;
            }

            .size-table-modern tbody tr {
                background: white;
                transition: all 0.3s ease;
            }

            .size-table-modern tbody tr:nth-child(even) {
                background: #f8f9fa;
            }

            .size-table-modern tbody tr:hover {
                background: #e3f2fd;
                transform: scale(1.02);
            }

            .size-table-modern tbody td {
                padding: 14px;
                text-align: center;
                color: #666;
                font-size: 14px;
                border-bottom: 1px solid #e0e0e0;
            }

            .size-table-modern tbody tr:last-child td {
                border-bottom: none;
            }

            .size-col {
                font-weight: 700;
                color: #26c !important;
                font-size: 16px !important;
            }

            .size-note {
                background: #fff8e1;
                padding: 16px;
                border-radius: 12px;
                border-left: 4px solid #ffc107;
            }

            .size-note p {
                margin: 0;
                color: #666;
                font-size: 14px;
                line-height: 1.6;
            }

            .no-reviews-card {
                text-align: center;
                padding: 60px 30px;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-radius: 16px;
            }

            .no-reviews-icon {
                font-size: 64px;
                margin-bottom: 20px;
            }

            .no-reviews-card h4 {
                font-size: 22px;
                font-weight: 700;
                color: #333;
                margin-bottom: 8px;
            }

            .no-reviews-card p {
                color: #666;
                font-size: 15px;
            }

            .reviews-list {
                margin-bottom: 40px;
            }

            .review-card {
                background: #f8f9fa;
                padding: 24px;
                border-radius: 16px;
                margin-bottom: 20px;
                border: 2px solid #e0e0e0;
            }

            .review-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 16px;
                flex-wrap: wrap;
                gap: 12px;
            }

            .reviewer-info {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .reviewer-avatar {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .reviewer-details h4 {
                font-size: 16px;
                font-weight: 700;
                color: #333;
                margin: 0 0 4px 0;
            }

            .review-date {
                font-size: 13px;
                color: #999;
            }

            .stars-display-review {
                display: flex;
                gap: 2px;
            }

            .review-content {
                padding-left: 76px;
            }

            .review-content p {
                color: #666;
                line-height: 1.8;
                margin: 0;
                font-size: 15px;
            }

            .review-form-card {
                background: white;
                padding: 40px;
                border-radius: 16px;
                border: 2px solid #e0e0e0;
            }

            .review-form-title {
                font-size: 24px;
                font-weight: 700;
                color: #222;
                margin-bottom: 8px;
            }

            .review-form-subtitle {
                color: #666;
                margin-bottom: 30px;
                font-size: 14px;
            }

            .rating-input-group {
                margin-bottom: 30px;
            }

            .rating-label {
                display: block;
                font-weight: 600;
                color: #333;
                margin-bottom: 12px;
                font-size: 15px;
            }

            .rating-stars-input {
                display: flex;
                gap: 8px;
            }

            .star-input {
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .star-input:hover {
                transform: scale(1.2);
            }

            .star-input.active :global(svg) {
                color: #FFB800 !important;
            }

            .form-group-modern {
                margin-bottom: 24px;
            }

            .form-group-modern label {
                display: block;
                font-weight: 600;
                color: #333;
                margin-bottom: 8px;
                font-size: 14px;
            }

            .form-input-modern {
                width: 100%;
                padding: 14px 18px;
                border: 2px solid #e0e0e0;
                border-radius: 12px;
                font-size: 15px;
                transition: all 0.3s ease;
                font-family: inherit;
            }

            .form-input-modern:focus {
                outline: none;
                border-color: #26c;
                box-shadow: 0 0 0 4px rgba(38, 0, 204, 0.1);
            }

            .form-checkbox-modern {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 30px;
            }

            .checkbox-input {
                width: 20px;
                height: 20px;
                cursor: pointer;
            }

            .checkbox-label {
                color: #666;
                font-size: 14px;
                cursor: pointer;
                margin: 0;
            }

            .btn-submit-review {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 16px 40px;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            }

            .btn-submit-review:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            }

            .btn-submit-review i {
                margin-left: 4px;
            }

            @media (max-width: 768px) {
                .tab-panel-modern {
                    padding: 20px;
                }

                .tabs-nav-modern {
                    gap: 6px;
                }

                .tab-link-modern {
                    padding: 10px 16px;
                    font-size: 13px;
                }

                .section-title-modern {
                    font-size: 18px;
                }

                .features-card,
                .specs-card,
                .video-card,
                .additional-info-card,
                .size-guide-card {
                    padding: 20px;
                }

                .review-content {
                    padding-left: 0;
                    margin-top: 16px;
                }

                .review-form-card {
                    padding: 24px;
                }

                .benefits-grid {
                    grid-template-columns: 1fr;
                }
            }
        `}</style>
        </>
    )
}

export default connect( '', { openModal: modalActions.openModal } )( DescOne )