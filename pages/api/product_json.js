import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  const { slug } = req.query;
  
  console.log('API received slug:', slug);
  
  try {
    const jsonDirectory = path.join(process.cwd(), 'public/data');
    const fileContents = await fs.readFile(jsonDirectory + '/products.json', 'utf8');
    const data = JSON.parse(fileContents);
    
    const product = data.products.find(p => p.slug === slug);
    
    console.log('Found product:', product ? product.name : 'Not found');
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Get related products (same category, different product)
    const related = data.products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 5);
    
    res.status(200).json({ 
      product: {
        data: product,
        related: related
      }
    });
  } catch (error) {
    console.error('Error reading product:', error);
    res.status(500).json({ error: 'Failed to load product' });
  }
}