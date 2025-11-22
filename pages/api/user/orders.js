import { query } from '../../../lib/database';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const user = await getUserFromRequest(req);
        console.log('[orders API] Retrieved user from request:', user); 
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // console.log('[orders API] User email:', user.email);

        // Get customer_id from email
        const customerQuery = `SELECT customer_id, email, full_name FROM customers WHERE email = ?`;
        const customerResult = await query(customerQuery, [user.email]);

        console.log('[orders API] Customer query result:', customerResult);

        // If no customer found with exact email, try to get all customers to debug
        if (!customerResult || customerResult.length === 0) {
            const allCustomers = await query(`SELECT email FROM customers LIMIT 5`);
            console.log('[orders API] Sample customer emails in DB:', allCustomers);
            
            // Also check if there are any orders at all
            const allOrders = await query(`SELECT COUNT(*) as count FROM orders`);
            console.log('[orders API] Total orders in DB:', allOrders);
            
            return res.status(200).json({ 
                orders: [], 
                debug: {
                    userEmail: user.email,
                    sampleCustomers: allCustomers.map(c => c.email),
                    totalOrders: allOrders[0]?.count || 0
                }
            });
        }

        const customerId = customerResult[0].customer_id;
        console.log('[orders API] Found customer_id:', customerId);

        // Get orders with items
        const ordersQuery = `
            SELECT 
                o.order_id,
                o.placed_at,
                o.status,
                o.total_amount,
                o.currency,
                COUNT(oi.variant_id) as item_count
            FROM orders o
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            WHERE o.customer_id = ?
            GROUP BY o.order_id, o.placed_at, o.status, o.total_amount, o.currency
            ORDER BY o.placed_at DESC
        `;

        const orders = await query(ordersQuery, [customerId]);
        
        console.log('[orders API] Found orders count:', orders.length);
        console.log('[orders API] Orders data:', orders);
        
        // Format orders for display
        const formattedOrders = orders.map(order => ({
            id: order.order_id,
            orderNumber: `#${order.order_id.substring(0, 8).toUpperCase()}`,
            date: new Date(order.placed_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            status: order.status,
            total: `$${parseFloat(order.total_amount).toFixed(2)}`,
            itemCount: order.item_count,
            currency: order.currency
        }));

        res.status(200).json({ orders: formattedOrders });

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
}
