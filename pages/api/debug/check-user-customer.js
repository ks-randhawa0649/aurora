import { query } from '../../../lib/database';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
    try {
        const user = await getUserFromRequest(req);
        
        if (!user) {
            return res.status(200).json({ 
                authenticated: false,
                message: 'No user logged in'
            });
        }

        // Get all customers
        const customers = await query(`SELECT customer_id, email, full_name FROM customers LIMIT 20`);
        
        // Get all orders count
        const ordersCount = await query(`SELECT COUNT(*) as count FROM orders`);
        
        // Check if customer exists with this email
        const matchingCustomer = await query(
            `SELECT customer_id, email, full_name FROM customers WHERE email = ?`,
            [user.email]
        );

        // Get orders for all customers (to see if there are any)
        const sampleOrders = await query(`
            SELECT o.order_id, o.customer_id, c.email 
            FROM orders o 
            LEFT JOIN customers c ON o.customer_id = c.customer_id 
            LIMIT 10
        `);

        return res.status(200).json({
            authenticated: true,
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            },
            customers: customers,
            totalOrders: ordersCount[0]?.count || 0,
            matchingCustomer: matchingCustomer.length > 0 ? matchingCustomer[0] : null,
            sampleOrders: sampleOrders,
            suggestion: matchingCustomer.length === 0 
                ? 'User email does not match any customer email. You may need to create a customer record or link existing customer.'
                : 'Customer found! Orders should display.'
        });

    } catch (error) {
        console.error('Debug API error:', error);
        res.status(500).json({ error: error.message });
    }
}
