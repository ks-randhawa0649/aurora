# Google Gemini AI Chatbot - Setup Guide

## 🎉 Installation Complete!

Your Aurora e-commerce site now has a Google Gemini-powered AI chatbot integrated! Follow the steps below to configure and start using it.

---

## 📋 What Was Installed

### 1. **Package Installation**
- `@google/generative-ai` - Official Google Gemini AI SDK

### 2. **API Route**
- **File**: `pages/api/chat.js`
- **Endpoint**: `POST /api/chat`
- **Features**:
  - Accepts user messages and conversation history
  - Uses Gemini 1.5 Pro model
  - Product-aware responses (knows your Aurora brand, categories, products)
  - Error handling for API keys and network issues
  - Concise responses (under 250 tokens for quick chat)

### 3. **Chat Widget Component**
- **File**: `components/ChatWidget.jsx`
- **Features**:
  - Floating chat button (bottom-right corner)
  - Slide-up chat panel with smooth animations
  - User/AI message bubbles with distinct styles
  - Typing indicator when AI is responding
  - Clear chat button to reset conversation
  - Conversation history for context-aware responses
  - Fully responsive (mobile & desktop)
  - Premium brand styling matching your site

### 4. **Layout Integration**
- **File**: `components/layout.jsx`
- ChatWidget automatically appears on every page site-wide

---

## 🔑 Required: Setup Your API Key

### Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Copy your API key (starts with `AIza...`)

### Step 2: Add API Key to Environment Variables

