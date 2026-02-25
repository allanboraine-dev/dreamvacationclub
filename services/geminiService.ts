// Frontend wrapper that calls the secure Netlify function at /.netlify/functions/concierge
// The function holds the real API key server-side. The frontend only sends a prompt.

export const generateConciergeResponse = async (userMessage: string, userProfile: any) => {
  // Build the prompt client-side (uses local constants/resorts if needed)
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
    const res = await fetch('/.netlify/functions/concierge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!res.ok) {
      console.error('Concierge function responded with', res.status, await res.text());
      return "I am currently offline. Please check your internet connection.";
    }

    const data = await res.json();
    return data.text || "I apologize, I'm having trouble connecting to the reservation system.";
  } catch (err) {
    console.error('Error calling concierge function', err);
    return "I am currently offline. Please check your internet connection.";
  }
};