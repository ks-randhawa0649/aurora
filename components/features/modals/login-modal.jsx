import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import Modal from 'react-modal';

import ALink from '~/components/features/custom-link';

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: "flex"
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
            <a className="login-link d-lg-show" href="#" onClick={ openModal }>
                <i className="d-icon-user"></i>Sign in</a>
            <span className="delimiter">/</span>
            <a className="register-link ml-0" onClick={ ( e ) => openModal( e, 1 ) } href="#">Register</a>

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
                                                <div className="form-footer">
                                                    <div className="form-checkbox">
                                                        <input type="checkbox" className="custom-checkbox" id="register-agree" name="register-agree"
                                                            required />
                                                        <label className="form-control-label" htmlFor="register-agree">I agree to the privacy policy</label>
                                                    </div>
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
        </>
    )
}

export default ( LoginModal );