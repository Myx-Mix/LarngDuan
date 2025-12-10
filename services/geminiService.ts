import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types';

export const generateSalesInsight = async (transactions: Transaction[]): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      return "API Key not found. Please configure the environment variable.";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prepare data for the model
    const dataSummary = transactions.map(t => ({
      time: new Date(t.timestamp).toLocaleTimeString(),
      total: t.total,
      items: t.items.map(i => `${i.quantity}x ${i.name}`).join(', ')
    }));

    const prompt = `
      You are an expert restaurant business analyst. 
      Analyze the following recent transaction history from a POS system.
      
      Transaction Data JSON:
      ${JSON.stringify(dataSummary, null, 2)}
      
      Please provide a concise but insightful summary. 
      1. Identify popular items.
      2. Comment on the average order value.
      3. Provide one actionable tip for the manager to increase revenue based on this limited snapshot.
      
      Keep the tone professional and encouraging. Limit to 150 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Unable to generate insights at this time. Please try again later.";
  }
};
