// Google Analytics utility functions

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-W5KNTMNL25';

// Track page views
export const pageview = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({ action, category, label, value }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track subscription events
export const trackSubscription = ({ plan, period, amount, status }) => {
  event({
    action: 'subscription',
    category: 'Subscription',
    label: `${plan} - ${period} - ${status}`,
    value: amount,
  });
};

// Track purchases (for ecommerce)
export const trackPurchase = ({ transactionId, value, currency, items }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency || 'USD',
      items: items,
    });
  }
};

// Track signup/login
export const trackSignup = (method) => {
  event({
    action: 'sign_up',
    category: 'User',
    label: method,
  });
};

// Track subscription actions
export const trackCancelSubscription = (plan) => {
  event({
    action: 'cancel_subscription',
    category: 'Subscription',
    label: plan,
  });
};

export const trackReactivateSubscription = (plan) => {
  event({
    action: 'reactivate_subscription',
    category: 'Subscription',
    label: plan,
  });
};

export const trackUpgradeSubscription = (fromPlan, toPlan) => {
  event({
    action: 'upgrade_subscription',
    category: 'Subscription',
    label: `${fromPlan} to ${toPlan}`,
  });
};

// Track checkout steps
export const trackBeginCheckout = ({ plan, amount, period }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: amount,
      items: [{
        item_id: plan,
        item_name: `Aurora Pro - ${plan}`,
        item_category: 'Subscription',
        price: amount,
        quantity: 1,
      }],
    });
  }
};

// Track feature usage
export const trackFeatureUsage = (featureName) => {
  event({
    action: 'use_feature',
    category: 'Features',
    label: featureName,
  });
};
