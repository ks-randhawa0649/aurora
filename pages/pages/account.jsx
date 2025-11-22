import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Helmet from 'react-helmet';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';

import ALink from '~/components/features/custom-link';
import { UserContext } from '../_app';

function Account() {
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        displayName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [updateMessage, setUpdateMessage] = useState('');

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!user && !loading) {
            router.push('/pages/login');
        }
        
        if (user) {
            syncCustomerAndFetchData();
        }
        
        setLoading(false);
    }, [user, loading, router]);

    async function syncCustomerAndFetchData() {
        try {
            // First, ensure customer record exists
            const syncResponse = await fetch('/api/user/sync-customer', {
                method: 'POST'
            });
            const syncData = await syncResponse.json();
            console.log('Customer sync:', syncData);

            // Then fetch orders and profile
            await fetchOrders();
            await fetchProfile();
        } catch (error) {
            console.error('Error syncing customer:', error);
        }
    }

    async function fetchOrders() {
        try {
            const response = await fetch('/api/user/orders');
            const data = await response.json();
            console.log('Orders data:', data);
            if (response.ok) {
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    async function fetchProfile() {
        try {
            const response = await fetch('/api/user/profile');
            const data = await response.json();
            if (response.ok) {
                setProfile(data.profile);
                const nameParts = (data.profile.fullName || '').split(' ');
                setFormData({
                    firstName: nameParts[0] || '',
                    lastName: nameParts.slice(1).join(' ') || '',
                    displayName: data.profile.username || data.profile.fullName || '',
                    email: data.profile.email || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }

    function handleInputChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        setUpdateMessage('');

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullName: `${formData.firstName} ${formData.lastName}`.trim()
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                setUpdateMessage('Profile updated successfully!');
                fetchProfile();
            } else {
                setUpdateMessage('Failed to update profile: ' + data.error);
            }
        } catch (error) {
            setUpdateMessage('Error updating profile: ' + error.message);
        }
    }

    async function handleLogout(e) {
        e.preventDefault();
        setLoading(true);
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push('/');
    }

    if (loading || !user) {
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
        <main className="main account">
            <Helmet>
                <title>Riode React eCommerce Template | Account</title>
            </Helmet>

            <h1 className="d-none">Riode React eCommerce Template - Account</h1>

            <nav className="breadcrumb-nav">
                <div className="container">
                    <ul className="breadcrumb">
                        <li><ALink href="/"><i className="d-icon-home"></i></ALink></li>
                        <li>Account</li>
                    </ul>
                </div>
            </nav>

            <div className="page-content mt-4 mb-10 pb-6">
                <div className="container">
                    <h2 className="title title-center mb-10">My Account</h2>

                    <Tabs selectedTabClassName="show" selectedTabPanelClassName="active" defaultIndex={0} className="tab tab-vertical gutter-lg">
                        <TabList className="nav nav-tabs mb-4 col-lg-3 col-md-4" role="tablist">
                            <Tab className="nav-item">
                                <a className="nav-link">Dashboard</a>
                            </Tab>
                            <Tab className="nav-item">
                                <a className="nav-link">Orders</a>
                            </Tab>
                            {/* <Tab className="nav-item">
                                <a className="nav-link">Downloads</a>
                            </Tab> */}
                            <Tab className="nav-item">
                                <a className="nav-link">Address</a>
                            </Tab>
                            <Tab className="nav-item">
                                <a className="nav-link">Account details</a>
                            </Tab>
                            <Tab className="nav-item">
                                <a className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</a>
                            </Tab>
                        </TabList>
                        <div className="tab-content col-lg-9 col-md-8">
                            <TabPanel className="tab-pane dashboard">
                                <p className="mb-0">
                                    Hello <span>{user.username || user.email}</span> (not <span>{user.username || user.email}</span>? <a href="#" onClick={handleLogout} className="text-primary" style={{ cursor: 'pointer' }}>Log out</a>)
                                </p>
                                <p className="mb-8">
                                    From your account dashboard you can view your <ALink href="#" className="link-to-tab text-primary">recent orders</ALink>, manage your shipping and billing
                                    addresses,<br />and edit your password and account details.
                                </p>
                                <ALink href="/pages/shop" className="btn btn-dark btn-rounded">Go To Shop<i className="d-icon-arrow-right"></i></ALink>
                            </TabPanel>
                            <TabPanel className="tab-pane">
                                {orders.length === 0 ? (
                                    <div className="empty-state">
                                        <p className="mb-4 text-body">No orders found.</p>
                                        <ALink href="/pages/shop" className="btn btn-primary btn-rounded">
                                            Start Shopping<i className="d-icon-arrow-right"></i>
                                        </ALink>
                                    </div>
                                ) : (
                                    <table className="order-table">
                                        <thead>
                                            <tr>
                                                <th className="pl-2">Order</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Total</th>
                                                <th className="pr-2">Items</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order.id}>
                                                    <td className="order-number">
                                                        <span>{order.orderNumber}</span>
                                                    </td>
                                                    <td className="order-date">
                                                        <time>{order.date}</time>
                                                    </td>
                                                    <td className="order-status">
                                                        <span className={`badge badge-${order.status === 'paid' ? 'success' : 'warning'}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="order-total">
                                                        <span>{order.total}</span>
                                                    </td>
                                                    <td className="order-items">
                                                        <span>{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </TabPanel>
                            {/* <TabPanel className="tab-pane downloads">
                                <p className="mb-4 text-body">No downloads available yet.</p>
                                <ALink href="/pages/shop" className="btn btn-primary btn-link btn-underline">Browser Products<i className="d-icon-arrow-right"></i></ALink>
                            </TabPanel> */}
                            <TabPanel className="tab-pane">
                                <p className="mb-2">The following addresses will be used on the checkout page by default.
                                </p>
                                <div className="row">
                                    {profile && profile.addresses && profile.addresses.length > 0 ? (
                                        profile.addresses.map((address) => (
                                            <div className="col-sm-6 mb-4" key={address.id}>
                                                <div className="card card-address">
                                                    <div className="card-body">
                                                        <h5 className="card-title text-uppercase">
                                                            {address.kind} Address
                                                        </h5>
                                                        <p>
                                                            {profile.fullName}<br />
                                                            {address.line1}<br />
                                                            {address.line2 && <>{address.line2}<br /></>}
                                                            {address.city}, {address.region} {address.postalCode}<br />
                                                            {address.country}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12">
                                            <p className="text-body">No saved addresses yet. Addresses will be saved when you make your first order.</p>
                                        </div>
                                    )}
                                </div>
                            </TabPanel>
                            <TabPanel className="tab-pane">
                                <form onSubmit={handleFormSubmit} className="form">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <label>First Name *</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="firstName" 
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required 
                                            />
                                        </div>
                                        <div className="col-sm-6">
                                            <label>Last Name *</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required 
                                            />
                                        </div>
                                    </div>

                                    <label>Display Name *</label>
                                    <input 
                                        type="text" 
                                        className="form-control mb-0" 
                                        name="displayName"
                                        value={formData.displayName}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                    <small className="d-block form-text mb-7">This will be how your name will be displayed
                                        in the account section and in reviews</small>

                                    <label>Email Address *</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        name="email"
                                        value={formData.email}
                                        disabled
                                        title="Email cannot be changed"
                                    />
                                    <small className="d-block form-text mb-7 text-muted">Email address cannot be changed</small>

                                    <fieldset>
                                        <legend>Password Change</legend>
                                        <label>Current password (leave blank to leave unchanged)</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleInputChange}
                                        />

                                        <label>New password (leave blank to leave unchanged)</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                        />

                                        <label>Confirm new password</label>
                                        <input 
                                            type="password" 
                                            className="form-control" 
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                        />
                                    </fieldset>

                                    {updateMessage && (
                                        <div className={`alert ${updateMessage.includes('successfully') ? 'alert-success' : 'alert-danger'} mb-4`}>
                                            {updateMessage}
                                        </div>
                                    )}

                                    <button type="submit" className="btn btn-primary">SAVE CHANGES</button>
                                </form>
                            </TabPanel>
                        </div>
                    </Tabs>
                </div>
            </div>

            <style jsx>{`
                .empty-state {
                    text-align: center;
                    padding: 40px 20px;
                }

                .badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .badge-success {
                    background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
                    color: #155724;
                }

                .badge-warning {
                    background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
                    color: #856404;
                }

                .order-table {
                    width: 100%;
                    margin-bottom: 20px;
                }

                .order-table th {
                    background: #f8f9fa;
                    padding: 12px;
                    font-weight: 600;
                    border-bottom: 2px solid #dee2e6;
                }

                .order-table td {
                    padding: 16px 12px;
                    border-bottom: 1px solid #dee2e6;
                    vertical-align: middle;
                }

                .card-address {
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    height: 100%;
                }

                .card-address:hover {
                    border-color: #667eea;
                    box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
                }

                .card-address .card-body {
                    padding: 24px;
                }

                .card-address .card-title {
                    font-size: 14px;
                    font-weight: 700;
                    color: #667eea;
                    margin-bottom: 16px;
                }

                .form-control:disabled {
                    background-color: #f5f5f5;
                    cursor: not-allowed;
                }

                .alert {
                    padding: 12px 16px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }

                .alert-success {
                    background: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }

                .alert-danger {
                    background: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }

                @media (max-width: 768px) {
                    .order-table {
                        font-size: 14px;
                    }

                    .order-table th,
                    .order-table td {
                        padding: 10px 8px;
                    }
                }
            `}</style>
        </main >
    )
}

export default React.memo(Account);