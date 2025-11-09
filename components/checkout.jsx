import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const fetchClientSecret = async () => {
  const res = await fetch('/api/embedded-checkout-session', { method: 'POST' })
  if (!res.ok) throw new Error('Failed to create session')
  const { client_secret } = await res.json()
  return client_secret
}

export default function Checkout() {
  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}