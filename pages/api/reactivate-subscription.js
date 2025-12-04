import { query } from '../../lib/database';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Get customer_id
        const customerQuery = `SELECT customer_id FROM customers WHERE email = ?`;
        const customers = await query(customerQuery, [email]);
        
        if (!customers || customers.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const customerId = customers[0].customer_id;

        // Get Stripe subscription ID
        const subscriptionQuery = `
            SELECT stripe_subscription_id, subscription_id 
            FROM subscriptions 
            WHERE customer_id = ? AND status = 'canceling'
            ORDER BY current_period_end DESC
            LIMIT 1
        `;
        
        const subscriptions = await query(subscriptionQuery, [customerId]);

        if (subscriptions && subscriptions.length > 0 && subscriptions[0].stripe_subscription_id) {
            try {
                // Reactivate Stripe subscription
                await stripe.subscriptions.update(subscriptions[0].stripe_subscription_id, {
                    cancel_at_period_end: false
                });
                console.log('[reactivate-subscription] Stripe subscription reactivated:', subscriptions[0].stripe_subscription_id);
            } catch (stripeError) {
                console.error('Stripe reactivation error:', stripeError);
                return res.status(500).json({ error: 'Failed to reactivate Stripe subscription' });
            }

            // Update subscription status back to active
            await query(
                `UPDATE subscriptions 
                SET status = 'active' 
                WHERE subscription_id = ?`,
                [subscriptions[0].subscription_id]
            );
        }

        console.log('[reactivate-subscription] Subscription reactivated for:', email);

        res.status(200).json({
            success: true,
            message: 'Subscription reactivated successfully'
        });

    } catch (error) {
        console.error('Error reactivating subscription:', error);
        res.status(500).json({ error: 'Failed to reactivate subscription: ' + error.message });
    }
}