1. Create a `.env.local` file in your project root (if it doesn't exist):

```bash
# In your project root: c:\Users\Nima\Desktop\aurora\
# Create the file: .env.local
```

2. Add your Gemini API key:

```env
GEMINI_API_KEY=AIzaSy... (your actual API key here)
```

3. **Important**: Restart your Next.js development server after adding the API key:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 3: Verify Setup

1. Open your site: `http://localhost:3000`
2. Look for the blue chat bubble in the bottom-right corner
3. Click it to open the chat
4. Type a message like: *"Show me leather jackets"*
5. The AI should respond with product recommendations

---

## ⚠️ Security Notes

### `.env.local` File
- **NEVER** commit `.env.local` to Git
- Add to `.gitignore` if not already present:

```bash
# .gitignore
.env.local
.env*.local
```

### API Key Protection
- The API key is only used server-side (in `/api/chat.js`)
- It's never exposed to the browser
- Requests go through your Next.js API route, not directly to Google

---

## 🎨 Customization Options

### 1. Change Chat Bubble Color

Edit `components/ChatWidget.jsx` - Find this section:

```jsx
.chat-fab {
  background: #26c;  // Change this hex color
}
```

Your brand primary color is `#26c` (blue). You can change it to match any design preference.

### 2. Modify AI Personality

Edit `pages/api/chat.js` - Find `systemPrompt`:

```javascript
const systemPrompt = `You are Aurora's AI shopping assistant...`;
```

Customize:
- Tone (friendly, professional, casual)
- Product knowledge
- Response length
- Specific features to highlight

### 3. Adjust Chat Panel Size

Edit `components/ChatWidget.jsx`:

```jsx
.chat-panel {
  width: 380px;  // Change width
  height: 550px; // Change height
}
```

### 4. Change Chat Position

```jsx
.chat-fab {
  bottom: 24px; // Distance from bottom
  right: 24px;  // Distance from right
}
```

---

## 🧪 Testing the Chatbot

### Test Queries to Try:

1. **Product Search**:
   - "Show me leather jackets"
   - "Do you have sneakers?"
   - "What accessories do you sell?"

2. **Shopping Help**:
   - "How do I add items to my cart?"
   - "What's your return policy?"
   - "Do you ship internationally?"

3. **Product Recommendations**:
   - "I need an outfit for winter"
   - "Suggest something for a date night"
   - "What goes well with jeans?"

4. **General Questions**:
   - "What categories do you have?"
   - "What's Aurora's style?"
   - "Tell me about your brand"

---

## 🐛 Troubleshooting

### Issue: Chat button appears but messages don't send

**Solution**: Check your API key is correctly set in `.env.local` and server is restarted.

```bash
# Verify .env.local exists and has:
GEMINI_API_KEY=AIza...

# Restart server:
npm run dev
```

### Issue: "API key not configured" error

**Solution**: 
1. Ensure `.env.local` is in the root directory (same level as `package.json`)
2. API key format: `GEMINI_API_KEY=AIzaSy...` (no quotes, no spaces)
3. Restart Next.js server

### Issue: "Invalid API key" error

**Solution**:
1. Double-check your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Ensure you copied the entire key (usually starts with `AIza`)
3. Create a new key if necessary

### Issue: Chat widget doesn't appear

**Solution**:
1. Check browser console for errors (F12)
2. Verify `ChatWidget.jsx` is in `components/` folder
3. Confirm `layout.jsx` imports and renders `<ChatWidget />`

### Issue: Responses are too slow

**Solution**: The free tier of Gemini API has rate limits. Consider:
1. Upgrading to paid tier for faster responses
2. Reducing `maxOutputTokens` in `chat.js` for quicker responses
3. Implementing response caching for common queries

---

## 📊 API Usage & Limits

### Gemini API Free Tier:
- **Rate Limit**: 60 requests per minute
- **Token Limit**: 32,000 tokens per request (sufficient for chat)
- **Cost**: FREE for testing and development

### Gemini API Paid Tier:
- Higher rate limits
- Priority access
- See [Google AI Pricing](https://ai.google.dev/pricing)

---

## 🚀 Next Steps & Enhancements

### 1. Add Product Context
Enhance the AI by fetching actual product data:

```javascript
// In pages/api/chat.js
const products = await fetch('http://localhost:3000/api/products_json.js').then(r => r.json());
const systemPrompt = `You are Aurora's AI assistant. Available products: ${JSON.stringify(products.slice(0, 10))}...`;
```

### 2. Add Quick Reply Buttons
Add suggested questions users can click:

```jsx
// In ChatWidget.jsx
const quickReplies = [
  "Show me new arrivals",
  "What's on sale?",
  "Help me find jeans"
];
```

### 3. Track Conversations
Log chat interactions for analytics:

```javascript
// In pages/api/chat.js
console.log('User query:', message);
console.log('AI response:', text);
// Or save to database
```

### 4. Add Voice Input
Integrate Web Speech API for voice messages.

### 5. Multi-language Support
Configure Gemini to respond in multiple languages based on user preference.

---

## 📁 File Structure Summary

```
aurora/
├── .env.local                    # API keys (CREATE THIS)
├── components/
│   └── ChatWidget.jsx            # ✅ Chat UI component
├── pages/
│   ├── api/
│   │   └── chat.js               # ✅ Gemini API route
│   └── layout.jsx                # ✅ Updated with ChatWidget
└── package.json                  # ✅ Updated with @google/generative-ai
```

---

## ✅ Quick Start Checklist

- [x] ✅ Install `@google/generative-ai` package
- [x] ✅ Create `/api/chat.js` API route
- [x] ✅ Create `ChatWidget.jsx` component
- [x] ✅ Integrate into `layout.jsx`
- [ ] ⏳ Create `.env.local` file
- [ ] ⏳ Add `GEMINI_API_KEY` to `.env.local`
- [ ] ⏳ Restart Next.js server
- [ ] ⏳ Test chat on your site

---

## 💡 Tips for Best Performance

1. **Keep API Key Secret**: Never expose in client-side code
2. **Monitor Usage**: Track API calls to stay within limits
3. **Optimize Prompts**: Shorter, clearer prompts = faster responses
4. **Cache Common Queries**: Store frequent questions/answers
5. **Error Handling**: Always provide fallback messages
6. **User Feedback**: Add rating system for AI responses

---

## 🆘 Need Help?

### Resources:
- [Google Gemini AI Docs](https://ai.google.dev/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React Hooks Guide](https://react.dev/reference/react)

### Common Issues:
1. **API Key Problems**: Double-check `.env.local` format
2. **CORS Errors**: Ensure API route is in `pages/api/`
3. **Styling Issues**: Check browser console for CSS errors

---

## 🎉 You're All Set!

Your Aurora e-commerce site now has a powerful AI shopping assistant. Once you add your Gemini API key and restart the server, customers can get instant help finding products, learning about your brand, and completing purchases.

**Last Step**: Create `.env.local` with your API key and restart the server!

```bash
# .env.local
GEMINI_API_KEY=your_actual_key_here

# Restart
npm run dev
```

Happy chatting! 🤖✨
