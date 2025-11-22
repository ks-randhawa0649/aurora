import { query as dbQuery } from '../../lib/database'

export default async function handler(req, res) {
  try {
    const rows = await dbQuery(`SELECT v.variant_id, v.sku, v.price, v.product_id, p.title
      FROM variants v
      LEFT JOIN products p ON v.product_id = p.product_id
      ORDER BY v.variant_id LIMIT 100`)
    return res.status(200).json({ variants: rows })
  } catch (err) {
    console.error('variants api error', err)
    return res.status(500).json({ error: 'Failed to load variants' })
  }
}
