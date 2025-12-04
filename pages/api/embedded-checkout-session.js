import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('Creating embedded checkout session with body:', req.body)
    const { amount, customer, type, plan, period } = req.body

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' })
    }

    // Check if this is a subscription
    const isSubscription = type === 'subscription'

    // Base session configuration
    let sessionConfig = {
      ui_mode: 'embedded',
      return_url: (isSubscription)?
                    `${req.headers.origin}/pages/subscription-success?session_id={CHECKOUT_SESSION_ID}`
                   :`${req.headers.origin}/pages/return?session_id={CHECKOUT_SESSION_ID}`,
    }

    // Add customer email if provided
    if (customer && customer.email) {
      sessionConfig.customer_email = customer.email
    }

    // Add metadata if customer data exists
    if (customer) {
      sessionConfig.metadata = {
        customerFirstName: customer.firstName || '',
        customerLastName: customer.lastName || '',
        customerPhone: customer.phone || '',
        shippingAddress: customer.address?.street || '',
        shippingCity: customer.address?.city || '',
        shippingState: customer.address?.state || '',
        shippingZip: customer.address?.zipCode || '',
        shippingCountry: customer.address?.country || '',
      }
    }

    if (isSubscription) {
      // Subscription mode for Aurora Pro
      console.log('Creating subscription checkout with plan:', plan, 'period:', period)
      
      sessionConfig.mode = 'subscription'
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: plan === 'annual' ? 'Aurora Pro - Annual Plan' : 'Aurora Pro - Monthly Plan',
              description: plan === 'annual' 
                ? 'Annual subscription (Save 17%) - Free shipping, AI Virtual Try-On, AI Fashion Chatbot, Priority Support, Early Sale Access' 
                : 'Monthly subscription - Free shipping, AI Virtual Try-On, AI Fashion Chatbot, Priority Support, Early Sale Access',
            },
            unit_amount: Math.round(parseFloat(amount) * 100),
            recurring: {
              interval: period === 'year' ? 'year' : 'month',
              interval_count: 1
            },
          },
          quantity: 1,
        }
      ]
      
      sessionConfig.subscription_data = {
        metadata: {
          subscriptionType: 'aurora_pro',
          plan: plan || 'monthly',
          period: period || 'month',
        },
      }

      // Merge subscription metadata into top-level session metadata (Stripe allows both)
      if (!sessionConfig.metadata) {
        sessionConfig.metadata = {};
      }
      sessionConfig.metadata.subscriptionType = 'aurora_pro';
      sessionConfig.metadata.plan = plan || 'monthly';
      sessionConfig.metadata.period = period || 'month';

    } else {
      // One-time payment mode for regular purchases
      console.log('Creating one-time payment checkout')
      
      sessionConfig.mode = 'payment'
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'Order Total',
            },
            unit_amount: Math.round(parseFloat(amount) * 100),
          },
          quantity: 1,
        }
      ]
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig)

    console.log('Checkout session created successfully:', session.id)
    res.status(200).json({ client_secret: session.client_secret })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ error: error.message })
  }
}