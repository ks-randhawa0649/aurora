import Checkout from '~/components/checkout'
import SubscriptionCheckout from '~/components/subscription-checkout';
import { useRouter } from 'next/router';
import React from 'react';

export default function Payment() {
  const router = useRouter();
  const { type } = router.query;
  const isSubscription = type === 'subscription';
  return (
    <div id="checkout" className="checkout-spacing">
      {isSubscription ? <SubscriptionCheckout /> : <Checkout />}
      <style jsx global>{`
        .header-bottom {
          display: none !important;
        }
        .checkout-spacing {
          margin-top: 0px; /* space before checkout */,
          display: flex;
      justify-content: center;
      align-items: center;
      width: 100%
        }
      `}</style>
    </div>
  )
}