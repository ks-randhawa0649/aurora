import { query } from '../../lib/database';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, subscriptionId } = req.body;

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
            WHERE customer_id = ? AND status = 'active'
            ORDER BY current_period_end DESC
            LIMIT 1
        `;
        
        const subscriptions = await query(subscriptionQuery, [customerId]);

        if (subscriptions && subscriptions.length > 0 && subscriptions[0].stripe_subscription_id) {
            try {
                // Cancel Stripe subscription at period end
                await stripe.subscriptions.update(subscriptions[0].stripe_subscription_id, {
                    cancel_at_period_end: true
                });
                console.log('[cancel-subscription] Stripe subscription canceled:', subscriptions[0].stripe_subscription_id);
            } catch (stripeError) {
                console.error('Stripe cancellation error:', stripeError);
                return res.status(500).json({ error: 'Failed to cancel Stripe subscription' });
            }

            // Update subscription status to 'canceling' (we'll keep it active until period ends)
            await query(
                `UPDATE subscriptions 
                SET status = 'canceling' 
                WHERE subscription_id = ?`,
                [subscriptions[0].subscription_id]
            );
        }

        console.log('[cancel-subscription] Subscription marked as canceling for:', email);

        // Note: isPro remains 1 until proValid expires

        res.status(200).json({
            success: true,
            message: 'Subscription will be canceled at the end of billing period'
        });

    } catch (error) {
        console.error('Error canceling subscription:', error);
        res.status(500).json({ error: 'Failed to cancel subscription: ' + error.message });
    }
}