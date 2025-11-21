// pages/api/chat.js
import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, conversationHistory = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error:
        'Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file',
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // 🧠 STYLE + BEHAVIOUR OF YOUR BOT
    const systemPrompt = `You are a friendly personal fashion and style advisor.

Your job:
- Greet the user warmly (for example: "Hi! Nice to meet you 👋").
- Ask simple follow-up questions about their style, colours they like, and the occasion.
- Give outfit ideas and colour combinations based on the items they mention (e.g. "beige pants", "white sneakers", "black turtleneck").
- Focus on general fashion principles: colour matching, balance between top and bottom, shoes, accessories, and season/occasion.

Important rules:
- You are NOT connected to any website, brand, or store.
- Never say things like "I can search our website", "check inventory", "add to cart", or "browse our catalog".
- Only give general advice such as "a white shirt", "a navy overshirt", "brown loafers", "simple silver jewelry", etc.
- Do not talk about stock, prices, or specific product links.

How to answer:
- Keep answers short: usually 2–4 sentences.
- If the user gives a specific item and colour (like "beige pants"):
  - Suggest 1–3 top colours that go well with it.
  - Suggest at least one good shoe colour.
  - Optionally mention 1–2 accessories (watch, belt, bag, jewelry, etc.).
- Use clear, simple language and explain *why* the combo works (e.g. "because beige is a warm neutral, it pairs nicely with…").
- End most replies with a short follow-up question to keep the styling conversation going (e.g. "Is this for something casual or more dressed up?").

Examples:
- If the user says: "What would look nice with my beige pants?"
  Answer in this style: "Beige pants look great with white, cream, light blue, or even a soft green top. For shoes, try white or tan sneakers, or brown loafers if you want it a bit dressier. A slim brown belt and a simple watch would finish the look nicely. Is this for a casual day out or something more formal?"
`;

    // Convert conversation history to Gemini format
    const chatHistory = conversationHistory.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Create chat session with history
    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      history: chatHistory,
      config: {
        maxOutputTokens: 220,  // shortish replies
        temperature: 0.4,      // more consistent, less random
      },
    });

    // Send message, prepend system instructions
    const response = await chat.sendMessage({
      message: `${systemPrompt}\n\nUser: ${message}`,
    });

    const text = response.text;

    return res.status(200).json({
      message: text,
      success: true,
    });
  } catch (error) {
    console.error('Gemini API Error:', error);

    if (
      error.status === 401 ||
      (error.message && error.message.includes('API key'))
    ) {
      return res.status(401).json({
        error:
          'Invalid API key. Please check your GEMINI_API_KEY in .env.local',
      });
    }

    if (error.status === 404) {
      return res.status(500).json({
        error:
          'Gemini model not found. Make sure your key has access to gemini-2.0-flash.',
      });
    }

    return res.status(500).json({
      error: 'Failed to generate response. Please try again.',
      details: error.message || 'Unknown error',
    });
  }
}
