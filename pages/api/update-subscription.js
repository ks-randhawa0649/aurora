import { query } from '../../lib/database';

// Helper function to generate UUID v4
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, plan, session_id, stripe_subscription_id } = req.body;

    if (!email || !plan || !session_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Calculate proValid date (30 days for monthly, 365 days for annual)
        const validityDays = plan === 'monthly' ? 30 : 365;
        const proValidDate = new Date();
        proValidDate.setDate(proValidDate.getDate() + validityDays);

        // Convert date to MySQL datetime format
        const proValidFormatted = proValidDate.toISOString().slice(0, 19).replace('T', ' ');
        const currentPeriodEnd = proValidDate.toISOString().slice(0, 19).replace('T', ' ');

        // Update user subscription details in users table
        const updateUserQuery = `
            UPDATE users 
            SET isPro = 1, 
                proPlan = ?, 
                proValid = ? 
            WHERE email = ?
        `;
        
        const result = await query(updateUserQuery, [
            plan === 'monthly' ? 'M' : 'A', 
            proValidFormatted, 
            email
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get customer_id from customers table or create if doesn't exist
        let customerQuery = `SELECT customer_id FROM customers WHERE email = ?`;
        let customers = await query(customerQuery, [email]);
        
        let customerId;
        if (!customers || customers.length === 0) {
            // Create customer if doesn't exist
            customerId = generateUUID();
            const getUserQuery = `SELECT username FROM users WHERE email = ?`;
            const users = await query(getUserQuery, [email]);
            const fullName = users && users.length > 0 ? users[0].username : email.split('@')[0];
            
            await query(
                `INSERT INTO customers (customer_id, email, full_name) VALUES (?, ?, ?)`,
                [customerId, email, fullName]
            );
        } else {
            customerId = customers[0].customer_id;
        }

        // Get or create plan
        const planCode = plan === 'monthly' ? 'aurora-pro-monthly' : 'aurora-pro-annual';
        const planPrice = plan === 'monthly' ? 9.99 : 99.99;
        const planInterval = plan === 'monthly' ? 'month' : 'year';

        let planQuery = `SELECT plan_id FROM plans WHERE code = ?`;
        let plans = await query(planQuery, [planCode]);
        
        let planId;
        if (!plans || plans.length === 0) {
            planId = generateUUID();
            await query(
                `INSERT INTO plans (plan_id, code, price, \`interval\`) VALUES (?, ?, ?, ?)`,
                [planId, planCode, planPrice, planInterval]
            );
        } else {
            planId = plans[0].plan_id;
        }

        // Insert or update subscription in subscriptions table
        const subscriptionId = generateUUID();
        
        // Check if subscription already exists for this customer
        const existingSubQuery = `
            SELECT subscription_id FROM subscriptions 
            WHERE customer_id = ? AND status IN ('active', 'trialing')
        `;
        const existingSubs = await query(existingSubQuery, [customerId]);

        if (existingSubs && existingSubs.length > 0) {
            // Update existing subscription
            await query(
                `UPDATE subscriptions 
                SET plan_id = ?, 
                    stripe_subscription_id = ?,
                    status = 'active',
                    current_period_end = ?
                WHERE subscription_id = ?`,
                [planId, stripe_subscription_id, currentPeriodEnd, existingSubs[0].subscription_id]
            );
        } else {
            // Create new subscription
            await query(
                `INSERT INTO subscriptions 
                (subscription_id, customer_id, plan_id, provider, stripe_subscription_id, status, current_period_end) 
                VALUES (?, ?, ?, 'stripe', ?, 'active', ?)`,
                [subscriptionId, customerId, planId, stripe_subscription_id, currentPeriodEnd]
            );
        }

        console.log('[update-subscription] Subscription updated for:', email);

        res.status(200).json({
            success: true,
            message: 'Subscription updated successfully',
            proValid: proValidFormatted,
            customerId: customerId,
            subscriptionId: existingSubs && existingSubs.length > 0 ? existingSubs[0].subscription_id : subscriptionId
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to update subscription: ' + error.message });
    }
}