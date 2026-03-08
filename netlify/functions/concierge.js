const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const { prompt } = body;

    if (!process.env.GENERATIVE_API_KEY) {
      return {
        statusCode: 200,
        body: JSON.stringify({ text: "Demo Mode: The AI Concierge is currently offline. Please configure the API Key in your deployment settings." })
      };
    }

    const ai = new GoogleGenerativeAI(process.env.GENERATIVE_API_KEY);
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(prompt);
    // response.response.text() is synchronous in this SDK wrapper
    const text = response.response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ text })
    };
  } catch (err) {
    console.error('Concierge function error', err && err.stack ? err.stack : err);
    // Return error details for debugging (remove in production)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err?.message || 'Server error', details: err })
    };
  }
};
