import { query as dbQuery } from '../../lib/database'

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export default async function handler(req, res) {
  const method = req.method
  console.log('[/api/cart] method=', method)
  console.log('[/api/cart] body=', req.body)

  try {
    if (method === 'POST') {
      // Add item to cart or create cart
      const { cart_id, variant_id, product_id, qty = 1, customer_id, session_token } = req.body
      console.log('[/api/cart][POST] cart_id, variant_id, product_id, qty =', cart_id, variant_id, product_id, qty)
      // If variant_id not provided, attempt to resolve from product_id
      let resolvedVariantId = variant_id
      if (!resolvedVariantId && product_id) {
        try {
          const vr = await dbQuery('SELECT variant_id FROM variants WHERE product_id = ? LIMIT 1', [product_id])
          if (vr && vr.length) resolvedVariantId = vr[0].variant_id
        } catch (e) {
          console.error('[/api/cart] error resolving variant from product_id', e)
          return res.status(500).json({ error: 'cart api error' })
        }
      }
      if (!resolvedVariantId) return res.status(400).json({ error: 'variant_id required' })
      const qNum = Number(qty)
      if (isNaN(qNum) || qNum <= 0) return res.status(400).json({ error: 'qty must be a positive number' })
      let cartId = cart_id
      if (!cartId) {
        cartId = uuidv4()
        await dbQuery('INSERT INTO carts (cart_id, customer_id, session_token, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())', [cartId, customer_id || null, session_token || null, 'active'])
      }

      // ensure variant exists to avoid FK error
      try {
        const vrows = await dbQuery('SELECT variant_id FROM variants WHERE variant_id = ? LIMIT 1', [resolvedVariantId])
        if (!vrows || !vrows.length) {
          console.warn('[/api/cart] variant not found:', resolvedVariantId)
          return res.status(400).json({ error: 'invalid variant_id' })
        }
      } catch (e) {
        console.error('[/api/cart] error checking variant existence', e)
        return res.status(500).json({ error: 'cart api error' })
      }

      // upsert cart_items (cart_id, variant_id) composite PK
      try {
        await dbQuery('INSERT INTO cart_items (cart_id, variant_id, qty, added_at) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE qty = qty + VALUES(qty), added_at = NOW()', [cartId, resolvedVariantId, qNum])
      } catch (e) {
        console.error('[/api/cart] failed to insert/update cart_items', e)
        return res.status(500).json({ error: 'cart api error' })
      }

      return res.status(200).json({ cart_id: cartId })
    }

    if (method === 'PUT') {
      // Update quantity
      const { cart_id, variant_id, qty } = req.body
      if (!cart_id || !variant_id) return res.status(400).json({ error: 'cart_id and variant_id required' })
      const q = Number(qty)
      if (isNaN(q)) return res.status(400).json({ error: 'qty must be a number' })
      if (q <= 0) {
        await dbQuery('DELETE FROM cart_items WHERE cart_id = ? AND variant_id = ?', [cart_id, variant_id])
        return res.status(200).json({ cart_id })
      }
      await dbQuery('UPDATE cart_items SET qty = ?, added_at = NOW() WHERE cart_id = ? AND variant_id = ?', [q, cart_id, variant_id])
      return res.status(200).json({ cart_id })
    }

    if (method === 'DELETE') {
      const { cart_id, variant_id, clear } = req.body
      if (!cart_id) return res.status(400).json({ error: 'cart_id required' })
      if (variant_id) {
        await dbQuery('DELETE FROM cart_items WHERE cart_id = ? AND variant_id = ?', [cart_id, variant_id])
        return res.status(200).json({ cart_id })
      }
      if (clear) {
        await dbQuery('DELETE FROM cart_items WHERE cart_id = ?', [cart_id])
        await dbQuery('DELETE FROM carts WHERE cart_id = ?', [cart_id])
        return res.status(200).json({ cart_id })
      }
      return res.status(400).json({ error: 'variant_id or clear flag required' })
    }

    if (method === 'GET') {
      const { cart_id } = req.query
      if (!cart_id) return res.status(400).json({ error: 'cart_id required' })

      const cartRows = await dbQuery('SELECT cart_id, customer_id, session_token, status, created_at, updated_at FROM carts WHERE cart_id = ? LIMIT 1', [cart_id])
      const cart = cartRows && cartRows[0] ? cartRows[0] : null

      const items = await dbQuery(`SELECT ci.variant_id, ci.qty, v.sku, v.price, v.product_id, p.title as product_title, p.UI_pname
        FROM cart_items ci
        LEFT JOIN variants v ON ci.variant_id = v.variant_id
        LEFT JOIN products p ON v.product_id = p.product_id
        WHERE ci.cart_id = ?`, [cart_id])

      return res.status(200).json({ cart: cart || { cart_id }, items })
    }

    res.setHeader('Allow', 'GET,POST,PUT,DELETE')
    res.status(405).end('Method Not Allowed')
  } catch (err) {
    console.error('cart api error', err)
    res.status(500).json({ error: 'cart api error' })
  }
}
