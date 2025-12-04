import { query } from '../../lib/database';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Get user subscription data from users table
        const userQuery = `
            SELECT id, email, username, isPro, proPlan, proValid, created_at 
            FROM users 
            WHERE email = ?
        `;
        
        const users = await query(userQuery, [email]);

        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];

        console.log('[get-subscription] User data:', {
            email: user.email,
            isPro: user.isPro,
            proPlan: user.proPlan,
            proValid: user.proValid,
            proValidType: typeof user.proValid,
            created_at: user.created_at
        });

        // Get customer data
        const customerQuery = `SELECT customer_id FROM customers WHERE email = ?`;
        const customers = await query(customerQuery, [email]);
        
        if (!customers || customers.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const customerId = customers[0].customer_id;

        // Get subscription details from subscriptions table
        const subscriptionQuery = `
            SELECT s.subscription_id, s.stripe_subscription_id, s.status, s.current_period_end,
                   p.code, p.price, p.\`interval\`
            FROM subscriptions s
            JOIN plans p ON s.plan_id = p.plan_id
            WHERE s.customer_id = ?
            ORDER BY s.current_period_end DESC
            LIMIT 1
        `;
        
        const subscriptions = await query(subscriptionQuery, [customerId]);

        // Parse dates properly with validation
        const parseDate = (dateValue) => {
            if (!dateValue) {
                console.log('[get-subscription] Date value is null/undefined');
                return null;
            }
            
            // If it's already a Date object
            if (dateValue instanceof Date) {
                if (isNaN(dateValue.getTime())) {
                    console.error('[get-subscription] Invalid Date object:', dateValue);
                    return null;
                }
                return dateValue;
            }
            
            // If it's a string or timestamp
            const parsed = new Date(dateValue);
            
            // Check if valid date
            if (isNaN(parsed.getTime())) {
                console.error('[get-subscription] Could not parse date:', dateValue);
                return null;
            }
            
            return parsed;
        };

        const proValidDate = parseDate(user.proValid);
        const createdAtDate = parseDate(user.created_at);
        const now = new Date();

        console.log('[get-subscription] Parsed dates:', {
            proValid_raw: user.proValid,
            proValidDate: proValidDate ? proValidDate.toISOString() : 'INVALID',
            createdAt_raw: user.created_at,
            createdAtDate: createdAtDate ? createdAtDate.toISOString() : 'INVALID',
            now: now.toISOString()
        });

        // Check if subscription is still valid
        const isValid = user.isPro === 1 && proValidDate && proValidDate > now;

        console.log('[get-subscription] Validity check:', {
            isPro: user.isPro,
            hasProValidDate: !!proValidDate,
            isAfterNow: proValidDate ? proValidDate > now : false,
            isValid
        });

        // Get Stripe subscription details if available
        let stripeData = null;
        let cancelAtPeriodEnd = false;
        let currentPeriodEnd = proValidDate;

        if (subscriptions && subscriptions.length > 0 && subscriptions[0].stripe_subscription_id) {
            try {
                const stripeSubscription = await stripe.subscriptions.retrieve(
                    subscriptions[0].stripe_subscription_id
                );
                
                const stripePeriodEnd = proValidDate;
                
                stripeData = {
                    stripeSubscriptionId: stripeSubscription.id,
                    stripeStatus: stripeSubscription.status,
                    currentPeriodEnd: stripePeriodEnd,
                    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end
                };
                
                cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end;
                
                // Only use Stripe date if it's valid
                if (!isNaN(stripePeriodEnd.getTime())) {
                    currentPeriodEnd = stripePeriodEnd;
                }
                
                console.log('[get-subscription] Stripe data:', stripeData);
            } catch (stripeError) {
                console.error('[get-subscription] Stripe error:', stripeError.message);
            }
        }

        // Get usage stats
        const usageQuery = `
            SELECT 
                (SELECT COUNT(*) FROM orders WHERE customer_id = ? AND status = 'shipped') as orders_count
        `;
        const usageData = await query(usageQuery, [customerId]);

        // Calculate start date based on plan type
        let startDate = createdAtDate;
        
        if (currentPeriodEnd && user.proPlan) {
            const tempDate = new Date(currentPeriodEnd);
            
            if (!isNaN(tempDate.getTime())) {
                if (user.proPlan === 'M') {
                    tempDate.setMonth(tempDate.getMonth() - 1);
                } else if (user.proPlan === 'A') {
                    tempDate.setFullYear(tempDate.getFullYear() - 1);
                }
                
                if (!isNaN(tempDate.getTime())) {
                    startDate = tempDate;
                }
            }
        }

        console.log('[get-subscription] Final dates:', {
            startDate: startDate ? startDate.toISOString() : 'INVALID',
            currentPeriodEnd: currentPeriodEnd ? (isNaN(currentPeriodEnd.getTime()) ? 'INVALID' : currentPeriodEnd.toISOString()) : 'NULL'
        });

        // Prepare response - safely convert dates
        const subscriptionData = {
            id: subscriptions && subscriptions.length > 0 ? subscriptions[0].subscription_id : null,
            status: isValid ? (cancelAtPeriodEnd ? 'canceling' : 'active') : 'expired',
            plan: user.proPlan === 'M' ? 'monthly' : user.proPlan === 'A' ? 'annual' : null,
            amount: user.proPlan === 'M' ? '9.99' : user.proPlan === 'A' ? '99.99' : '0.00',
            period: user.proPlan === 'M' ? 'month' : user.proPlan === 'A' ? 'year' : null,
            currentPeriodStart: startDate && !isNaN(startDate.getTime()) ? startDate.toISOString() : null,
            currentPeriodEnd: currentPeriodEnd && !isNaN(currentPeriodEnd.getTime()) ? currentPeriodEnd.toISOString() : null,
            cancelAtPeriodEnd: cancelAtPeriodEnd,
            paymentMethod: {
                brand: 'visa',
                last4: '****',
                expMonth: 12,
                expYear: 2025
            },
            usage: {
                freeShipping: usageData && usageData.length > 0 ? usageData[0].orders_count : 0,
                aiTryOns: 0,
                chatMessages: 0,
                rewardPoints: 0
            },
            ...stripeData
        };

        console.log('[get-subscription] Final subscription data:', subscriptionData);

        res.status(200).json(subscriptionData);

    } catch (error) {
        console.error('[get-subscription] Database error:', error);
        res.status(500).json({ error: 'Failed to fetch subscription: ' + error.message });
    }
}