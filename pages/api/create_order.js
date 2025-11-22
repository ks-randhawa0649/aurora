import { query } from '../../lib/database';
import { getUserFromRequest } from '../../lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { customer, items, pricing, notes, payment } = req.body;

        // Get logged-in user
        const user = await getUserFromRequest(req);
        
        // Use logged-in user's email if available, otherwise fall back to customer.email
        const emailToUse = user?.email || customer.email;
        
        console.log('[create_order] Using email:', emailToUse, 'from', user ? 'logged-in user' : 'form data');

        // Generate UUIDs for order and customer
        const orderId = generateUUID();
        const customerId = generateUUID();

        // First, create or get customer
        const customerCheckQuery = `SELECT customer_id FROM customers WHERE email = ?`;
        const existingCustomer = await query(customerCheckQuery, [emailToUse]);

        let finalCustomerId;
        if (existingCustomer && existingCustomer.length > 0) {
            finalCustomerId = existingCustomer[0].customer_id;
            console.log('[create_order] Using existing customer:', finalCustomerId);
        } else {
            // Create new customer
            const customerQuery = `
                INSERT INTO customers (customer_id, email, full_name, created_at)
                VALUES (?, ?, ?, NOW())
            `;
            await query(customerQuery, [
                customerId,
                emailToUse,
                user?.username || `${customer.firstName} ${customer.lastName}`
            ]);
            finalCustomerId = customerId;
            console.log('[create_order] Created new customer:', finalCustomerId);
        }

        // Create address for this customer
        const addressId = generateUUID();
        const addressQuery = `
            INSERT INTO addresses (
                address_id,
                customer_id,
                kind,
                line1,
                city,
                region,
                postal_code,
                country
            ) VALUES (?, ?, 'shipping', ?, ?, ?, ?, ?)
        `;
        await query(addressQuery, [
            addressId,
            finalCustomerId,
            customer.address.street,
            customer.address.city,
            customer.address.state,
            customer.address.zipCode,
            'US' // Convert country name to 2-letter code
        ]);

        // Insert order
        const orderQuery = `
            INSERT INTO orders (
                order_id,
                customer_id,
                currency,
                status,
                total_amount,
                placed_at
            ) VALUES (?, ?, 'USD', 'paid', ?, NOW())
        `;

        await query(orderQuery, [
            orderId,
            finalCustomerId,
            pricing.total
        ]);

        // Insert order items
        for (const item of items) {
            // Get variant_id from product_id (you may need to adjust this logic)
            const variantQuery = `
                SELECT variant_id FROM variants WHERE product_id = ? LIMIT 1
            `;
            const variantResult = await query(variantQuery, [item.product_id]);
            
            if (variantResult && variantResult.length > 0) {
                const variantId = variantResult[0].variant_id;
                
                const itemQuery = `
                    INSERT INTO order_items (
                        order_id,
                        variant_id,
                        unit_price,
                        qty
                    ) VALUES (?, ?, ?, ?)
                `;

                await query(itemQuery, [
                    orderId,
                    variantId,
                    item.price,
                    item.quantity
                ]);
            }
        }

        // Create payment record
        const paymentId = generateUUID();
        const paymentQuery = `
            INSERT INTO payments (
                payment_id,
                order_id,
                provider,
                payment_intent_id,
                amount,
                status,
                created_at
            ) VALUES (?, ?, 'stripe', ?, ?, 'succeeded', NOW())
        `;

        await query(paymentQuery, [
            paymentId,
            orderId,
            payment?.transactionId || `pi_${Date.now()}`,
            pricing.total,
        ]);

        res.status(200).json({ 
            success: true, 
            orderId: orderId,
            message: 'Order created successfully'
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order: ' + error.message });
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