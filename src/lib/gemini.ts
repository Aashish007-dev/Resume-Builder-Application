import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export async function generateAIContent(prompt: string) {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
    });

    return response.text;
};