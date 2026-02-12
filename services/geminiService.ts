
import { GoogleGenAI, Type } from "@google/genai";
import { ExpenseCategory } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseExpenseWithAI = async (input: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Parse the following expense description into a JSON object: "${input}". 
      Available categories: ${Object.values(ExpenseCategory).join(", ")}.
      If the user specifies names, identify them.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            mentionedNames: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["description", "amount", "category"]
        }
      }
    });

    if (!response.text) return null;
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("AI Parsing failed:", error);
    return null;
  }
};
