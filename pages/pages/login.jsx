import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Helmet from 'react-helmet';
import ALink from '~/components/features/custom-link';
import { UserContext } from '../_app';

function Login() {
    const router = useRouter();
    const { user, setUser } = useContext(UserContext);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [registerError, setRegisterError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // If already logged in, redirect
        if (user) {
            const redirect = sessionStorage.getItem('redirectAfterLogin');
            if (redirect) {
                sessionStorage.removeItem('redirectAfterLogin');
                router.push(redirect);
            } else {
                router.push('/pages/account');
            }
        }
    }, [user, router]);

    const handleLoginChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if (res.ok) {
                setUser(data.user);
                const redirect = sessionStorage.getItem('redirectAfterLogin');
                if (redirect) {
                    sessionStorage.removeItem('redirectAfterLogin');
                    router.push(redirect);
                } else {
                    router.push('/pages/account');
                }
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setRegisterError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData)
            });
            const data = await res.json();
            
            if (res.ok) {
                setUser(data.user);
                const redirect = sessionStorage.getItem('redirectAfterLogin');
                if (redirect) {
                    sessionStorage.removeItem('redirectAfterLogin');
                    router.push(redirect);
                } else {
                    router.push('/pages/account');
                }
            } else {
                setRegisterError(data.error || 'Registration failed');
            }
        } catch (err) {
            setRegisterError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (user) {
        return (
            <div className="loading-overlay">
                <div className="bounce-loader">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                    <div className="bounce4"></div>
                </div>
            </div>
        );
    }

    return (
        <main className="main login-page">
            <Helmet>
                <title>Riode React eCommerce Template | Login</title>
            </Helmet>

            <h1 className="d-none">Riode React eCommerce Template - Login</h1>

            <nav className="breadcrumb-nav">
                <div className="container">
                    <ul className="breadcrumb">
                        <li><ALink href="/"><i className="d-icon-home"></i></ALink></li>
                        <li>Login</li>
                    </ul>
                </div>
            </nav>

            <div className="page-content mt-6 pb-2 mb-10">
                <div className="container">
                    <div className="login-popup">
                        <div className="form-box">
                            <div className="tab tab-nav-simple tab-nav-boxed form-tab">
                                <ul className="nav nav-tabs nav-fill align-items-center border-no justify-content-center mb-5" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active border-no lh-1 ls-normal" href="#signin">Login</a>
                                    </li>
                                    <li className="delimiter">or</li>
                                    <li className="nav-item">
                                        <a className="nav-link border-no lh-1 ls-normal" href="#register">Register</a>
                                    </li>
                                </ul>

                                <div className="tab-content">
                                    <div className="tab-pane active" id="signin">
                                        <form onSubmit={handleLoginSubmit}>
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                name="email" 
                                                placeholder="Email Address *" 
                                                value={formData.email}
                                                onChange={handleLoginChange}
                                                required 
                                            />
                                            <input 
                                                type="password" 
                                                className="form-control" 
                                                name="password" 
                                                placeholder="Password *" 
                                                value={formData.password}
                                                onChange={handleLoginChange}
                                                required 
                                            />
                                            {error && <div className="alert alert-danger mt-3">{error}</div>}
                                            <div className="form-footer">
                                                <div className="form-checkbox">
                                                    <input type="checkbox" className="custom-checkbox" id="signin-remember" name="signin-remember" />
                                                    <label className="form-control-label" htmlFor="signin-remember">Remember me</label>
                                                </div>
                                                <ALink href="#" className="lost-link">Lost your password?</ALink>
                                            </div>
                                            <button className="btn btn-dark btn-block btn-rounded" type="submit" disabled={loading}>
                                                {loading ? 'Logging in...' : 'Login'}
                                            </button>
                                        </form>
                                    </div>

                                    <div className="tab-pane" id="register">
                                        <form onSubmit={handleRegisterSubmit}>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="username" 
                                                placeholder="Username *" 
                                                value={registerData.username}
                                                onChange={handleRegisterChange}
                                                required 
                                            />
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                name="email" 
                                                placeholder="Email Address *" 
                                                value={registerData.email}
                                                onChange={handleRegisterChange}
                                                required 
                                            />
                                            <input 
                                                type="password" 
                                                className="form-control" 
                                                name="password" 
                                                placeholder="Password *" 
                                                value={registerData.password}
                                                onChange={handleRegisterChange}
                                                required 
                                            />
                                            {registerError && <div className="alert alert-danger mt-3">{registerError}</div>}
                                            <div className="form-footer">
                                                <div className="form-checkbox">
                                                    <input type="checkbox" className="custom-checkbox" id="register-agree" name="register-agree" required />
                                                    <label className="form-control-label" htmlFor="register-agree">I agree to the privacy policy</label>
                                                </div>
                                            </div>
                                            <button className="btn btn-dark btn-block btn-rounded" type="submit" disabled={loading}>
                                                {loading ? 'Registering...' : 'Register'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default React.memo(Login);