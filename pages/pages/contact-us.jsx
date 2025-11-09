import React, { useState } from 'react';
import Helmet from 'react-helmet';
import ALink from '~/components/features/custom-link';

function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitMessage('');

        // Simulate form submission
        setTimeout(() => {
            setSubmitting(false);
            setSubmitMessage('Thank you for contacting us! We will get back to you shortly.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        }, 1500);
    };

    return (
        <main className="main contact-us">
            <Helmet>
                <title>Contact Us | SmartStyle eCommerce</title>
            </Helmet>

            <h1 className="d-none">Contact Us - SmartStyle eCommerce</h1>

            <nav className="breadcrumb-nav">
                <div className="container">
                    <ul className="breadcrumb">
                        <li><ALink href="/"><i className="d-icon-home"></i></ALink></li>
                        <li>Contact Us</li>
                    </ul>
                </div>
            </nav>

            <div className="page-content mt-10 pt-7">
                <div className="container">
                    <section className="contact-section">
                        <div className="row">
                            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                <div className="contact-info-box">
                                    <i className="d-icon-map"></i>
                                    <h4>Address</h4>
                                    <p>21 Yonge St<br />Toronto, ON<br />Canada</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                <div className="contact-info-box">
                                    <i className="d-icon-phone"></i>
                                    <h4>Phone</h4>
                                    <p>
                                        <a href="tel:1234567890">Toll Free: (123) 456-7890</a>
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                <div className="contact-info-box">
                                    <i className="d-icon-envelope"></i>
                                    <h4>Email</h4>
                                    <p>
                                        <a href="mailto:support@aurora.com">support@aurora.com</a>
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                <div className="contact-info-box">
                                    <i className="d-icon-clock"></i>
                                    <h4>Working Hours</h4>
                                    <p>Mon - Sun<br />9:00 AM - 8:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="divider mb-10 pb-1" />

                    <section className="contact-section">
                        <div className="row">
                            <div className="col-lg-6 mb-8">
                                <h2 className="title title-simple text-left mb-5">Get In Touch</h2>
                                <p className="mb-6">
                                    We're here to help and answer any question you might have. We look forward to hearing from you!
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </p>

                                <form className="contact-form" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-sm-6 mb-4">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="name" 
                                                placeholder="Your Name *" 
                                                value={formData.name}
                                                onChange={handleChange}
                                                required 
                                            />
                                        </div>
                                        <div className="col-sm-6 mb-4">
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                name="email" 
                                                placeholder="Your Email *" 
                                                value={formData.email}
                                                onChange={handleChange}
                                                required 
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6 mb-4">
                                            <input 
                                                type="tel" 
                                                className="form-control" 
                                                name="phone" 
                                                placeholder="Your Phone" 
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-sm-6 mb-4">
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="subject" 
                                                placeholder="Subject" 
                                                value={formData.subject}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group mb-5">
                                        <textarea 
                                            className="form-control" 
                                            name="message" 
                                            placeholder="Your Message *" 
                                            rows="8"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="btn btn-dark btn-rounded"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Sending...' : 'Send Message'}
                                        <i className="d-icon-arrow-right"></i>
                                    </button>
                                    {submitMessage && (
                                        <div className="alert alert-success mt-4" role="alert">
                                            {submitMessage}
                                        </div>
                                    )}
                                </form>
                            </div>

                            <div className="col-lg-6 mb-8">
                                <h2 className="title title-simple text-left mb-5">Find Us Here</h2>
                                <div className="map-container">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2887.0493784195777!2d-79.3790665!3d43.6461999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cb2db28b30ab%3A0xac14a68c40860c88!2s21%20Yonge%20St%2C%20Toronto%2C%20ON%20M5J%202X7!5e0!3m2!1sen!2sca!4v1699000000000!5m2!1sen!2sca"
                                        width="100%"
                                        height="450"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="contact-section pb-10">
                        <div className="row">
                            <div className="col-12">
                                <h2 className="title title-simple text-center mb-5">Why Choose Us?</h2>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                <div className="icon-box text-center">
                                    <i className="d-icon-truck"></i>
                                    <div className="icon-box-content">
                                        <h4>Free Shipping</h4>
                                        <p>On orders over $99</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                <div className="icon-box text-center">
                                    <i className="d-icon-service"></i>
                                    <div className="icon-box-content">
                                        <h4>24/7 Support</h4>
                                        <p>We're here to help</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                <div className="icon-box text-center">
                                    <i className="d-icon-money"></i>
                                    <div className="icon-box-content">
                                        <h4>Money Back</h4>
                                        <p>30 days guarantee</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                <div className="icon-box text-center">
                                    <i className="d-icon-lock"></i>
                                    <div className="icon-box-content">
                                        <h4>Secure Payment</h4>
                                        <p>Safe & protected</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <style jsx>{`
                .contact-info-box {
                    text-align: center;
                    padding: 30px 20px;
                    background: #f8f8f8;
                    border-radius: 8px;
                    transition: all 0.3s;
                    height: 100%;
                }
                .contact-info-box:hover {
                    background: #fff;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                    transform: translateY(-5px);
                }
                .contact-info-box i {
                    font-size: 40px;
                    color: #336699;
                    margin-bottom: 15px;
                }
                .contact-info-box h4 {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 10px;
                    color: #333;
                }
                .contact-info-box p {
                    font-size: 14px;
                    color: #666;
                    margin: 0;
                    line-height: 1.8;
                }
                .contact-info-box a {
                    color: #666;
                    transition: color 0.3s;
                }
                .contact-info-box a:hover {
                    color: #336699;
                }
                .map-container {
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                }
                .icon-box {
                    padding: 30px 20px;
                    background: #f8f8f8;
                    border-radius: 8px;
                    transition: all 0.3s;
                    height: 100%;
                }
                .icon-box:hover {
                    background: #fff;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                }
                .icon-box i {
                    font-size: 48px;
                    color: #336699;
                    margin-bottom: 15px;
                }
                .icon-box h4 {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 5px;
                    color: #333;
                }
                .icon-box p {
                    font-size: 14px;
                    color: #666;
                    margin: 0;
                }
                .contact-form .form-control {
                    border-radius: 5px;
                    border: 1px solid #e1e1e1;
                    padding: 12px 20px;
                    font-size: 14px;
                }
                .contact-form .form-control:focus {
                    border-color: #336699;
                    box-shadow: 0 0 0 0.2rem rgba(51, 102, 153, 0.1);
                }
                .alert-success {
                    background-color: #d4edda;
                    border-color: #c3e6cb;
                    color: #155724;
                    border-radius: 5px;
                    padding: 15px;
                }
            `}</style>
        </main>
    );
}

export default React.memo(ContactUs);