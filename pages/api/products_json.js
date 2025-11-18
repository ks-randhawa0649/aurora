import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  try {
    const jsonDirectory = path.join(process.cwd(), 'public/data');
    const fileContents = await fs.readFile(jsonDirectory + '/products.json', 'utf8');
    const data = JSON.parse(fileContents);
    
    // Get filter parameters from query
    const { category, search, colors, sizes, brands, min_price, max_price } = req.query;
    let products = [...data.products];
    
    // Filter by category
    if (category) {
      products = products.filter(p => p.category === category);
    }
    
    // Filter by search term
    if (search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filter by colors
    if (colors) {
      const colorArray = Array.isArray(colors) ? colors : [colors];
      products = products.filter(p => 
        p.variants.some(v => colorArray.includes(v.color.name.toLowerCase()))
      );
    }
    
    // Filter by sizes
    if (sizes) {
      const sizeArray = Array.isArray(sizes) ? sizes : [sizes];
      products = products.filter(p => 
        p.variants.some(v => sizeArray.includes(v.size.name))
      );
    }
    
    // Filter by brands
    if (brands) {
      const brandArray = Array.isArray(brands) ? brands : [brands];
      products = products.filter(p => 
        p.brands.some(b => brandArray.includes(b.slug))
      );
    }
    
    // Filter by price range
    if (min_price || max_price) {
      const minPrice = min_price ? parseInt(min_price) : 0;
      const maxPrice = max_price ? parseInt(max_price) : Infinity;
      
      products = products.filter(p => {
        const price = p.discount > 0 ? p.price[1] : p.price[0];
        return price >= minPrice && price <= maxPrice;
      });
    }
    
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error reading products:', error);
    res.status(500).json({ error: 'Failed to load products' });
  }
}