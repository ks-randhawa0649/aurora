import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  try {
    const origin = req.headers.origin || `http://${req.headers.host}`
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
    line_items: [
    {
      price_data: {
        currency: 'usd',
        product_data: { name: 'Example item' },
        // amount in cents
        unit_amount: 100
      },
      quantity: 1
    }
  ],
      mode: 'payment',
      return_url: `${origin}/pages/return?session_id={CHECKOUT_SESSION_ID}`,
      payment_method_types: ['card'],
    })
    return res.status(200).json({ client_secret: session.client_secret })
  } catch (err) {
    console.error('[stripe] create session error', err)
    return res.status(500).json({ error: 'stripe error' })
  }
}