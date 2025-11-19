const { GoogleGenerativeAI } = require('@google/generative-ai');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversationHistory = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Check for API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file' 
    });
  }

  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Build conversation context with product awareness
    const systemPrompt = `You are Aurora's AI shopping assistant for a premium clothing e-commerce brand. Be helpful, friendly, and concise.

Key Information:
- Brand: Aurora (premium clothing)
- Product Categories: Tops, Pants, Shoes, Accessories, Outerwear
- Available Products: Leather jackets, hoodies, jeans, sneakers, boots, sunglasses, belts, etc.
- Website Features: Shop page with filters, product search, wishlist, cart, checkout
- Price Range: $15 - $450

Your Role:
1. Help customers find products
2. Answer questions about sizing, materials, shipping
3. Suggest complementary items
4. Assist with navigation and features
5. Be conversational but professional

Guidelines:
- Keep responses under 3-4 sentences for quick chat
- Use a warm, enthusiastic tone
- Suggest browsing the shop when relevant
- If unsure, be honest and offer to help differently
`;

    // Format conversation history for Gemini
    const chatHistory = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Create chat with history
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 250, // Keep responses concise
        temperature: 0.7,
      },
    });

    // Send message and get response
    const result = await chat.sendMessage(systemPrompt + '\n\nUser: ' + message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ 
      message: text,
      success: true 
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Handle specific error types
    if (error.message && error.message.includes('API key')) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your GEMINI_API_KEY in .env.local' 
      });
    }

    return res.status(500).json({ 
      error: 'Failed to generate response. Please try again.',
      details: error.message 
    });
  }
}
