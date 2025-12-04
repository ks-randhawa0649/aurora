import React, { useState, useEffect, useRef } from 'react';
import Reveal from 'react-awesome-reveal';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { fadeIn, fadeInUpShorter } from '~/utils/data/keyframes';

function CtaSection () {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [loopWidth, setLoopWidth] = useState(0);
    const trackRef = useRef(null);

    const testimonials = [
        {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Fashion Blogger',
            image: '/photodump/IMG_5843.JPG',
            rating: 5,
            text: 'Absolutely love the quality and style! The winter collection exceeded my expectations. The fabrics are premium and the fit is perfect.'
        },
        {
            id: 2,
            name: 'Michael Chen',
            role: 'Verified Buyer',
            image: '/photodump/IMG_8854.JPG',
            rating: 5,
            text: 'Outstanding service and beautiful pieces! The attention to detail is remarkable. I received so many compliments wearing their signature collection.'
        },
        {
            id: 3,
            name: 'Emma Williams',
            role: 'Style Influencer',
            image: '/photodump/IMG_9739.JPG',
            rating: 5,
            text: 'This brand has become my go-to for elegant fashion. The quality is unmatched and the designs are always on trend. Customer service is exceptional too!'
        },
        {
            id: 4,
            name: 'David Rodriguez',
            role: 'Happy Customer',
            image: '/photodump/IMG_9823.JPG',
            rating: 5,
            text: 'Best shopping experience! Fast delivery, premium packaging, and the clothes are even better in person. The modern vibes collection is absolutely fantastic!'
        }
    ];

    // Measure width of one full testimonials set (we render 3 copies)
    useEffect(() => {
        if (trackRef.current) {
            const totalWidth = trackRef.current.scrollWidth;
            setLoopWidth(totalWidth / 3);
        }
    }, []);

    // Auto-scroll effect with looping
    useEffect(() => {
        if (!loopWidth) return;

        const interval = setInterval(() => {
            setScrollPosition(prev => {
                const next = prev + 1;
                // Once we've scrolled through one full set, jump back to start
                return next >= loopWidth ? 0 : next;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [loopWidth]);

    const handlePrev = () => {
        setScrollPosition(prev => {
            if (!loopWidth) return prev;
            const next = prev - 350;
            return next < 0 ? loopWidth + next : next;
        });
    };

    const handleNext = () => {
        setScrollPosition(prev => {
            if (!loopWidth) return prev;
            const next = prev + 350;
            return next >= loopWidth ? next - loopWidth : next;
        });
    };

    return (
        <section className="testimonial-section">
            <div className="container">
                <Reveal keyframes={ fadeIn } delay={ 200 } duration={ 1000 } triggerOnce>
                    <div className="section-header">
                        <span className="section-subtitle">Customer Reviews</span>
                        <h2 className="section-title">What Our Customers Say</h2>
                        <p className="section-description">
                            Don't just take our word for it - hear from our happy customers
                        </p>
                    </div>
                </Reveal>

                <Reveal keyframes={ fadeInUpShorter } delay={ 400 } duration={ 1000 } triggerOnce>
                    <div className="testimonial-slider">
                        {/* Navigation Arrows */}
                        <button className="testimonial-nav prev" onClick={handlePrev}>
                            <i className="d-icon-arrow-left"></i>
                        </button>
                        <button className="testimonial-nav next" onClick={handleNext}>
                            <i className="d-icon-arrow-right"></i>
                        </button>

                        <div className="testimonial-track-wrapper">
                            <div 
                                ref={trackRef}
                                className="testimonial-track"
                                style={{ transform: `translateX(-${scrollPosition}px)` }}
                            >
                                {/* Duplicate testimonials for infinite effect */}
                                {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
                                    <div key={`${testimonial.id}-${index}`} className="testimonial-card">
                                        <div className="quote-icon">
                                            <i className="d-icon-quote"></i>
                                        </div>
                                        
                                        <div className="testimonial-rating">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <i key={i} className="d-icon-star-full"></i>
                                            ))}
                                        </div>

                                        <p className="testimonial-text">{testimonial.text}</p>

                                        <div className="testimonial-author">
                                            <div className="author-image">
                                                <LazyLoadImage
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    effect="opacity"
                                                />
                                            </div>
                                            <div className="author-info">
                                                <h4 className="author-name">{testimonial.name}</h4>
                                                <p className="author-role">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>

            <style jsx>{`
                .testimonial-section {
                    padding: 60px 0;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    position: relative;
                    overflow: hidden;
                }

                .testimonial-section::before {
                    content: '"';
                    position: absolute;
                    top: -50px;
                    left: 50px;
                    font-size: 300px;
                    font-family: Georgia, serif;
                    color: rgba(34, 102, 204, 0.05);
                    z-index: 0;
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 40px;
                    position: relative;
                    z-index: 1;
                }

                .section-subtitle {
                    display: inline-block;
                    font-size: 12px;
                    font-weight: 600;
                    color: #26c;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 10px;
                }

                .section-title {
                    font-size: 36px;
                    font-weight: 800;
                    color: #222;
                    margin-bottom: 12px;
                    line-height: 1.2;
                }

                .section-description {
                    font-size: 14px;
                    color: #666;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .testimonial-slider {
                    position: relative;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .testimonial-track-wrapper {
                    overflow: hidden;
                    padding: 20px 0;
                    margin: 0 70px;
                }

                .testimonial-track {
                    display: flex;
                    gap: 30px;
                    transition: transform 0.5s ease-out;
                }

                .testimonial-card {
                    min-width: 300px;
                    max-width: 300px;
                    background: #fff;
                    padding: 30px 25px;
                    border-radius: 20px;
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
                    position: relative;
                    flex-shrink: 0;
                }

                .quote-icon {
                    position: absolute;
                    top: 15px;
                    left: 25px;
                    font-size: 30px;
                    color: #26c;
                    opacity: 0.15;
                }

                .quote-icon i::before {
                    content: '"';
                    font-style: normal;
                }

                .testimonial-rating {
                    margin-bottom: 16px;
                    text-align: center;
                }

                .testimonial-rating i {
                    color: #ffd700;
                    font-size: 14px;
                    margin: 0 2px;
                }

                .testimonial-text {
                    font-size: 13px;
                    line-height: 1.6;
                    color: #555;
                    margin-bottom: 20px;
                    font-style: italic;
                    text-align: center;
                    min-height: 90px;
                }

                .testimonial-author {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                }

                .author-image {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 3px solid #26c;
                    box-shadow: 0 4px 12px rgba(34, 102, 204, 0.3);
                    flex-shrink: 0;
                }

                .author-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .author-info {
                    text-align: left;
                }

                .author-name {
                    font-size: 15px;
                    font-weight: 700;
                    color: #222;
                    margin-bottom: 3px;
                }

                .author-role {
                    font-size: 11px;
                    color: #26c;
                    font-weight: 600;
                }

                .testimonial-nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: #fff;
                    border: 2px solid #26c;
                    color: #26c;
                    font-size: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
                }

                .testimonial-nav:hover {
                    background: #26c;
                    color: #fff;
                    transform: translateY(-50%) scale(1.1);
                    box-shadow: 0 10px 25px rgba(34, 102, 204, 0.4);
                }

                .testimonial-nav.prev {
                    left: 10px;
                }

                .testimonial-nav.next {
                    right: 10px;
                }

                /* Responsive */
                @media (max-width: 991px) {
                    .testimonial-section {
                        padding: 50px 0;
                    }

                    .section-title {
                        font-size: 32px;
                    }

                    .testimonial-card {
                        min-width: 320px;
                        padding: 30px 25px;
                    }

                    .testimonial-track-wrapper {
                        margin: 0 60px;
                    }
                }

                @media (max-width: 767px) {
                    .testimonial-section {
                        padding: 40px 0;
                    }

                    .section-title {
                        font-size: 28px;
                    }

                    .testimonial-card {
                        min-width: 280px;
                        padding: 25px 20px;
                    }

                    .testimonial-text {
                        font-size: 13px;
                        min-height: 120px;
                    }

                    .testimonial-track-wrapper {
                        margin: 0 50px;
                    }

                    .testimonial-nav {
                        width: 40px;
                        height: 40px;
                        font-size: 16px;
                    }

                    .author-image {
                        width: 45px;
                        height: 45px;
                    }

                    .author-name {
                        font-size: 15px;
                    }
                }

                @media (max-width: 575px) {
                    .section-title {
                        font-size: 24px;
                    }

                    .testimonial-card {
                        min-width: 260px;
                    }

                    .testimonial-track-wrapper {
                        margin: 0 45px;
                    }

                    .testimonial-nav {
                        width: 35px;
                        height: 35px;
                        font-size: 14px;
                    }

                    .testimonial-nav.prev {
                        left: 5px;
                    }

                    .testimonial-nav.next {
                        right: 5px;
                    }
                }
            `}</style>
        </section>
    )
}

export default React.memo( CtaSection );
