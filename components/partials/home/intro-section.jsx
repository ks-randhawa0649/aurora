import React from 'react';
import Reveal from "react-awesome-reveal";
import { LazyLoadImage } from 'react-lazy-load-image-component';

// import Custom Components
import ALink from '~/components/features/custom-link';
import OwlCarousel from '~/components/features/owl-carousel';

import { introSlider } from '~/utils/data/carousel';
import { fadeInUpShorter, fadeInRightShorter, fadeIn, fadeInUp, fadeInRight, fadeInLeft } from '~/utils/data/keyframes';

function IntroSection( props ) {
    return (
        <>
            <section className="intro-section">
                {/* Main Hero Slide */}
                <div className="banner banner-fixed intro-slide1">
                    <figure className="hero-figure">
                        <LazyLoadImage
                            src="/images/home/slides/slide1.jpg"
                            alt="Aurora Fashion Collection"
                            effect="opacity"
                            width="auto"
                            height={700}
                        />
                        <div className="overlay"></div>
                    </figure>

                    <div className="container">
                        <div className="banner-content y-50">
                            <Reveal keyframes={ fadeInUp } delay={ 200 } duration={ 800 }>
                                <span className="badge-label">New Season</span>
                            </Reveal>

                            <Reveal keyframes={ fadeInUpShorter } delay={ 400 } duration={ 1000 }>
                                <h1 className="hero-title">
                                    Elevate Your<br />
                                    <span className="highlight">Style Game</span>
                                </h1>
                            </Reveal>

                            <Reveal keyframes={ fadeInUp } delay={ 800 } duration={ 1000 }>
                                <p className="hero-description">
                                    Discover premium fashion that defines you.<br />
                                    Exclusive collections with free shipping on orders over $99
                                </p>
                            </Reveal>

                            <Reveal keyframes={ fadeInUpShorter } delay={ 1200 } duration={ 1000 }>
                                <div className="button-group">
                                    <ALink href="/shop" className="btn btn-primary btn-modern">
                                        Explore Collection
                                        <i className="d-icon-arrow-right"></i>
                                    </ALink>
                                    <ALink href="/shop" className="btn btn-outline-light btn-modern">
                                        View Lookbook
                                    </ALink>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>

                {/* Model Feature Slide */}
                <div className="banner banner-fixed intro-slide2">
                    {/* Background Graphics */}
                    <div className="background-graphics">
                        <div className="bg-shape shape-1"></div>
                        <div className="bg-shape shape-2"></div>
                        <div className="bg-shape shape-3"></div>
                        <div className="pattern-dots"></div>
                        <LazyLoadImage
                            src="/images/home/slides/slide3.jpg"
                            alt="Background"
                            className="bg-texture"
                            effect="opacity"
                        />
                    </div>

                    <div className="split-layout">
                        <div className="image-side">
                            <Reveal keyframes={ fadeInLeft } delay={ 400 } duration={ 1200 }>
                                <figure className="model-figure">
                                    <LazyLoadImage
                                        src="/images/harmehak.png"
                                        alt="Aurora Model"
                                        effect="opacity"
                                        width="auto"
                                        height={700}
                                    />
                                    <div className="floating-badge">
                                        <span className="badge-number">40%</span>
                                        <span className="badge-text">OFF</span>
                                    </div>
                                    {/* Decorative Elements */}
                                    <div className="decor-circle decor-1"></div>
                                    <div className="decor-circle decor-2"></div>
                                </figure>
                            </Reveal>
                        </div>
                        <div className="content-side">
                            <div className="content-wrapper">
                                <Reveal keyframes={ fadeInRight } delay={ 300 } duration={ 1000 }>
                                    <span className="subtitle-badge">Limited Edition</span>
                                    <h2 className="section-title">
                                        Signature<br />
                                        Collection<br />
                                        <span className="highlight-text">2025</span>
                                    </h2>
                                </Reveal>

                                <Reveal keyframes={ fadeInRight } delay={ 600 } duration={ 1000 }>
                                    <p className="section-description">
                                        Handpicked styles crafted for the modern trendsetter. 
                                        Premium quality meets contemporary design.
                                    </p>
                                </Reveal>

                                <Reveal keyframes={ fadeInRight } delay={ 900 } duration={ 1000 }>
                                    <div className="feature-list">
                                        <div className="feature-item">
                                            <i className="d-icon-check"></i>
                                            <span>Premium Fabrics</span>
                                        </div>
                                        <div className="feature-item">
                                            <i className="d-icon-check"></i>
                                            <span>Exclusive Designs</span>
                                        </div>
                                        <div className="feature-item">
                                            <i className="d-icon-check"></i>
                                            <span>Fast Delivery</span>
                                        </div>
                                    </div>
                                </Reveal>

                                <Reveal keyframes={ fadeInUp } delay={ 1200 } duration={ 1000 }>
                                    <ALink href="/shop" className="btn btn-dark btn-modern btn-lg">
                                        Shop Now
                                        <i className="d-icon-arrow-right"></i>
                                    </ALink>
                                </Reveal>
                            </div>
                        </div>

                        
                    </div>
                </div>

                {/* Promo Slide */}
                <div className="banner banner-fixed intro-slide3">
                    {/* Gradient Background instead of image */}
                    <div className="promo-bg-gradient opacity-50"></div>

                    {/* Winter Graphics */}
                    <div className="winter-graphics">
                        <div className="snowflake snowflake-1">❄</div>
                        <div className="snowflake snowflake-2">❄</div>
                        <div className="snowflake snowflake-3">❄</div>
                        <div className="snowflake snowflake-4">❄</div>
                        <div className="snowflake snowflake-5">❄</div>
                        <div className="snowflake snowflake-6">❄</div>
                        <div className="winter-glow glow-1"></div>
                        <div className="winter-glow glow-2"></div>
                        <div className="winter-pattern"></div>
                    </div>

                    <div className="container">
                        <div className="banner-content text-center y-50">
                            <Reveal keyframes={ fadeIn } delay={ 200 } duration={ 800 }>
                                <div className="promo-label">
                                    <span className="line"></span>
                                    <span className="text">Winter Special</span>
                                    <span className="line"></span>
                                </div>
                            </Reveal>

                            <Reveal keyframes={ fadeInUp } delay={ 500 } duration={ 1000 }>
                                <h2 className="promo-title">
                                    Up to <span className="mega-text">70% OFF</span>
                                </h2>
                            </Reveal>

                            <Reveal keyframes={ fadeInUp } delay={ 800 } duration={ 1000 }>
                                <p className="promo-description">
                                    End of season clearance sale. Limited time offer!<br />
                                    Free shipping on all orders + extra 10% off with code: <strong>WINTER25</strong>
                                </p>
                            </Reveal>

                            <Reveal keyframes={ fadeInUpShorter } delay={ 1100 } duration={ 1000 }>
                                <ALink href="/shop" className="btn btn-white btn-modern btn-lg">
                                    Shop Sale Now
                                    <i className="d-icon-arrow-right"></i>
                                </ALink>
                            </Reveal>

                            {/* Decorative Sale Tags */}
                            <div className="sale-tag tag-left">
                                <span>HOT</span>
                                <span>DEAL</span>
                            </div>
                            <div className="sale-tag tag-right">
                                <span>LIMITED</span>
                                <span>TIME</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .intro-section {
                    position: relative;
                }

                /* Hero Slide 1 - Main Banner */
                .intro-slide1 {
                    position: relative;
                    min-height: 700px;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }

                .hero-figure {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    margin: 0;
                }

                .hero-figure img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, rgba(34, 102, 204, 0.75) 0%, rgba(34, 102, 204, 0.5) 50%, rgba(0, 0, 0, 0.3) 100%);
                }

                .badge-label {
                    display: inline-block;
                    padding: 8px 24px;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50px;
                    color: #fff;
                    font-size: 14px;
                    font-weight: 600;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    margin-bottom: 24px;
                }

                .hero-title {
                    font-size: 72px;
                    font-weight: 800;
                    line-height: 1.1;
                    color: #fff;
                    margin-bottom: 24px;
                    text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
                }

                .hero-title .highlight {
                    color: #ffd700;
                    display: block;
                }

                .hero-description {
                    font-size: 18px;
                    color: rgba(255, 255, 255, 0.95);
                    line-height: 1.7;
                    margin-bottom: 40px;
                    max-width: 600px;
                }

                .button-group {
                    display: flex;
                    gap: 16px;
                    flex-wrap: wrap;
                }

                .btn-modern {
                    padding: 16px 36px;
                    font-size: 16px;
                    font-weight: 600;
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
                    box-shadow: 0 8px 24px rgba(34, 102, 204, 0.4);
                }

                .btn-outline-light {
                    background: transparent;
                    border: 2px solid #fff;
                    color: #fff;
                }

                .btn-outline-light:hover {
                    background: #fff;
                    color: #26c;
                }

                /* Slide 2 - Split Layout with Model */
                .intro-slide2 {
                    position: relative;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    min-height: 700px;
                    overflow: hidden;
                }

                /* Background Graphics for Signature Collection */
                .background-graphics {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                    pointer-events: none;
                }

                .bg-texture {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    opacity: 0.03;
                }

                .bg-shape {
                    position: absolute;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(34, 102, 204, 0.1), rgba(34, 102, 204, 0.05));
                    filter: blur(60px);
                }

                .shape-1 {
                    width: 500px;
                    height: 500px;
                    top: -150px;
                    left: -100px;
                }

                .shape-2 {
                    width: 400px;
                    height: 400px;
                    bottom: -100px;
                    right: 10%;
                    background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05));
                }

                .shape-3 {
                    width: 300px;
                    height: 300px;
                    top: 50%;
                    left: 30%;
                    transform: translateY(-50%);
                    background: linear-gradient(135deg, rgba(34, 102, 204, 0.08), rgba(34, 102, 204, 0.03));
                }

                .pattern-dots {
                    position: absolute;
                    top: 50px;
                    right: 15%;
                    width: 200px;
                    height: 200px;
                    background-image: radial-gradient(circle, rgba(34, 102, 204, 0.2) 2px, transparent 2px);
                    background-size: 20px 20px;
                    opacity: 0.3;
                }

                .split-layout {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    min-height: 700px;
                }

                .content-side {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    padding: 80px 60px;
                }

                .content-wrapper {
                    max-width: 550px;
                }

                .subtitle-badge {
                    display: inline-block;
                    padding: 6px 20px;
                    background: #26c;
                    color: #fff;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    border-radius: 20px;
                    margin-bottom: 20px;
                }

                .section-title {
                    font-size: 64px;
                    font-weight: 800;
                    line-height: 1.1;
                    color: #222;
                    margin-bottom: 24px;
                }

                .highlight-text {
                    color: #26c;
                    font-style: italic;
                }

                .section-description {
                    font-size: 16px;
                    color: #666;
                    line-height: 1.8;
                    margin-bottom: 32px;
                }

                .feature-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 40px;
                }

                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 15px;
                    font-weight: 500;
                    color: #333;
                }

                .feature-item i {
                    color: #26c;
                    font-size: 18px;
                }

                .image-side {
                    flex: 1;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }

                .model-figure {
                    position: relative;
                    max-height: 700px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0;
                }

                .model-figure img {
                    max-height: 650px;
                    width: auto;
                    object-fit: contain;
                    filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15));
                }

                .floating-badge {
                    position: absolute;
                    top: 100px;
                    right: 80px;
                    width: 120px;
                    height: 120px;
                    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    box-shadow: 0 10px 30px rgba(238, 90, 111, 0.4);
                    animation: float 3s ease-in-out infinite;
                    z-index: 10;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }

                /* Decorative Circles */
                .decor-circle {
                    position: absolute;
                    border-radius: 50%;
                    border: 3px solid rgba(34, 102, 204, 0.2);
                    z-index: 0;
                }

                .decor-1 {
                    width: 200px;
                    height: 200px;
                    bottom: 120px;
                    left: -50px;
                    animation: pulse 4s ease-in-out infinite;
                }

                .decor-2 {
                    width: 150px;
                    height: 150px;
                    top: 80px;
                    left: 20%;
                    border-color: rgba(255, 215, 0, 0.3);
                    animation: pulse 3s ease-in-out infinite 0.5s;
                }

                @keyframes pulse {
                    0%, 100% { 
                        transform: scale(1);
                        opacity: 0.6;
                    }
                    50% { 
                        transform: scale(1.1);
                        opacity: 0.3;
                    }
                }

                .badge-number {
                    font-size: 36px;
                    font-weight: 900;
                    line-height: 1;
                }

                .badge-text {
                    font-size: 14px;
                    font-weight: 600;
                    letter-spacing: 2px;
                }

                /* Slide 3 - Promo Banner */
                .intro-slide3 {
                    position: relative;
                    min-height: 700px;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }

                /* Premium Gradient Background */
                .promo-bg-gradient {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, 
                        #667eea 0%, 
                        #764ba2 25%, 
                        #f093fb 50%, 
                        #4facfe 75%, 
                        #00f2fe 100%);
                    opacity: 0.6;
                }

                .promo-bg-gradient::before {
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

                .promo-figure {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    margin: 0;
                }

                .promo-figure img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .overlay-dark {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                }

                /* Winter Graphics */
                .winter-graphics {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1;
                }

                .winter-pattern {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255, 255, 255, 0.03) 35px, rgba(255, 255, 255, 0.03) 70px),
                        repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255, 255, 255, 0.03) 35px, rgba(255, 255, 255, 0.03) 70px);
                }

                .snowflake {
                    position: absolute;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 24px;
                    animation: snowfall linear infinite;
                }

                .snowflake-1 {
                    left: 10%;
                    top: -50px;
                    animation-duration: 10s;
                    animation-delay: 0s;
                }

                .snowflake-2 {
                    left: 25%;
                    top: -50px;
                    font-size: 32px;
                    animation-duration: 12s;
                    animation-delay: 2s;
                }

                .snowflake-3 {
                    left: 50%;
                    top: -50px;
                    font-size: 28px;
                    animation-duration: 11s;
                    animation-delay: 4s;
                }

                .snowflake-4 {
                    left: 70%;
                    top: -50px;
                    animation-duration: 13s;
                    animation-delay: 1s;
                }

                .snowflake-5 {
                    left: 85%;
                    top: -50px;
                    font-size: 36px;
                    animation-duration: 14s;
                    animation-delay: 3s;
                }

                .snowflake-6 {
                    left: 40%;
                    top: -50px;
                    font-size: 30px;
                    animation-duration: 15s;
                    animation-delay: 5s;
                }

                @keyframes snowfall {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(750px) rotate(360deg);
                        opacity: 0;
                    }
                }

                .winter-glow {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                }

                .glow-1 {
                    width: 500px;
                    height: 500px;
                    top: -150px;
                    left: 10%;
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
                    animation: glow-pulse 6s ease-in-out infinite;
                }

                .glow-2 {
                    width: 450px;
                    height: 450px;
                    bottom: -150px;
                    right: 15%;
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.25), transparent);
                    animation: glow-pulse 6s ease-in-out infinite 3s;
                }

                @keyframes glow-pulse {
                    0%, 100% {
                        opacity: 0.5;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.8;
                        transform: scale(1.1);
                    }
                }

                /* Sale Tags */
                .sale-tag {
                    position: absolute;
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-weight: 800;
                    text-transform: uppercase;
                    box-shadow: 0 10px 30px rgba(238, 90, 111, 0.5);
                    z-index: 2;
                }

                .tag-left {
                    left: 10%;
                    bottom: 15%;
                    animation: rotate-tag 8s linear infinite;
                }

                .tag-right {
                    right: 10%;
                    top: 20%;
                    animation: rotate-tag 8s linear infinite reverse;
                }

                .sale-tag span {
                    font-size: 12px;
                    letter-spacing: 1px;
                    line-height: 1.3;
                }

                @keyframes rotate-tag {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(180deg); }
                }

                .promo-label {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    margin-bottom: 32px;
                }

                .promo-label .line {
                    width: 60px;
                    height: 2px;
                    background: #fff;
                }

                .promo-label .text {
                    color: #fff;
                    font-size: 14px;
                    font-weight: 600;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                }

                .promo-title {
                    font-size: 48px;
                    font-weight: 800;
                    color: #fff;
                    margin-bottom: 24px;
                    line-height: 1.3;
                }

                .mega-text {
                    display: block;
                    font-size: 96px;
                    color: #ffd700;
                    text-shadow: 4px 4px 0 #26c;
                    letter-spacing: -2px;
                }

                .promo-description {
                    font-size: 18px;
                    color: rgba(255, 255, 255, 0.95);
                    line-height: 1.8;
                    margin-bottom: 40px;
                }

                .promo-description strong {
                    color: #ffd700;
                    font-weight: 700;
                }

                .btn-white {
                    background: #fff;
                    color: #222;
                    border: none;
                }

                .btn-white:hover {
                    background: #26c;
                    color: #fff;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
                }

                .btn-lg {
                    padding: 18px 48px;
                    font-size: 18px;
                }

                /* Responsive Design */
                @media (max-width: 1199px) {
                    .hero-title { font-size: 56px; }
                    .section-title { font-size: 48px; }
                    .mega-text { font-size: 72px; }
                }

                @media (max-width: 991px) {
                    .split-layout { flex-direction: column; }
                    .content-side { padding: 60px 40px; }
                    .image-side { min-height: 500px; }
                    .floating-badge { right: 40px; top: 60px; }
                    .shape-1 { width: 350px; height: 350px; }
                    .shape-2 { width: 300px; height: 300px; }
                    .decor-1 { width: 150px; height: 150px; }
                    .decor-2 { width: 120px; height: 120px; }
                    .sale-tag { width: 80px; height: 80px; font-size: 10px; }
                }

                @media (max-width: 767px) {
                    .hero-title { font-size: 42px; }
                    .section-title { font-size: 38px; }
                    .promo-title { font-size: 32px; }
                    .mega-text { font-size: 56px; }
                    .button-group { flex-direction: column; }
                    .btn-modern { width: 100%; justify-content: center; }
                    .content-side { padding: 40px 20px; }
                    .model-figure img { max-height: 400px; }
                    .floating-badge { width: 90px; height: 90px; top: 40px; right: 20px; }
                    .badge-number { font-size: 28px; }
                    .badge-text { font-size: 12px; }
                    .pattern-dots { width: 150px; height: 150px; right: 5%; }
                    .snowflake { font-size: 20px; }
                    .sale-tag { display: none; }
                }

                @media (max-width: 575px) {
                    .hero-title { font-size: 32px; }
                    .section-title { font-size: 32px; }
                    .hero-description, .section-description, .promo-description { font-size: 15px; }
                    .shape-1, .shape-2, .shape-3 { display: none; }
                    .decor-circle { display: none; }
                }
            `}</style>
        </>
    )
}

export default React.memo( IntroSection );
