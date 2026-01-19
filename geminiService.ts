
import { GoogleGenAI } from "@google/genai";
import { Product } from "./types";

// On ne crée pas l'instance ici au niveau global car process.env.API_KEY peut être undefined au chargement
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateProductDescription = async (title: string, category: string): Promise<string> => {
  try {
    const ai = getAIClient();
    if (!ai) throw new Error("API Key missing");

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Génère une description de vente courte et accrocheuse (max 150 caractères) pour un produit nommé "${title}" dans la catégorie "${category}". La réponse doit être en français.`,
    });
    return response.text?.trim() || "Aucune description générée.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Découvrez notre nouveau produit de qualité supérieure, conçu pour vous satisfaire au quotidien.";
  }
};

export const getChatResponse = async (userMessage: string, products: Product[], shopName: string): Promise<string> => {
  try {
    const ai = getAIClient();
    if (!ai) return "L'assistant IA est temporairement indisponible (Clé API manquante).";

    const productContext = products.slice(0, 10).map(p => `- ${p.title} (${p.category}): ${p.price}€.`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `Tu es l'assistant de vente virtuel pour la boutique "${shopName}". 
        Voici les produits disponibles :
        ${productContext}
        Réponds de manière polie et concise en français.`
      }
    });
    return response.text?.trim() || "Désolé, je n'ai pas pu formuler de réponse.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Une erreur est survenue lors de la communication avec l'IA.";
  }
};