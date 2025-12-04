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
        <main className="main contact-us-modern">
            <Helmet>
                <title>Contact Us | SmartStyle eCommerce</title>
            </Helmet>

            <h1 className="d-none">Contact Us - SmartStyle eCommerce</h1>

            <div className="page-content-modern">
                <div className="container">
                    <div className="contact-header-modern">
                        <h1 className="contact-title-modern">
                            <span className="title-icon">💬</span>
                            Get In Touch
                        </h1>
                        <p className="contact-subtitle-modern">We're here to help and answer any question you might have</p>
                    </div>

                    <section className="contact-info-section-modern">
                        <div className="row">
                            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                <div className="contact-info-card-modern">
                                    <div className="info-icon-modern">📍</div>
                                    <h4 className="info-title-modern">Address</h4>
                                    <p className="info-text-modern">21 Yonge St<br />Toronto, ON<br />Canada</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                <div className="contact-info-card-modern">
                                    <div className="info-icon-modern">📞</div>
                                    <h4 className="info-title-modern">Phone</h4>
                                    <p className="info-text-modern">
                                        <a href="tel:1234567890">Toll Free: (123) 456-7890</a>
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                <div className="contact-info-card-modern">
                                    <div className="info-icon-modern">✉️</div>
                                    <h4 className="info-title-modern">Email</h4>
                                    <p className="info-text-modern">
                                        <a href="mailto:support@aurora.com">support@aurora.com</a>
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                <div className="contact-info-card-modern">
                                    <div className="info-icon-modern">🕐</div>
                                    <h4 className="info-title-modern">Working Hours</h4>
                                    <p className="info-text-modern">Mon - Sun<br />9:00 AM - 8:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="contact-form-section-modern">
                        <div className="row">
                            <div className="col-lg-6 mb-8">
                                <div className="form-card-modern">
                                    <h2 className="form-title-modern">Send Us a Message</h2>
                                    <p className="form-desc-modern">
                                        Fill out the form below and we'll get back to you as soon as possible.
                                    </p>

                                    <form className="contact-form-modern" onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-sm-6 mb-4">
                                                <input 
                                                    type="text" 
                                                    className="form-control-modern" 
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
                                                    className="form-control-modern" 
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
                                                    className="form-control-modern" 
                                                    name="phone" 
                                                    placeholder="Your Phone" 
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-sm-6 mb-4">
                                                <input 
                                                    type="text" 
                                                    className="form-control-modern" 
                                                    name="subject" 
                                                    placeholder="Subject" 
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group mb-5">
                                            <textarea 
                                                className="form-control-modern" 
                                                name="message" 
                                                placeholder="Your Message *" 
                                                rows="6"
                                                value={formData.message}
                                                onChange={handleChange}
                                                required
                                            ></textarea>
                                        </div>
                                        <button 
                                            type="submit" 
                                            className="btn-submit-modern"
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <>
                                                    <span className="spinner-small"></span>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <i className="fas fa-paper-plane"></i>
                                                </>
                                            )}
                                        </button>
                                        {submitMessage && (
                                            <div className="alert-success-modern">
                                                ✓ {submitMessage}
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>

                            <div className="col-lg-6 mb-8">
                                <div className="map-card-modern">
                                    <h2 className="form-title-modern">Find Us Here</h2>
                                    <div className="map-wrapper-modern">
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
                        </div>
                    </section>

                    <section className="features-section-modern">
                        <h2 className="features-title-modern">Why Choose Us?</h2>
                        <div className="row">
                            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                <div className="feature-card-modern">
                                    <div className="feature-icon-modern">🚚</div>
                                    <h4 className="feature-title-modern">Free Shipping</h4>
                                    <p className="feature-desc-modern">On orders over $99</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                <div className="feature-card-modern">
                                    <div className="feature-icon-modern">💬</div>
                                    <h4 className="feature-title-modern">24/7 Support</h4>
                                    <p className="feature-desc-modern">We're here to help</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                <div className="feature-card-modern">
                                    <div className="feature-icon-modern">💰</div>
                                    <h4 className="feature-title-modern">Money Back</h4>
                                    <p className="feature-desc-modern">30 days guarantee</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                                <div className="feature-card-modern">
                                    <div className="feature-icon-modern">🔒</div>
                                    <h4 className="feature-title-modern">Secure Payment</h4>
                                    <p className="feature-desc-modern">Safe & protected</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <style jsx>{`
                .contact-us-modern {
                    background: #f8f9fa;
                    min-height: 100vh;
                }

                .page-content-modern {
                    padding: 60px 0 80px;
                }

                .contact-header-modern {
                    text-align: center;
                    margin-bottom: 60px;
                }

                .contact-title-modern {
                    font-size: 48px;
                    font-weight: 800;
                    color: #222;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 16px;
                }

                .title-icon {
                    font-size: 52px;
                }

                .contact-subtitle-modern {
                    font-size: 18px;
                    color: #666;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .contact-info-section-modern {
                    margin-bottom: 60px;
                }

                .contact-info-card-modern {
                    background: white;
                    border-radius: 20px;
                    padding: 40px 24px;
                    text-align: center;
                    height: 100%;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
                }

                .contact-info-card-modern:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2);
                }

                .info-icon-modern {
                    font-size: 56px;
                    margin-bottom: 20px;
                }

                .info-title-modern {
                    font-size: 20px;
                    font-weight: 700;
                    color: #222;
                    margin-bottom: 12px;
                }

                .info-text-modern {
                    font-size: 15px;
                    color: #666;
                    line-height: 1.8;
                    margin: 0;
                }

                .info-text-modern a {
                    color: #667eea;
                    text-decoration: none;
                    font-weight: 600;
                    transition: opacity 0.3s ease;
                }

                .info-text-modern a:hover {
                    opacity: 0.8;
                }

                .contact-form-section-modern {
                    margin-bottom: 60px;
                }

                .form-card-modern,
                .map-card-modern {
                    background: white;
                    border-radius: 24px;
                    padding: 40px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    height: 100%;
                }

                .form-title-modern {
                    font-size: 28px;
                    font-weight: 800;
                    color: #222;
                    margin-bottom: 12px;
                }

                .form-desc-modern {
                    font-size: 16px;
                    color: #666;
                    margin-bottom: 32px;
                    line-height: 1.6;
                }

                .contact-form-modern {
                    width: 100%;
                }

                .form-control-modern {
                    width: 100%;
                    padding: 14px 18px;
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    font-size: 15px;
                    transition: all 0.3s ease;
                    background: white;
                }

                .form-control-modern:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
                }

                .form-control-modern::placeholder {
                    color: #999;
                }

                .btn-submit-modern {
                    width: 100%;
                    padding: 16px 32px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }

                .btn-submit-modern:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
                }

                .btn-submit-modern:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .spinner-small {
                    width: 18px;
                    height: 18px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .alert-success-modern {
                    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
                    border: 2px solid #28a745;
                    color: #155724;
                    border-radius: 12px;
                    padding: 16px 20px;
                    margin-top: 20px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .map-wrapper-modern {
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                    margin-top: 24px;
                }

                .features-section-modern {
                    background: white;
                    border-radius: 24px;
                    padding: 60px 40px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                }

                .features-title-modern {
                    font-size: 36px;
                    font-weight: 800;
                    color: #222;
                    text-align: center;
                    margin-bottom: 48px;
                }

                .feature-card-modern {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border-radius: 20px;
                    padding: 32px 24px;
                    text-align: center;
                    height: 100%;
                    transition: all 0.3s ease;
                }

                .feature-card-modern:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.15);
                }

                .feature-icon-modern {
                    font-size: 52px;
                    margin-bottom: 16px;
                }

                .feature-title-modern {
                    font-size: 18px;
                    font-weight: 700;
                    color: #222;
                    margin-bottom: 8px;
                }

                .feature-desc-modern {
                    font-size: 14px;
                    color: #666;
                    margin: 0;
                }

                @media (max-width: 992px) {
                    .contact-title-modern {
                        font-size: 40px;
                    }

                    .form-card-modern,
                    .map-card-modern {
                        padding: 32px 24px;
                    }
                }

                @media (max-width: 768px) {
                    .page-content-modern {
                        padding: 30px 0 40px;
                        margin-top: 2rem;
                    }

                    .contact-header-modern {
                        margin-bottom: 30px;
                        padding: 0 10px;
                    }

                    .contact-title-modern {
                        font-size: 24px;
                        flex-direction: column;
                        gap: 8px;
                        margin-bottom: 12px;
                    }

                    .title-icon {
                        font-size: 32px;
                    }

                    .contact-subtitle-modern {
                        font-size: 14px;
                    }

                    .contact-info-section-modern {
                        margin-bottom: 30px;
                    }

                    .contact-info-section-modern .row {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 12px;
                    }

                    .contact-info-section-modern .col-lg-3,
                    .contact-info-section-modern .col-md-6,
                    .contact-info-section-modern .col-sm-6 {
                        max-width: 100%;
                        margin-bottom: 0 !important;
                    }

                    .contact-info-card-modern {
                        padding: 20px 16px;
                        margin-bottom: 0;
                    }

                    .info-icon-modern {
                        font-size: 32px;
                        margin-bottom: 12px;
                    }

                    .info-title-modern {
                        font-size: 16px;
                        margin-bottom: 8px;
                    }

                    .info-text-modern {
                        font-size: 13px;
                    }

                    .form-card-modern,
                    .map-card-modern {
                        padding: 16px;
                        margin-bottom: 16px;
                    }

                    .form-title-modern {
                        font-size: 20px;
                        margin-bottom: 12px;
                    }

                    .form-desc-modern {
                        font-size: 13px;
                        margin-bottom: 20px;
                    }

                    .form-control-modern {
                        padding: 10px 12px;
                        font-size: 13px;
                        margin-bottom: 12px;
                    }

                    .form-control-modern textarea {
                        padding: 10px 12px;
                        min-height: 100px;
                    }

                    .btn-submit-modern {
                        padding: 12px 24px;
                        font-size: 14px;
                    }

                    .map-wrapper-modern {
                        height: 300px;
                    }

                    .features-section-modern {
                        padding: 30px 16px;
                    }

                    .features-title-modern {
                        font-size: 22px;
                        margin-bottom: 20px;
                    }

                    .features-subtitle-modern {
                        font-size: 14px;
                    }

                    .features-section-modern .row {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 12px;
                    }

                    .features-section-modern .col-lg-3,
                    .features-section-modern .col-md-6,
                    .features-section-modern .col-sm-6 {
                        max-width: 100%;
                        margin-bottom: 0 !important;
                    }

                    .feature-card-modern {
                        padding: 20px 16px;
                    }

                    .feature-icon-modern {
                        width: 50px;
                        height: 50px;
                        font-size: 24px;
                        margin-bottom: 12px;
                    }

                    .feature-title-modern {
                        font-size: 16px;
                        margin-bottom: 6px;
                    }

                    .feature-desc-modern {
                        font-size: 13px;
                    }
                }
            `}</style>
        </main>
    );
}

export default React.memo(ContactUs);