import path from 'path';
import { promises as fs } from 'fs';
import { query as dbQuery } from '../../lib/database';

export default async function handler(req, res) {
  const { category, search } = req.query;

  // If DB is configured, serve products from DB with their images and pricing
  if (process.env.MYSQL_HOST) {
    try {
      let sql = `
        SELECT 
          p.product_id, 
          p.title AS name, 
          p.brand, 
          p.category_code AS category, 
          p.description, 
          p.created_at,
          MIN(v.price) AS min_price,
          MAX(v.price) AS max_price
        FROM products p
        LEFT JOIN variants v ON p.product_id = v.product_id
      `;
      const where = [];
      const params = [];

      if (category) {
        where.push('p.category_code = ?');
        params.push(category);
      }
      if (search) {
        where.push('LOWER(p.title) LIKE ?');
        params.push('%' + search.toLowerCase() + '%');
      }
      if (where.length) sql += ' WHERE ' + where.join(' AND ');
      
      sql += ' GROUP BY p.product_id, p.title, p.brand, p.category_code, p.description, p.created_at';

      const products = await dbQuery(sql, params);

      // Attach images in a single query
      if (products.length) {
        const ids = products.map(p => p.product_id);
        const placeholders = ids.map(() => '?').join(',');
        const images = await dbQuery(
          `SELECT product_id, url FROM images WHERE product_id IN (${placeholders}) ORDER BY is_primary DESC`,
          ids
        );
        
        const imageMap = {};
        for (const im of images) {
          imageMap[im.product_id] = imageMap[im.product_id] || [];
          imageMap[im.product_id].push(im.url);
        }

        const out = products.map(p => {
          // Generate slug from name
          const slug = p.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

          // Map category to readable name
          const categoryName = 
            p.category === 'unisex_topwear' ? 'Tops' : 
            p.category === 'unisex_bottomwear' ? 'Pants' : 
            'Clothing';

          return {
            id: p.product_id,
            product_id: p.product_id,
            slug: slug,
            name: p.name,
            brand: p.brand || 'SmartStyle',
            category: p.category,
            description: p.description || '',
            created_at: p.created_at,
            // Images array
            images: imageMap[p.product_id] || [],
            // Pictures in expected format
            pictures: (imageMap[p.product_id] || []).map(url => ({
              url: url,
              width: 280,
              height: 315
            })),
            // Categories array
            categories: [{
              name: categoryName,
              slug: p.category
            }],
            // Price array [regular_price, sale_price]
            price: [
              parseFloat(p.min_price) || 0,
              parseFloat(p.max_price) || 0
            ],
            min_price: parseFloat(p.min_price) || 0,
            max_price: parseFloat(p.max_price) || 0,
            // Default values
            ratings: 4,
            reviews: Math.floor(Math.random() * 20) + 1,
            discount: 0,
            is_new: new Date(p.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            stock: 100
          };
        });
        
        return res.status(200).json({ products: out });
      }
      return res.status(200).json({ products: [] });
    } catch (err) {
      console.error('DB products error', err);
      return res.status(500).json({ error: 'Failed to load products from DB', details: err.message });
    }
  }

  // Fallback: serve from static JSON file
  try {
    const jsonDirectory = path.join(process.cwd(), 'public/data');
    const fileContents = await fs.readFile(jsonDirectory + '/products.json', 'utf8');
    const data = JSON.parse(fileContents);
    let products = data.products;

    if (category) {
      products = products.filter(p => p.category === category);
    }
    if (search) {
      products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    res.status(200).json({ products });
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ error: 'Failed to load products' });
  }
}