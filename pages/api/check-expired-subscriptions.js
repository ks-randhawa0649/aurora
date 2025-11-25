import { query } from '../../lib/database';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Optional: Add authentication to prevent unauthorized access
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Find all users with expired subscriptions
        const expiredUsersQuery = `
            SELECT u.email, u.proValid, c.customer_id
            FROM users u
            JOIN customers c ON u.email = c.email
            WHERE u.isPro = 1 AND u.proValid < NOW()
        `;
        
        const expiredUsers = await query(expiredUsersQuery);

        if (!expiredUsers || expiredUsers.length === 0) {
            return res.status(200).json({ 
                success: true, 
                message: 'No expired subscriptions found',
                count: 0 
            });
        }

        // Update users to non-pro status
        const updateUsersQuery = `
            UPDATE users 
            SET isPro = 0, proPlan = NULL 
            WHERE isPro = 1 AND proValid < NOW()
        `;
        
        await query(updateUsersQuery);

        // Update subscriptions status to expired
        const customerIds = expiredUsers.map(u => u.customer_id);
        const placeholders = customerIds.map(() => '?').join(',');
        
        const updateSubscriptionsQuery = `
            UPDATE subscriptions 
            SET status = 'expired' 
            WHERE customer_id IN (${placeholders}) 
            AND status IN ('active', 'canceling')
        `;
        
        await query(updateSubscriptionsQuery, customerIds);

        console.log('[check-expired-subscriptions] Expired subscriptions:', expiredUsers.length);

        res.status(200).json({
            success: true,
            message: `${expiredUsers.length} subscriptions expired`,
            count: expiredUsers.length,
            users: expiredUsers.map(u => u.email)
        });

    } catch (error) {
        console.error('Error checking expired subscriptions:', error);
        res.status(500).json({ error: 'Failed to check expired subscriptions: ' + error.message });
    }
}