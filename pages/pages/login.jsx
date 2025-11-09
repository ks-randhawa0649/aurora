import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';

function Login() {
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
        <main className="main">
            {/* ...existing code... */}
            <div className="page-content mt-6 pb-2 mb-10">
                <div className="container">
                    <div className="login-popup">
                        <div className="form-box">
                            <div className="tab tab-nav-simple tab-nav-boxed form-tab">
                                <Tabs selectedTabClassName="active" selectedTabPanelClassName="active">
                                    {/* ...existing code... */}
                                    <div className="tab-content">
                                        <TabPanel className="tab-pane">
                                            {/* CHANGED: add onSubmit */}
                                            <form onSubmit={onLogin}>
                                                <div className="form-group mb-3">
                                                    <input type="text" className="form-control" id="singin-email-2" name="singin-email" placeholder="Username or Email Address *" required />
                                                </div>
                                                <div className="form-group">
                                                    <input type="password" className="form-control" id="singin-password-2" placeholder="Password *" name="singin-password" required />
                                                </div>
                                                <div className="form-footer">
                                                    {/* ...existing code... */}
                                                </div>
                                                <button className="btn btn-dark btn-block btn-rounded" type="submit" disabled={submitting}>
                                                    {submitting ? 'Please wait…' : 'Login'}
                                                </button>
                                            </form>
                                            {/* ...existing code... */}
                                        </TabPanel>

                                        <TabPanel className="tab-pane">
                                            {/* CHANGED: add onSubmit */}
                                            <form onSubmit={onRegister}>
                                                <div className="form-group">
                                                    <label htmlFor="register-email-2">Your email address:</label>
                                                    <input type="email" className="form-control" id="register-email-2" name="register-email" placeholder="Your Email address *" required />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="register-password-2">Password:</label>
                                                    <input type="password" className="form-control" id="register-password-2" name="register-password" placeholder="Password *" required />
                                                </div>
                                                <div className="form-footer">
                                                    {/* ...existing code... */}
                                                </div>
                                                <button className="btn btn-dark btn-block btn-rounded" type="submit" disabled={submitting}>
                                                    {submitting ? 'Please wait…' : 'Register'}
                                                </button>
                                            </form>
                                            {/* ...existing code... */}
                                        </TabPanel>
                                    </div>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main >
    )
}

export default React.memo(Login);