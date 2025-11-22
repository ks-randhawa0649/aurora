import Helmet from 'react-helmet';
import CountUp from 'react-countup';
import React, { useEffect } from 'react'
import Reveal from 'react-awesome-reveal';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import ALink from '~/components/features/custom-link';
import OwlCarousel from '~/components/features/owl-carousel';

import { fadeIn, fadeInLeftShorter } from '~/utils/data/keyframes';
import { mainSlider16 } from '~/utils/data/carousel';

function AboutUs() {
    useEffect( () => {
        countToHandler();
        window.addEventListener( 'scroll', countToHandler, true );

        return () => {
            window.removeEventListener( 'scroll', countToHandler );
        }
    }, [] )

    function countToHandler() {
        let items = document.querySelectorAll( '.count-to' );

        for ( let i = 0; i < items.length; i++ ) {
            let item = items[ i ];
            if ( item.getBoundingClientRect().top > 0 && window.innerHeight - item.offsetHeight > item.getBoundingClientRect().top && !item.classList.contains( 'finished' ) ) {
                if ( item.querySelector( 'button' ) ) item.querySelector( 'button' ).click();
                item.classList.add( 'finished' );
            }
        }
    }

    return (
        <main className="main about-us-modern">
            <Helmet>
                <title>Riode React eCommerce Template | About Us</title>
            </Helmet>

            <h1 className="d-none">Riode React eCommerce Template - About Us</h1>

            <div className="page-header-modern"
                style={ { backgroundImage: `url( ./images/page-header/about-us.jpg )`, backgroundColor: "#3C63A4" } }>
                <div className="container">
                    <div className="header-content">
                        <h3 className="page-subtitle-modern">Welcome to Our Store</h3>
                        <h1 className="page-title-modern">About Us</h1>
                        <p className="page-desc-modern">Discover our story, values, and the passion that drives us</p>
                    </div>
                </div>
            </div>

            <div className="page-content-modern">
                <Reveal keyframes={ fadeIn } delay="50" duration="1000" triggerOnce>
                    <section className="about-section-modern">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-4 mb-10 mb-lg-4">
                                    <div className="section-header-modern">
                                        <span className="section-number">01</span>
                                        <h5 className="section-subtitle-modern">What We Do</h5>
                                        <h3 className="section-title-modern">Providing Perfect & Practical Services</h3>
                                        <p className="section-desc-modern">We deliver exceptional quality and innovative solutions to meet all your needs with dedication and expertise.</p>
                                    </div>
                                </div>
                                <div className="col-lg-8">
                                    <div className="row">
                                        <div className="col-md-4 mb-4">
                                            <div className="counter-card">
                                                <div className="counter-icon">🏆</div>
                                                <CountUp start={ 0 } end={ 35 } duration={ 4 }>
                                                    { ( { countUpRef, start } ) => (
                                                        <div className="count-to">
                                                            <span ref={ countUpRef } className="counter-number" />
                                                            <button onClick={ start } className="d-none">Start</button>
                                                        </div>
                                                    ) }
                                                </CountUp>
                                                <h5 className="counter-title">Years in Business</h5>
                                                <p className="counter-desc">Building trust and excellence through decades of experience</p>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-4">
                                            <div className="counter-card">
                                                <div className="counter-icon">🎨</div>
                                                <CountUp start={ 0 } end={ 50 } duration={ 4 }>
                                                    { ( { countUpRef, start } ) => (
                                                        <div className="count-to">
                                                            <span ref={ countUpRef } className="counter-number" />
                                                            <button onClick={ start } className="d-none">Start</button>
                                                        </div>
                                                    ) }
                                                </CountUp>
                                                <h5 className="counter-title">Design Brands</h5>
                                                <p className="counter-desc">Curated collection of premium fashion labels</p>
                                            </div>
                                        </div>
                                        <div className="col-md-4 mb-4">
                                            <div className="counter-card">
                                                <div className="counter-icon">👥</div>
                                                <CountUp start={ 0 } end={ 130 } duration={ 4 }>
                                                    { ( { countUpRef, start } ) => (
                                                        <div className="count-to">
                                                            <span ref={ countUpRef } className="counter-number" />
                                                            <button onClick={ start } className="d-none">Start</button>
                                                        </div>
                                                    ) }
                                                </CountUp>
                                                <h5 className="counter-title">Team Members</h5>
                                                <p className="counter-desc">Passionate professionals dedicated to your satisfaction</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </Reveal>

                <Reveal keyframes={ fadeIn } delay="50" duration="1000" triggerOnce>
                    <section className="customer-section-modern">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-md-7 mb-4">
                                    <figure className="image-wrapper-modern">
                                        <LazyLoadImage
                                            src="./images/subpages/customer.jpg"
                                            alt="Happy Customer"
                                            width="580"
                                            height="507"
                                            effect="opacity"
                                        />
                                    </figure>
                                </div>
                                <div className="col-md-5 mb-4">
                                    <div className="content-card-modern">
                                        <span className="section-number">02</span>
                                        <h5 className="section-subtitle-modern">Happy Customers</h5>
                                        <h3 className="section-title-modern">Fashionable & Quality Products</h3>
                                        <p className="section-desc-modern">
                                            Millions of satisfied customers trust us for premium quality products. 
                                            As technology evolves and standards rise, we continuously innovate to 
                                            exceed expectations and deliver excellence in every purchase.
                                        </p>
                                        <ALink href="/shop" className="btn-modern">
                                            Visit Our Store
                                            <i className="fas fa-arrow-right"></i>
                                        </ALink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </Reveal>

                <Reveal keyframes={ fadeIn } delay="50" duration="1000" triggerOnce>
                    <section className="store-section-modern">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-md-5 order-md-first mb-4">
                                    <div className="content-card-modern">
                                        <span className="section-number">03</span>
                                        <h5 className="section-subtitle-modern">Our Store</h5>
                                        <h3 className="section-title-modern">Expect Amazing Support</h3>
                                        <p className="section-desc-modern">
                                            Our dedicated support team is here for you 24/7. We believe in 
                                            building lasting relationships with our customers through exceptional 
                                            service and unwavering commitment to your satisfaction.
                                        </p>
                                        <ALink href="/shop" className="btn-modern">
                                            Explore Store
                                            <i className="fas fa-arrow-right"></i>
                                        </ALink>
                                    </div>
                                </div>

                                <div className="col-md-7 mb-4">
                                    <figure className="image-wrapper-modern">
                                        <LazyLoadImage
                                            src="./images/subpages/store.jpg"
                                            alt="Our Store"
                                            width="580"
                                            height="507"
                                            effect="opacity"
                                        />
                                    </figure>
                                </div>
                            </div>
                        </div>
                    </section>
                </Reveal>

                <Reveal keyframes={ fadeIn } delay="50" duration="1000" triggerOnce>
                    <section className="brand-section-modern">
                        <div className="container">
                            <div className="section-header-center">
                                <span className="section-number">04</span>
                                <h5 className="section-subtitle-modern">Our Clients</h5>
                                <h3 className="section-title-modern">Trusted Brands</h3>
                            </div>

                            <OwlCarousel adClass="owl-theme brands-carousel-modern" options={ mainSlider16 }>
                                <figure className="brand-card-modern">
                                    <img src="./images/brands/1.png" alt="Brand" width="180" height="100" />
                                </figure>
                                <figure className="brand-card-modern">
                                    <img src="./images/brands/2.png" alt="Brand" width="180" height="100" />
                                </figure>
                                <figure className="brand-card-modern">
                                    <img src="./images/brands/3.png" alt="Brand" width="180" height="100" />
                                </figure>
                                <figure className="brand-card-modern">
                                    <img src="./images/brands/4.png" alt="Brand" width="180" height="100" />
                                </figure>
                                <figure className="brand-card-modern">
                                    <img src="./images/brands/5.png" alt="Brand" width="180" height="100" />
                                </figure>
                                <figure className="brand-card-modern">
                                    <img src="./images/brands/6.png" alt="Brand" width="180" height="100" />
                                </figure>
                            </OwlCarousel>
                        </div>
                    </section>
                </Reveal>

                <Reveal keyframes={ fadeIn } delay="50" duration="1000" triggerOnce>
                    <section className="team-section-modern">
                        <div className="container">
                            <div className="section-header-center">
                                <span className="section-number">05</span>
                                <h5 className="section-subtitle-modern">Our Leaders</h5>
                                <h3 className="section-title-modern">Meet Our Team</h3>
                            </div>
                            <div className="row cols-sm-2 cols-md-4">
                                <Reveal keyframes={ fadeInLeftShorter } delay="20" duration="1000" triggerOnce>
                                    <div className="team-member-modern">
                                        <figure className="member-image-modern">
                                            <LazyLoadImage
                                                src="./images/subpages/team1.jpg"
                                                alt="Team member"
                                                width={ 280 }
                                                height={ 280 }
                                                effect="opacity"
                                            />

                                            <div className="member-overlay">
                                                <div className="social-links-modern">
                                                    <ALink href="#" className="social-link-modern">
                                                        <i className="fab fa-facebook-f"></i>
                                                    </ALink>
                                                    <ALink href="#" className="social-link-modern">
                                                        <i className="fab fa-twitter"></i>
                                                    </ALink>
                                                    <ALink href="#" className="social-link-modern">
                                                        <i className="fab fa-linkedin-in"></i>
                                                    </ALink>
                                                </div>
                                            </div>
                                        </figure>

                                        <div className="member-info-modern">
                                            <h4 className="member-name-modern">Tomasz Treflerzan</h4>
                                            <h5 className="member-job-modern">CEO / Founder</h5>
                                        </div>
                                    </div>
                                </Reveal>

                                <Reveal keyframes={ fadeInLeftShorter } delay="30" duration="1000" triggerOnce>
                                    <div className="team-member-modern">
                                        <figure className="member-image-modern">
                                            <LazyLoadImage
                                                src="./images/subpages/team2.jpg"
                                                alt="Team member"
                                                width={ 280 }
                                                height={ 280 }
                                                effect="opacity"
                                            />

                                            <div className="member-overlay">
                                                <div className="social-links-modern">
                                                    <ALink href="#" className="social-link-modern">
                                                        <i className="fab fa-facebook-f"></i>
                                                    </ALink>
                                                    <ALink href="#" className="social-link-modern">
                                                        <i className="fab fa-twitter"></i>
                                                    </ALink>
                                                    <ALink href="#" className="social-link-modern">
                                                        <i className="fab fa-linkedin-in"></i>
                                                    </ALink>
                                                </div>
                                            </div>
                                        </figure>

                                        <div className="member-info-modern">
                                            <h4 className="member-name-modern">Dylan Chavez</h4>
                                            <h5 className="member-job-modern">Support Manager</h5>
                                        </div>
                                    </div>
                                </Reveal>

                                <Reveal keyframes={ fadeInLeftShorter } delay="40" duration="1000" triggerOnce>
                                    <div className="team-member-modern">
                                        <figure className="member-image-modern">
                                            <LazyLoadImage
                                                src="./images/subpages/team3.jpg"
                                                alt="Team member"
                                                width={ 280 }
                                                height={ 280 }
                                                effect="opacity"
                                            />

                                            <div className="member-overlay">
                                                <div className="social-links-modern">
                                                    <ALink href="#" className="social-link-modern">
                                                        <i className="fab fa-facebook-f"></i>
                                                    </ALink>
                                                    <ALink href="#" className="social-link-modern">
                                                        <i className="fab fa-twitter"></i>
                                                    </ALink>
                                                    <ALink href="#" className="social-link-modern">
                                                        <i className="fab fa-linkedin-in"></i>
                                                    </ALink>
                                                </div>
                                            </div>
                                        </figure>

                                        <div className="member-info-modern">
                                            <h4 className="member-name-modern">Viktoriia Demianenko</h4>
                                            <h5 className="member-job-modern">Designer</h5>
                                        </div>
                                    </div>
                                </Reveal>

                                <Reveal keyframes={ fadeInLeftShorter } delay="50" duration="1000" triggerOnce>
                                    <div className="team-member-modern">
                                        <figure className="member-image-modern">
                                            <LazyLoadImage
                                                src="./images/subpages/team4.jpg"
                                                alt="Team member"
                                                width={ 280 }
                                                height={ 280 }
                                                effect="opacity"
                                            />

                                            <div className="member-overlay">
                                                <div className="social-links-modern">
                                                    <ALink href="#" className="social-link-modern">
                                                        <i className="fab fa-facebook-f"></i>
                                                    </ALink>
                                                    <ALink href="#" className="social-link-modern">
                                                        <i className="fab fa-twitter"></i>
                                                    </ALink>
                                                    <ALink href="#" className="social-link-modern">
                                                        <i className="fab fa-linkedin-in"></i>
                                                    </ALink>
                                                </div>
                                            </div>
                                        </figure>

                                        <div className="member-info-modern">
                                            <h4 className="member-name-modern">Mikhail Hnatuk</h4>
                                            <h5 className="member-job-modern">Support Specialist</h5>
                                        </div>
                                    </div>
                                </Reveal>
                            </div>
                        </div>
                    </section>
                </Reveal>
            </div>

            <style jsx>{`
                .about-us-modern {
                    background: #f8f9fa;
                }

                .page-header-modern {
                    position: relative;
                    padding: 120px 0 80px;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    overflow: hidden;
                }

                .page-header-modern::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.85) 100%);
                }

                .header-content {
                    position: relative;
                    z-index: 2;
                    text-align: center;
                    color: white;
                }

                .page-subtitle-modern {
                    font-size: 16px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: 16px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }

                .page-title-modern {
                    font-size: 64px;
                    font-weight: 800;
                    color: white;
                    margin: 0 0 20px 0;
                    line-height: 1.2;
                }

                .page-desc-modern {
                    font-size: 18px;
                    color: rgba(255, 255, 255, 0.95);
                    max-width: 600px;
                    margin: 0 auto;
                }

                .page-content-modern {
                    padding: 80px 0 40px;
                }

                .about-section-modern {
                    padding: 60px 0;
                    background: white;
                    border-radius: 24px;
                    margin-bottom: 80px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                }

                .section-number {
                    display: inline-block;
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    font-size: 20px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                }

                .section-header-modern .section-number {
                    margin-bottom: 20px;
                }

                .section-subtitle-modern {
                    font-size: 14px;
                    font-weight: 600;
                    color: #667eea;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-bottom: 12px;
                }

                .section-title-modern {
                    font-size: 36px;
                    font-weight: 800;
                    color: #222;
                    margin-bottom: 20px;
                    line-height: 1.3;
                }

                .section-desc-modern {
                    font-size: 16px;
                    color: #666;
                    line-height: 1.8;
                    margin-bottom: 0;
                }

                .counter-card {
                    background: white;
                    border-radius: 20px;
                    padding: 32px 24px;
                    text-align: center;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                    height: 100%;
                }

                .counter-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2);
                }

                .counter-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                }

                .counter-number {
                    display: block;
                    font-size: 56px;
                    font-weight: 800;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 12px;
                }

                .counter-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #222;
                    margin-bottom: 12px;
                }

                .counter-desc {
                    font-size: 14px;
                    color: #666;
                    line-height: 1.6;
                    margin: 0;
                }

                .customer-section-modern,
                .store-section-modern {
                    padding: 80px 0;
                    background: white;
                    margin-bottom: 80px;
                    border-radius: 24px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                }

                .image-wrapper-modern {
                    border-radius: 20px;
                    overflow: hidden;
                    position: relative;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                }

                .image-wrapper-modern img {
                    width: 100%;
                    height: auto;
                    transition: transform 0.5s ease;
                }

                .image-wrapper-modern:hover img {
                    transform: scale(1.05);
                }

                .content-card-modern {
                    padding: 0 20px;
                }

                .btn-modern {
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 32px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
                    margin-top: 24px;
                }

                .btn-modern:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
                    color: white;
                }

                .brand-section-modern {
                    padding: 80px 0;
                    background: linear-gradient(135deg, #f5f7fa 0%, #e8ebf0 100%);
                    margin-bottom: 80px;
                    border-radius: 24px;
                }

                .section-header-center {
                    text-align: center;
                    margin-bottom: 60px;
                }

                .section-header-center .section-number {
                    margin: 0 auto 20px;
                }

                .brand-card-modern {
                    background: white;
                    border-radius: 16px;
                    padding: 32px;
                    margin: 0 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
                }

                .brand-card-modern:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                }

                .brand-card-modern img {
                    max-width: 100%;
                    height: auto;
                    filter: grayscale(100%);
                    opacity: 0.6;
                    transition: all 0.3s ease;
                }

                .brand-card-modern:hover img {
                    filter: grayscale(0%);
                    opacity: 1;
                }

                .team-section-modern {
                    padding: 80px 0 40px;
                    background: white;
                    border-radius: 24px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                }

                .team-member-modern {
                    margin-bottom: 40px;
                }

                .member-image-modern {
                    position: relative;
                    border-radius: 20px;
                    overflow: hidden;
                    margin-bottom: 20px;
                }

                .member-image-modern img {
                    width: 100%;
                    height: auto;
                    transition: transform 0.5s ease;
                }

                .member-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.9) 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .member-image-modern:hover .member-overlay {
                    opacity: 1;
                }

                .member-image-modern:hover img {
                    transform: scale(1.1);
                }

                .social-links-modern {
                    display: flex;
                    gap: 16px;
                }

                .social-link-modern {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 18px;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .social-link-modern:hover {
                    background: white;
                    color: #667eea;
                    transform: translateY(-4px);
                }

                .member-info-modern {
                    text-align: center;
                }

                .member-name-modern {
                    font-size: 20px;
                    font-weight: 700;
                    color: #222;
                    margin-bottom: 8px;
                }

                .member-job-modern {
                    font-size: 14px;
                    font-weight: 600;
                    color: #667eea;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin: 0;
                }

                @media (max-width: 992px) {
                    .page-title-modern {
                        font-size: 48px;
                    }

                    .section-title-modern {
                        font-size: 28px;
                    }

                    .counter-number {
                        font-size: 48px;
                    }
                }

                @media (max-width: 768px) {
                    .page-header-modern {
                        padding: 80px 0 60px;
                    }

                    .page-title-modern {
                        font-size: 36px;
                    }

                    .page-content-modern {
                        padding: 60px 0 20px;
                    }

                    .about-section-modern,
                    .customer-section-modern,
                    .store-section-modern,
                    .brand-section-modern,
                    .team-section-modern {
                        padding: 40px 20px;
                        margin-bottom: 40px;
                    }

                    .section-title-modern {
                        font-size: 24px;
                    }

                    .counter-card {
                        padding: 24px 16px;
                        margin-bottom: 20px;
                    }

                    .counter-number {
                        font-size: 40px;
                    }
                }
            `}</style>
        </main>
    )

}

export default React.memo( AboutUs );