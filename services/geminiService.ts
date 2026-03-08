import { GoogleGenerativeAI } from '@google/generative-ai';

// Direct client-side calls to Gemini API
export const generateConciergeResponse = async (userMessage: string, userProfile: any) => {
  const resortContext = JSON.stringify((userProfile && userProfile.availableResorts) || []);
  const userContext = JSON.stringify({ name: userProfile?.firstName || 'Member', availablePoints: userProfile?.points?.available || 0, location: 'South Africa' });

  const prompt = `
    You are the "Dream Vacation Club Concierge", a sophisticated AI travel assistant for a luxury holiday club.

    Context:
    - User: ${userContext}
    - Available Resorts: ${resortContext}

    Task: Answer the user's request.
    - If they ask for recommendations, suggest resorts from the list that fit their point balance.
    - If they ask about their points, remind them of their balance.
    - Maintain a professional, warm, luxury tone (use words like "bespoke", "tranquil", "exclusive").
    - Keep responses concise (under 50 words where possible) as this is a mobile chat interface.

    User Query: ${userMessage}
  `;

  try {
    const apiKey = import.meta.env.VITE_API_KEY || '';
    if (!apiKey) {
      console.warn('API Key is missing');
      return "Demo Mode: The AI Concierge is currently offline. Please configure the API Key.";
    }

    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(prompt);
    return response.response.text();
  } catch (err: any) {
    console.error('Error calling Gemini SDK:', err);
    console.error('Error details:', err?.message || err);
    return "I apologize, I'm having trouble connecting to the reservation system right now. (" + (err?.message || 'Unknown error').substring(0, 100) + ")";
  }
};