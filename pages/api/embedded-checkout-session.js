import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { amount, customer } = req.body

    if (!amount || !customer) {
      return res.status(400).json({ error: 'Amount and customer data are required' })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'Order Total',
            },
            unit_amount: Math.round(parseFloat(amount) * 100), // Convert to cents
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      customer_email: customer.email,
      metadata: {
        customerFirstName: customer.firstName,
        customerLastName: customer.lastName,
        customerPhone: customer.phone,
        shippingAddress: customer.address.street,
        shippingCity: customer.address.city,
        shippingState: customer.address.state,
        shippingZip: customer.address.zipCode,
        shippingCountry: customer.address.country,
      },
      return_url: `${req.headers.origin}/pages/return?session_id={CHECKOUT_SESSION_ID}`,
    })

    res.status(200).json({ client_secret: session.client_secret })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ error: error.message })
  }
}