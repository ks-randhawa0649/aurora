import path from 'path';
import { promises as fs } from 'fs';
import { query as dbQuery } from '../../lib/database';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Slug parameter is required' });
  }

  console.log('Product API - Received slug:', slug);

  if (process.env.MYSQL_HOST) {
    try {
      let product;
      
      // UUID pattern check
      const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
      
      if (uuidRegex.test(slug)) {
        // Search by product_id (UUID)
        console.log('Searching by UUID:', slug);
        const sql = `
          SELECT 
            p.product_id, 
            p.title AS name, 
            p.brand, 
            p.category_code AS category, 
            p.description, 
            p.created_at,
            p.UI_pname
          FROM products p
          WHERE p.product_id = ?
          LIMIT 1
        `;
        const rows = await dbQuery(sql, [slug]);
        product = rows[0];
      } else {
        // Search by slug (converted from title)
        console.log('Searching by slug:', slug);
        
        // Convert slug back to possible title format
        const searchName = slug.replace(/-/g, ' ');
        
        const sql = `
          SELECT 
            p.product_id, 
            p.title AS name, 
            p.brand, 
            p.category_code AS category, 
            p.description, 
            p.created_at,
            p.UI_pname
          FROM products p
          WHERE 
            LOWER(REPLACE(REPLACE(REPLACE(p.title, ' ', '-'), '_', '-'), '--', '-')) = LOWER(?)
            OR LOWER(p.title) = LOWER(?)
            OR LOWER(p.title) LIKE LOWER(?)
          LIMIT 1
        `;
        const rows = await dbQuery(sql, [slug, searchName, `%${searchName}%`]);
        product = rows[0];
      }

      if (!product) {
        console.log('Product not found in database for slug:', slug);
        return res.status(404).json({ error: 'Product not found' });
      }

      console.log('Product found:', product.name, 'ID:', product.product_id);

      // Fetch all images for this product
      const images = await dbQuery(
        `SELECT url, is_primary 
         FROM images 
         WHERE product_id = ?
         ORDER BY is_primary DESC, image_id ASC`,
        [product.product_id]
      );
      
      // Images are already complete paths in the database (e.g., /images/products/tshirt/858.jpg)
      product.images = images.map(i => i.url);
      console.log('Images found:', product.images.length, 'URLs:', product.images);

      // Fetch all variants with their details
      const variants = await dbQuery(
        `SELECT variant_id, sku, color, size, price, currency, stock_qty
         FROM variants 
         WHERE product_id = ? 
         ORDER BY price ASC`,
        [product.product_id]
      );
      
      console.log('Variants found:', variants.length);
      
      // Calculate min and max prices from variants
      if (variants.length > 0) {
        const prices = variants.map(v => parseFloat(v.price)).filter(p => !isNaN(p));
        product.min_price = Math.min(...prices);
        product.max_price = Math.max(...prices);
      } else {
        product.min_price = 0;
        product.max_price = 0;
      }
      
      product.variants = variants;
      
      console.log('Price range:', product.min_price, '-', product.max_price);

      // Fetch related products (same category, different product)
      const relatedSql = `
        SELECT 
          p.product_id, 
          p.title AS name, 
          p.UI_pname,
          p.brand, 
          p.category_code AS category, 
          p.description, 
          p.created_at,
          p.UI_pname
        FROM products p
        WHERE p.category_code = ? AND p.product_id != ?
        LIMIT 6
      `;
      const related = await dbQuery(relatedSql, [product.category, product.product_id]);
      console.log('Related products found:', related.length);

      // Attach images and pricing for related products
      for (const rel of related) {
        // Get first image only
        const relImages = await dbQuery(
          `SELECT url 
           FROM images 
           WHERE product_id = ?
           ORDER BY is_primary DESC 
           LIMIT 1`,
          [rel.product_id]
        );
        rel.images = relImages.map(i => i.url);
        
        // Get price range from variants
        const relVariants = await dbQuery(
          `SELECT MIN(price) as min_price, MAX(price) as max_price 
           FROM variants 
           WHERE product_id = ?`,
          [rel.product_id]
        );
        rel.min_price = relVariants[0]?.min_price || 0;
        rel.max_price = relVariants[0]?.max_price || rel.min_price || 0;
      }

      return res.status(200).json({
        product: {
          data: product,
          related: related
        }
      });

    } catch (err) {
      console.error('DB product error:', err);
      return res.status(500).json({
        error: 'Failed to load product from DB',
        details: err.message
      });
    }
  }

  // Fallback to static JSON
  console.log('Using static JSON fallback');
  try {
    const jsonDirectory = path.join(process.cwd(), 'public/data');
    const fileContents = await fs.readFile(jsonDirectory + '/products.json', 'utf8');
    const data = JSON.parse(fileContents);

    const product = data.products.find(p => p.slug === slug);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const related = data.products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 6);
    
    res.status(200).json({
      product: {
        data: product,
        related
      }
    });
  } catch (error) {
    console.error('Error reading product:', error);
    res.status(500).json({ error: 'Failed to load product' });
  }
}