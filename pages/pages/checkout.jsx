import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';

import ALink from '~/components/features/custom-link';
import Card from '~/components/features/accordion/card';

import { cartActions } from '~/store/cart';
import { toDecimal } from '~/utils';
import { UserContext } from '../_app';

function Checkout( props ) {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const { cartList } = props;

    useEffect(() => {
        // Check authentication
        if (!user && !loading) {
            // Save current path to redirect back after login
            sessionStorage.setItem('redirectAfterLogin', '/pages/checkout');
            router.push('/pages/login');
        } else {
            setLoading(false);
        }
    }, [user, loading, router]);

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
        <div className="main checkout">
            <Helmet>
                <title>Aurora | Checkout</title>
            </Helmet>

            <h1 className="d-none">Aurora - Checkout</h1>

            <nav className="breadcrumb-nav">
                <div className="container">
                    <ul className="breadcrumb shop-breadcrumb">
                        <li className="passed"><ALink href="/pages/cart"><i className="d-icon-bag"></i>Shopping Cart</ALink></li>
                        <li className="active"><ALink href="/pages/checkout"><i className="d-icon-arrow-right"></i>Checkout</ALink></li>
                        <li><ALink href="/pages/order"><i className="d-icon-arrow-right"></i>Order Complete</ALink></li>
                    </ul>
                </div>
            </nav>

            <div className="page-content pt-7 pb-10 mb-10">
                <div className="step-by pr-4 pl-4">
                    <h3 className="title title-simple title-step active"><ALink href="#">2. Checkout</ALink></h3>
                </div>

                <div className="container mt-8">
                    <div className="card accordion">
                        <Card title="
                            <div class='alert alert-light alert-primary alert-icon mb-4 card-header'>
                                <i class='fas fa-exclamation-circle'></i>
                                <span class='text-body'>Have a coupon?</span>
                                <a href='#' class='text-primary'>Click here to enter your code</a>
                            </div>" type="parse">

                            <div className="alert-body mb-4 collapsed">
                                <p>If you have a coupon code, please apply it below.</p>
                                <form className="check-coupon-box d-flex">
                                    <input type="text" name="coupon_code" className="input-text form-control text-grey ls-m mr-4"
                                        id="coupon_code" placeholder="Coupon code" />
                                    <button type="submit" className="btn btn-dark btn-rounded btn-outline">Apply Coupon</button>
                                </form>
                            </div>
                        </Card>
                    </div>

                    <form action="#" className="form">
                        <div className="row">
                            <div className="col-lg-7 mb-6 mb-lg-0 pr-lg-4">
                                <h3 className="title title-simple text-left text-uppercase">Billing Details</h3>

                                <div className="row">
                                    <div className="col-xs-6">
                                        <label>First Name *</label>
                                        <input type="text" className="form-control" name="first-name" required />
                                    </div>
                                    <div className="col-xs-6">
                                        <label>Last Name *</label>
                                        <input type="text" className="form-control" name="last-name" required />
                                    </div>
                                </div>

                                <label>Company Name (Optional)</label>
                                <input type="text" className="form-control" name="company-name" />

                                <label>Country / Region *</label>
                                <div className="select-box">
                                    <select name="country" className="form-control">
                                        <option value="us" defaultValue>United States (US)</option>
                                        <option value="uk">United Kingdom</option>
                                        <option value="ca">Canada</option>
                                        <option value="au">Australia</option>
                                    </select>
                                </div>

                                <label>Street Address *</label>
                                <input type="text" className="form-control" name="address1" required placeholder="House number and street name" />
                                <input type="text" className="form-control" name="address2" required placeholder="Apartment, suite, unit, etc. (optional)" />

                                <div className="row">
                                    <div className="col-xs-6">
                                        <label>Town / City *</label>
                                        <input type="text" className="form-control" name="city" required />
                                    </div>
                                    <div className="col-xs-6">
                                        <label>State *</label>
                                        <input type="text" className="form-control" name="state" required />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-xs-6">
                                        <label>ZIP *</label>
                                        <input type="text" className="form-control" name="zip" required />
                                    </div>
                                    <div className="col-xs-6">
                                        <label>Phone *</label>
                                        <input type="text" className="form-control" name="phone" required />
                                    </div>
                                </div>

                                <label>Email Address *</label>
                                <input type="email" className="form-control" name="email-address" required defaultValue={user?.email || ''} />

                                <h2 className="title title-simple text-uppercase text-left">Additional Information</h2>
                                <label>Order Notes (Optional)</label>
                                <textarea className="form-control pb-2 pt-2 mb-0" cols="30" rows="5" placeholder="Notes about your order, e.g. special notes for delivery"></textarea>
                            </div>
                            <aside className="col-lg-5 sticky-sidebar-wrapper">
                                <div className="sticky-sidebar mt-1" data-sticky-options="{'bottom': 50}">
                                    <div className="summary pt-5">
                                        <h3 className="title title-simple text-left text-uppercase">Your Order</h3>
                                        <table className="order-table">
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    cartList.map( ( item, index ) => (
                                                        <tr key={ 'checkout-item-' + index }>
                                                            <td className="product-name">{ item.name } <span className="product-quantity">×&nbsp;{ item.qty }</span></td>
                                                            <td className="product-total text-body">${ toDecimal( item.qty * item.price ) }</td>
                                                        </tr>
                                                    ) )
                                                }

                                                <tr className="summary-subtotal">
                                                    <td>
                                                        <h4 className="summary-subtitle">Subtotal</h4>
                                                    </td>
                                                    <td className="summary-subtotal-price pb-0 pt-0">${ toDecimal( cartList.reduce( ( acc, item ) => {
                                                        return acc + item.price * item.qty;
                                                    }, 0 ) ) }
                                                    </td>
                                                </tr>
                                                <tr className="summary-shipping shipping-row-last">
                                                    <td>
                                                        <h4 className="summary-subtitle pb-2 pt-4">Shipping</h4>
                                                    </td>
                                                            <td className="summary-subtotal-price pb-0 pt-0">$4.99</td>

                                                            {/* <li>
                                                                <div className="custom-radio">
                                                                    <input type="radio" id="free-shipping" name="shipping" className="custom-control-input" />
                                                                    <label className="custom-control-label" htmlFor="free-shipping">Free shipping</label>
                                                                </div>
                                                            </li>

                                                            <li>
                                                                <div className="custom-radio">
                                                                    <input type="radio" id="local_pickup" name="shipping" className="custom-control-input" />
                                                                    <label className="custom-control-label" htmlFor="local_pickup">Local pickup</label>
                                                                </div>
                                                            </li> */}
                                                </tr>
                                                <tr className="summary-total">
                                                    <td className="pb-0">
                                                        <h4 className="summary-subtitle">Total</h4>
                                                    </td>
                                                    <td className=" pt-0 pb-0">
                                                        <p className="summary-total-price ls-s text-primary">${ toDecimal( cartList.reduce( ( acc, item ) => {
                                                            return acc + item.price * item.qty;
                                                        }, 0 ) ) }</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        {/* <div className="payment accordion radio-type">
                                            <h4 className="summary-subtitle ls-m pb-3">Payment Methods</h4>

                                            <div className="card">
                                                <div className="card-header">
                                                    <a href="#collapse1" className="expand">Direct bank transfer</a>
                                                </div>
                                                <div id="collapse1" className="expanded" style={ { display: 'block' } }>
                                                    <div className="card-body ls-m">
                                                        Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card p-relative">
                                                <div className="card-header">
                                                    <a href="#collapse2" className="collapse">Check payments</a>
                                                </div>
                                                <div id="collapse2" className="collapsed">
                                                    <div className="card-body ls-m">
                                                        Please send a check to Store Name, Store Street, Store Town, Store State / County, Store Postcode.
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card p-relative">
                                                <div className="card-header">
                                                    <a href="#collapse3" className="collapse">Cash on delivery</a>
                                                </div>
                                                <div id="collapse3" className="collapsed">
                                                    <div className="card-body ls-m">
                                                        Pay with cash upon delivery.
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="card p-relative">
                                                <div className="card-header">
                                                    <a href="#collapse4" className="collapse">PayPal</a>
                                                </div>
                                                <div id="collapse4" className="collapsed">
                                                    <div className="card-body ls-m">
                                                        Pay via PayPal; you can pay with your credit card if you don't have a PayPal account.
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}

                                        <div className="form-checkbox mt-4 mb-5">
                                            <input type="checkbox" className="custom-checkbox" id="terms-condition" name="terms-condition" />
                                            <label className="form-control-label" htmlFor="terms-condition">
                                                I have read and agree to the website <a href="#">terms and conditions </a>*
                                            </label>
                                        </div>

                                        <button type="submit" className="btn btn-dark btn-rounded btn-order">Place Order</button>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

function mapStateToProps( state ) {
    return {
        cartList: state.cart.data ? state.cart.data : []
    }
}

export default connect( mapStateToProps, { removeFromCart: cartActions.removeFromCart } )( Checkout );