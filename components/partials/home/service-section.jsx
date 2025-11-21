import React from 'react';
import Reveal from "react-awesome-reveal";

import { fadeInRightShorter } from '~/utils/data/keyframes';

// Material UI Icons
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function ServiceBox ( props ) {
    return (
        <div className="service-section">
            <div className="container">
                <div className="service-wrapper">
                    <div className="row g-4">
                        <div className="col-lg-4 col-md-6">
                            <Reveal keyframes={ fadeInRightShorter } delay={ 200 } duration={ 1000 } triggerOnce>
                                <div className="service-card card-shipping">
                                    <div className="service-icon-wrapper">
                                        <div className="icon-circle">
                                            <LocalShippingOutlinedIcon sx={{ fontSize: 40, color: '#fff' }} />
                                        </div>
                                    </div>
                                    <div className="service-content">
                                        <h3 className="service-title">Free Shipping & Return</h3>
                                        <p className="service-description">Free shipping on orders over $99</p>
                                    </div>
                                    <div className="service-badge">01</div>
                                </div>
                            </Reveal>
                        </div>

                        <div className="col-lg-4 col-md-6">
                            <Reveal keyframes={ fadeInRightShorter } delay={ 400 } duration={ 1000 } triggerOnce>
                                <div className="service-card card-support">
                                    <div className="service-icon-wrapper">
                                        <div className="icon-circle">
                                            <SupportAgentOutlinedIcon sx={{ fontSize: 40, color: '#fff' }} />
                                        </div>
                                    </div>
                                    <div className="service-content">
                                        <h3 className="service-title">Customer Support 24/7</h3>
                                        <p className="service-description">Instant access to perfect support</p>
                                    </div>
                                    <div className="service-badge">02</div>
                                </div>
                            </Reveal>
                        </div>

                        <div className="col-lg-4 col-md-6">
                            <Reveal keyframes={ fadeInRightShorter } delay={ 600 } duration={ 1000 } triggerOnce>
                                <div className="service-card card-payment">
                                    <div className="service-icon-wrapper">
                                        <div className="icon-circle">
                                            <LockOutlinedIcon sx={{ fontSize: 40, color: '#fff' }} />
                                        </div>
                                    </div>
                                    <div className="service-content">
                                        <h3 className="service-title">100% Secure Payment</h3>
                                        <p className="service-description">We ensure secure payment!</p>
                                    </div>
                                    <div className="service-badge">03</div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .service-section {
                    padding: 80px 0;
                    background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
                    position: relative;
                    overflow: hidden;
                }

                .service-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(circle at 20% 30%, rgba(34, 102, 204, 0.05) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.05) 0%, transparent 50%);
                    pointer-events: none;
                }

                .service-wrapper {
                    position: relative;
                    z-index: 1;
                }

                .service-card {
                    position: relative;
                    background: #fff;
                    border-radius: 20px;
                    padding: 40px 30px;
                    height: 100%;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 2px solid transparent;
                    overflow: hidden;
                }

                .service-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, rgba(34, 102, 204, 0.05), rgba(34, 102, 204, 0.02));
                    opacity: 0;
                    transition: opacity 0.4s ease;
                }

                .service-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    border-color: rgba(34, 102, 204, 0.2);
                }

                .service-card:hover::before {
                    opacity: 1;
                }

                .card-shipping:hover .icon-circle {
                    background: linear-gradient(135deg, #26c 0%, #1a5bb8 100%);
                    transform: scale(1.1) rotate(10deg);
                    box-shadow: 0 15px 35px rgba(34, 102, 204, 0.5);
                }

                .card-support:hover .icon-circle {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    transform: scale(1.1) rotate(10deg);
                    box-shadow: 0 15px 35px rgba(240, 147, 251, 0.5);
                }

                .card-payment:hover .icon-circle {
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    transform: scale(1.1) rotate(10deg);
                    box-shadow: 0 15px 35px rgba(79, 172, 254, 0.5);
                }

                /* Individual card icon colors */
                .card-support .icon-circle {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    box-shadow: 0 10px 25px rgba(240, 147, 251, 0.3);
                }

                .card-payment .icon-circle {
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    box-shadow: 0 10px 25px rgba(79, 172, 254, 0.3);
                }

                .service-icon-wrapper {
                    margin-bottom: 25px;
                }

                .icon-circle {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #26c 0%, #1a5bb8 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                    transition: all 0.4s ease;
                    box-shadow: 0 10px 25px rgba(34, 102, 204, 0.3);
                    position: relative;
                }

                .icon-circle::before {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: inherit;
                    opacity: 0.3;
                    transform: scale(1.3);
                    transition: all 0.4s ease;
                }

                .service-card:hover .icon-circle::before {
                    transform: scale(1.5);
                    opacity: 0;
                }

                .icon-circle i {
                    font-size: 36px;
                    color: #fff;
                    position: relative;
                    z-index: 1;
                }

                .icon-circle svg {
                    color: #fff;
                    position: relative;
                    z-index: 1;
                }

                .service-content {
                    text-align: center;
                    position: relative;
                    z-index: 2;
                }

                .service-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #222;
                    margin-bottom: 12px;
                    line-height: 1.3;
                }

                .service-description {
                    font-size: 15px;
                    color: #666;
                    line-height: 1.6;
                    margin: 0;
                }

                .service-badge {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 45px;
                    height: 45px;
                    background: rgba(34, 102, 204, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    font-weight: 800;
                    color: #26c;
                    transition: all 0.3s ease;
                }

                .service-card:hover .service-badge {
                    background: #26c;
                    color: #fff;
                    transform: rotate(360deg);
                }

                /* Responsive */
                @media (max-width: 991px) {
                    .service-section {
                        padding: 60px 0;
                    }

                    .service-card {
                        padding: 35px 25px;
                        margin-bottom: 20px;
                    }
                }

                @media (max-width: 767px) {
                    .service-section {
                        padding: 50px 0;
                    }

                    .service-card {
                        padding: 30px 20px;
                    }

                    .icon-circle {
                        width: 70px;
                        height: 70px;
                    }

                    .icon-circle i {
                        font-size: 32px;
                    }

                    .icon-circle svg {
                        font-size: 36px;
                    }

                    .service-title {
                        font-size: 18px;
                    }

                    .service-description {
                        font-size: 14px;
                    }

                    .service-badge {
                        width: 40px;
                        height: 40px;
                        font-size: 14px;
                    }
                }

                @media (max-width: 575px) {
                    .service-card {
                        padding: 25px 15px;
                    }

                    .icon-circle {
                        width: 65px;
                        height: 65px;
                    }

                    .icon-circle i {
                        font-size: 28px;
                    }

                    .icon-circle svg {
                        font-size: 32px;
                    }

                    .service-title {
                        font-size: 17px;
                    }
                }
            `}</style>
        </div>
    )
}

export default React.memo( ServiceBox );