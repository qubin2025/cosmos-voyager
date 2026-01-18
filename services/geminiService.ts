
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Fetches cosmic insights with real-time Google Search grounding.
 */
export const getCosmicInsights = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: "You are a world-class astrophysicist. Provide a fascinating, scientifically accurate response. Use Google Search for recent events or complex data.",
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      }
    });
    
    return {
      text: response.text || "The stars are silent.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Cosmic dust is obscuring our signals. Please try again.", sources: [] };
  }
};

export const getForumBotResponse = async (postContent: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: postContent,
      config: {
        systemInstruction: 'Act as "Nova", a friendly space community moderator. Respond briefly.',
        maxOutputTokens: 150,
      }
    });
    return response.text || "Fascinating perspective!";
  } catch (error) {
    return "The cosmos has much to teach us.";
  }
};

export const getPostMetadata = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this forum post: "${content}"`,
      config: {
        systemInstruction: "Extract 3-4 space-themed tags and a one-sentence summary.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["summary", "tags"],
        },
      },
    });
    return response.text ? JSON.parse(response.text) : { summary: "Observation logged.", tags: ["#Cosmos"] };
  } catch (error) {
    return { summary: "New observation.", tags: ["#Community"] };
  }
};
