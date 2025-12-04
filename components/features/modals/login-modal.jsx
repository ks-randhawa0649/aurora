import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import Modal from 'react-modal';
import LoginIcon from '@mui/icons-material/Login';

import ALink from '~/components/features/custom-link';

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(4px)"
    }
};

let index = 0;

Modal.setAppElement( "#__next" );

function LoginModal() {
    const [ open, setOpen ] = useState( false );

    function closeModal() {
        document.querySelector( ".ReactModal__Overlay" ).classList.add( 'removed' );
        document.querySelector( ".login-popup.ReactModal__Content" ).classList.remove( "ReactModal__Content--after-open" );
        document.querySelector( ".login-popup-overlay.ReactModal__Overlay" ).classList.remove( "ReactModal__Overlay--after-open" );
        setTimeout( () => {
            setOpen( false );
        }, 330 );
    }

    function openModal( e, loginIndex = 0 ) {
        e.preventDefault();
        index = loginIndex;
        setOpen( true );
    }

        const [submitting, setSubmitting] = useState(false);

    async function onLogin(e) {
        e.preventDefault();
        setSubmitting(true);
        const fd = new FormData(e.currentTarget);
        const email = fd.get('singin-email');
        const password = fd.get('singin-password');
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        setSubmitting(false);
        if (res.ok) window.location.href = '/';
        else alert('Invalid email or password');
    }

    async function onRegister(e) {
        e.preventDefault();
        setSubmitting(true);
        const fd = new FormData(e.currentTarget);
        const email = fd.get('register-email');
        const password = fd.get('register-password');
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        setSubmitting(false);
        if (res.ok) window.location.href = '/';
        else alert('Registration failed');
    }

    return (
        <>
            <a className="login-link d-lg-show mr-0 " href="#" onClick={ openModal }>
                <i className="d-icon-user"></i>Sign in</a>
            <span className="delimiter d-lg-show">/</span>
            <a className="register-link ml-0 d-lg-show" onClick={ ( e ) => openModal( e, 1 ) } href="#">Register</a>
            
            {/* Mobile Login Icon */}
            <a className="login-link-mobile d-lg-none" href="#" onClick={ openModal } style={{ display: 'flex', alignItems: 'center', fontSize: '24px', color: '#333' }}>
                <LoginIcon sx={{ fontSize: 28 }} />
            </a>

            {
                open ?
                    <Modal
                        isOpen={ open }
                        onRequestClose={ closeModal }
                        style={ customStyles }
                        contentLabel="Login Modal"
                        className="login-popup"
                        overlayClassName="login-popup-overlay"
                        shouldReturnFocusAfterClose={ false }
                        id="login-modal"
                    >
                        <div className="form-box">
                            <div className="tab tab-nav-simple tab-nav-boxed form-tab">
                                <Tabs selectedTabClassName="active" selectedTabPanelClassName="active" defaultIndex={ index }>
                                    <TabList className="nav nav-tabs nav-fill align-items-center border-no justify-content-center mb-5">
                                        <Tab className="nav-item">
                                            <span className="nav-link border-no lh-1 ls-normal">Sign in</span>
                                        </Tab>
                                        <li className="delimiter">or</li>
                                        <Tab className="nav-item">
                                            <span className="nav-link border-no lh-1 ls-normal">Register</span>
                                        </Tab>
                                    </TabList>

                                    <div className="tab-content">
                                        <TabPanel className="tab-pane">
                                            <form onSubmit={onLogin}>
                                                <div className="form-group mb-3">
                                                    <input type="text" className="form-control" id="singin-email" name="singin-email" placeholder="Username or Email Address *" required />
                                                </div>
                                                <div className="form-group">
                                                    <input type="password" className="form-control" id="singin-password" placeholder="Password *" name="singin-password" required />
                                                </div>
                                                <div className="form-footer">
                                                    <div className="form-checkbox">
                                                        <input type="checkbox" className="custom-checkbox" id="signin-remember" name="signin-remember" />
                                                        <label className="form-control-label" htmlFor="signin-remember">Remember me</label>
                                                    </div>
                                                    <ALink href="#" className="lost-link">Lost your password?</ALink>
                                                </div>
                                                <button className="btn btn-dark btn-block btn-rounded" type="submit">Login</button>
                                            </form>
                                        </TabPanel>

                                        <TabPanel className="tab-pane">
                                            <form onSubmit={onRegister}>
                                                <div className="form-group">
                                                    <label htmlFor="singin-email">Your email address:</label>
                                                    <input type="email" className="form-control" id="register-email" name="register-email" placeholder="Your Email address *" required />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="singin-password">Password:</label>
                                                    <input type="password" className="form-control" id="register-password" name="register-password" placeholder="Password *" required />
                                                </div>
                                                <button className="btn btn-dark btn-block btn-rounded" type="submit">Register</button>
                                            </form>
                                        </TabPanel>
                                    </div>
                                </Tabs>
                            </div>
                        </div>

                        <button title="Close (Esc)" type="button" className="mfp-close" onClick={ closeModal }><span>×</span></button>
                    </Modal> : ''
            }

            <style jsx>{`
                .login-link-mobile {
                    display: none;
                }

                @media (max-width: 991px) {
                    .login-link-mobile {
                        display: flex !important;
                    }
                    .d-lg-show {
                        display: none !important;
                    }
                }
            `}</style>

            <style jsx global>{`
                .login-popup.ReactModal__Content {
                    position: relative;
                    max-width: 560px;
                    margin: 0 auto;
                    padding: 0;
                    background: #fff;
                    border-radius: 12px;
                    overflow: hidden;
                }

                .form-box {
                    padding: 3rem 3rem 4rem;
                }

                .nav.nav-tabs {
                    border-bottom: 1px solid #e1e1e1;
                }

                .nav-item {
                    margin-bottom: -1px;
                }

                .nav-link {
                    padding: 1.5rem 1rem;
                    color: #666;
                    font-size: 1.6rem;
                    font-weight: 600;
                    transition: color .3s;
                }

                .nav-link:hover {
                    color: #667eea;
                }

                .nav-item.active .nav-link {
                    color: #667eea;
                    border-bottom: 2px solid #667eea;
                }

                .delimiter {
                    display: flex;
                    align-items: center;
                    padding: 0 2rem;
                    color: #999;
                    font-size: 1.4rem;
                }

                .tab-content {
                    padding-top: 3rem;
                }

                .form-group {
                    margin-bottom: 2rem;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 0.8rem;
                    color: #333;
                    font-weight: 600;
                    font-size: 1.3rem;
                }

                .form-control {
                    width: 100%;
                    padding: 1.2rem 1.6rem;
                    border: 1px solid #e1e1e1;
                    border-radius: 8px;
                    font-size: 1.4rem;
                    color: #333;
                    transition: border-color .3s;
                }

                .form-control:focus {
                    border-color: #667eea;
                    outline: none;
                }

                .form-control::placeholder {
                    color: #999;
                }

                .form-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    flex-wrap: wrap;
                }

                .form-checkbox {
                    display: flex;
                    align-items: center;
                }

                .custom-checkbox {
                    width: 1.6rem;
                    height: 1.6rem;
                    margin-right: 0.8rem;
                    accent-color: #667eea;
                }

                .form-control-label {
                    color: #666;
                    font-size: 1.3rem;
                    margin: 0;
                }

                .lost-link {
                    color: #667eea;
                    font-size: 1.3rem;
                    text-decoration: none;
                    font-weight: 600;
                }

                .lost-link:hover {
                    text-decoration: underline;
                }

                .btn {
                    width: 100%;
                    padding: 1.4rem;
                    border: none;
                    font-size: 1.5rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    cursor: pointer;
                    transition: all .3s;
                }

                .btn-dark {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #fff;
                }

                .btn-dark:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                }

                .btn-rounded {
                    border-radius: 8px;
                }

                .mfp-close {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    width: 4rem;
                    height: 4rem;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    font-size: 3rem;
                    line-height: 1;
                    color: #999;
                    opacity: 0.7;
                    transition: opacity .3s;
                    z-index: 10;
                }

                .mfp-close:hover {
                    opacity: 1;
                }

                @media (max-width: 576px) {
                    .form-box {
                        padding: 2rem 2rem 3rem;
                    }

                    .nav-link {
                        padding: 1.2rem 0.8rem;
                        font-size: 1.4rem;
                    }

                    .delimiter {
                        padding: 0 1rem;
                    }
                }
            `}</style>
        </>
    )
}

export default ( LoginModal );