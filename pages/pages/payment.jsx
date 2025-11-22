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