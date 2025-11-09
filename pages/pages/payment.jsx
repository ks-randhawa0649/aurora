import Checkout from '~/components/checkout'

export default function Payment() {
  return (
    <div id="checkout" className="checkout-spacing">
      <Checkout />
      <style jsx global>{`
        .header-bottom {
          display: none !important;
        }
        .checkout-spacing {
          margin-top: 70px; /* space before checkout */,
        }
      `}</style>
    </div>
  )
}