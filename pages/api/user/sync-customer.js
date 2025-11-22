import { query } from '../../../lib/database';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const user = await getUserFromRequest(req);
        
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Check if customer already exists with this email
        const existingCustomer = await query(
            `SELECT customer_id, email, full_name FROM customers WHERE email = ?`,
            [user.email]
        );

        if (existingCustomer.length > 0) {
            return res.status(200).json({
                success: true,
                message: 'Customer already exists',
                customer: existingCustomer[0]
            });
        }

        // Generate UUID for customer
        const customerId = generateUUID();

        // Create customer record
        const customerQuery = `
            INSERT INTO customers (customer_id, email, full_name, created_at)
            VALUES (?, ?, ?, NOW())
        `;

        await query(customerQuery, [
            customerId,
            user.email,
            user.username || user.email.split('@')[0]
        ]);

        const newCustomer = await query(
            `SELECT customer_id, email, full_name FROM customers WHERE customer_id = ?`,
            [customerId]
        );

        return res.status(201).json({
            success: true,
            message: 'Customer record created successfully',
            customer: newCustomer[0]
        });

    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ error: 'Failed to create customer: ' + error.message });
    }
}

// Helper function to generate UUID v4
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
