import React from 'react';
import ALink from '~/components/features/custom-link';

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <div className="row align-items-center">
                        <div className="col-lg-3">
                            <ALink href="/" className="logo-footer">
                                <img src="/images/logoby.png" alt="logo-footer" width="300" height="88" />
                            </ALink>
                        </div>
                        <div className="col-lg-9">
                            <div className="widget widget-newsletter">
                                <div className="widget-body">
                                    <form action="#" className="input-wrapper input-wrapper-inline">
                                        <input type="email" className="form-control" placeholder="Email address here..." required />
                                        <button className="btn btn-primary" type="submit">SUBSCRIBE<i className="d-icon-arrow-right"></i></button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-middle">
                    <div className="row">
                        <div className="col-lg-3 col-md-6">
                            <div className="widget widget-about">
                                <h4 className="widget-title">About Us</h4>
                                <ul className="widget-body">
                                    <li>
                                        <label>Phone: </label>
                                        <ALink href="tel:#">Toll Free (123) 456-7890</ALink>
                                    </li>
                                    <li>
                                        <label>Email: </label>
                                        <ALink href="mailto:support@aurora.com">support@aurora.com</ALink>
                                    </li>
                                    <li>
                                        <label>Address: </label>
                                        <ALink href="#">21 Yonge St, Toronto, ON</ALink>
                                    </li>
                                    <li>
                                        <label>WORKING DAYS / HOURS: </label>
                                    </li>
                                    <li>
                                        <ALink href="#">Mon - Sun / 9:00 AM - 8:00 PM</ALink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="widget">
                                <h4 className="widget-title">Customer Service</h4>
                                <ul className="widget-body">
                                    <li><ALink href="/pages/about-us">About Us</ALink></li>
                                    <li><ALink href="/pages/contact-us">Contact Us</ALink></li>
                                    <li><ALink href="/pages/account">My Account</ALink></li>
                                    <li><ALink href="/pages/order">Order History</ALink></li>
                                    <li><ALink href="#">Advanced Search</ALink></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="widget">
                                <h4 className="widget-title">Main Features</h4>
                                <ul className="widget-body">
                                    <li>Super Fast Delivery</li>
                                    <li>1st AI powered ecom platform</li>
                                    <li>36+ Unique apparel designs</li>
                                    <li>Powerful support system</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="widget widget-instagram">
                                <h4 className="widget-title">Follow Us</h4>
                                <div className="widget-body">
                                    <div className="social-icons">
                                        <a href="https://www.facebook.com" className="social-icon social-facebook" target="_blank" rel="noopener noreferrer" title="Facebook">
                                            <i className="fab fa-facebook-f"></i>
                                        </a>
                                        <a href="https://www.instagram.com" className="social-icon social-instagram" target="_blank" rel="noopener noreferrer" title="Instagram">
                                            <i className="fab fa-instagram"></i>
                                        </a>
                                        <a href="https://www.twitter.com" className="social-icon social-twitter" target="_blank" rel="noopener noreferrer" title="Twitter">
                                            <i className="fab fa-twitter"></i>
                                        </a>
                                        <a href="https://www.youtube.com" className="social-icon social-youtube" target="_blank" rel="noopener noreferrer" title="Youtube">
                                            <i className="fab fa-youtube"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-left">
                        <figure className="payment">
                            <img src="/images/payment.png" alt="payment" width="159" height="29" />
                        </figure>
                    </div>
                    <div className="footer-center">
                        <p className="copyright">SmartStyle eCommerce &copy; 2025. All Rights Reserved</p>
                    </div>
                    <div className="footer-right">
                        <div className="social-links">
                            <ALink href="https://www.facebook.com" className="social-link social-facebook fab fa-facebook-f"></ALink>
                            <ALink href="https://www.twitter.com" className="social-link social-twitter fab fa-twitter"></ALink>
                            <ALink href="https://www.linkedin.com" className="social-link social-linkedin fab fa-linkedin-in"></ALink>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .social-icons {
                    display: flex;
                    gap: 15px;
                    margin-top: 10px;
                }
                .social-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 18px;
                    color: #fff;
                    transition: all 0.3s;
                }
                .social-facebook {
                    background: #3b5998;
                }
                .social-facebook:hover {
                    background: #2d4373;
                    transform: translateY(-3px);
                }
                .social-instagram {
                    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
                }
                .social-instagram:hover {
                    transform: translateY(-3px);
                    opacity: 0.9;
                }
                .social-twitter {
                    background: #1da1f2;
                }
                .social-twitter:hover {
                    background: #0c85d0;
                    transform: translateY(-3px);
                }
                .social-youtube {
                    background: #ff0000;
                }
                .social-youtube:hover {
                    background: #cc0000;
                    transform: translateY(-3px);
                }
            `}</style>
        </footer>
    );
}

export default React.memo(Footer);