import React from 'react';
import Reveal from "react-awesome-reveal";

import { fadeInRightShorter } from '~/utils/data/keyframes';

function ServiceBox ( props ) {
    return (
        <div className="container mt-6 mb-6">
            <div className="service-list">
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
                        <Reveal keyframes={ fadeInRightShorter } delay={ 300 } duration={ 1200 } triggerOnce>
                            <div className="icon-box icon-box-side icon-box1">
                                <i className="icon-box-icon d-icon-truck"></i>

                                <div className="icon-box-content">
                                    <h4 className="icon-box-title text-capitalize ls-normal lh-1">Free Shipping &amp; Return</h4>

                                    <p className="ls-s lh-1">Free shipping on orders over $99</p>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
                        <Reveal keyframes={ fadeInRightShorter } delay={ 400 } duration={ 1200 } triggerOnce>
                            <div className="icon-box icon-box-side icon-box2">
                                <i className="icon-box-icon d-icon-service"></i>

                                <div className="icon-box-content">
                                    <h4 className="icon-box-title text-capitalize ls-normal lh-1">Customer Support 24/7</h4>

                                    <p className="ls-s lh-1">Instant access to perfect support</p>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
                        <Reveal keyframes={ fadeInRightShorter } delay={ 500 } duration={ 1200 } triggerOnce>
                            <div className="icon-box icon-box-side icon-box3">
                                <i className="icon-box-icon d-icon-secure"></i>

                                <div className="icon-box-content">
                                    <h4 className="icon-box-title text-capitalize ls-normal lh-1">100% Secure Payment</h4>

                                    <p className="ls-s lh-1">We ensure secure payment!</p>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .service-list {
                    background: #f8f8f8;
                    border-radius: 8px;
                    padding: 30px 20px;
                }
                .icon-box {
                    display: flex;
                    align-items: center;
                    padding: 25px;
                    background: #fff;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    height: 100%;
                }
                .icon-box:hover {
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                    transform: translateY(-5px);
                }
                .icon-box-icon {
                    font-size: 48px;
                    color: #336699;
                    margin-right: 20px;
                    flex-shrink: 0;
                }
                .icon-box-content {
                    flex: 1;
                }
                .icon-box-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 8px;
                }
                .icon-box-content p {
                    font-size: 14px;
                    color: #666;
                    margin: 0;
                }
                @media (max-width: 991px) {
                    .icon-box {
                        margin-bottom: 15px;
                    }
                }
                @media (max-width: 768px) {
                    .service-list {
                        padding: 20px 10px;
                    }
                    .icon-box {
                        flex-direction: column;
                        text-align: center;
                        padding: 25px 15px;
                    }
                    .icon-box-icon {
                        margin-right: 0;
                        margin-bottom: 15px;
                        font-size: 40px;
                    }
                    .icon-box-title {
                        font-size: 15px;
                    }
                    .icon-box-content p {
                        font-size: 13px;
                    }
                }
            `}</style>
        </div>
    )
}

export default React.memo( ServiceBox );