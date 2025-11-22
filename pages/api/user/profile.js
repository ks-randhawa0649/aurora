import { query } from '../../../lib/database';
import { getUserFromRequest } from '../../../lib/auth';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        return handleGet(req, res);
    } else if (req.method === 'PUT') {
        return handleUpdate(req, res);
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}

async function handleGet(req, res) {
    try {
        const user = await getUserFromRequest(req);
        
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Get customer details
        const customerQuery = `SELECT * FROM customers WHERE email = ?`;
        const customerResult = await query(customerQuery, [user.email]);

        if (!customerResult || customerResult.length === 0) {
            return res.status(200).json({ 
                profile: {
                    email: user.email,
                    username: user.username,
                    fullName: '',
                    addresses: []
                }
            });
        }

        const customer = customerResult[0];

        // Get addresses
        const addressQuery = `SELECT * FROM addresses WHERE customer_id = ?`;
        const addresses = await query(addressQuery, [customer.customer_id]);

        res.status(200).json({ 
            profile: {
                customerId: customer.customer_id,
                email: customer.email,
                username: user.username,
                fullName: customer.full_name || '',
                createdAt: customer.created_at,
                addresses: addresses.map(addr => ({
                    id: addr.address_id,
                    kind: addr.kind,
                    line1: addr.line1,
                    line2: addr.line2,
                    city: addr.city,
                    region: addr.region,
                    postalCode: addr.postal_code,
                    country: addr.country
                }))
            }
        });

    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
}

async function handleUpdate(req, res) {
    try {
        const user = await getUserFromRequest(req);
        
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { fullName, addresses } = req.body;

        // Update customer details
        const customerQuery = `SELECT customer_id FROM customers WHERE email = ?`;
        const customerResult = await query(customerQuery, [user.email]);

        if (!customerResult || customerResult.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const customerId = customerResult[0].customer_id;

        // Update full name
        if (fullName) {
            const updateQuery = `UPDATE customers SET full_name = ? WHERE customer_id = ?`;
            await query(updateQuery, [fullName, customerId]);
        }

        res.status(200).json({ 
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
}
