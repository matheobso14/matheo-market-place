
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (title: string, category: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Génère une description de vente courte et accrocheuse (max 150 caractères) pour un produit nommé "${title}" dans la catégorie "${category}". La réponse doit être en français.`,
    });
    return response.text?.trim() || "Aucune description générée.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Description auto-générée indisponible.";
  }
};

export const getChatResponse = async (userMessage: string, products: Product[], shopName: string): Promise<string> => {
  try {
    const productContext = products.map(p => `- ${p.title} (${p.category}): ${p.price}€. Description: ${p.description}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `Tu es l'assistant de vente virtuel pour la boutique "${shopName}". 
        Voici les produits disponibles actuellement :
        ${productContext}
        
        Réponds de manière polie, concise et professionnelle en français. 
        Si un utilisateur pose une question sur un produit, aide-le à choisir. 
        Si on te pose une question hors sujet, ramène gentiment la conversation vers la boutique.`
      }
    });
    return response.text?.trim() || "Désolé, je n'ai pas pu formuler de réponse.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Une erreur est survenue lors de la communication avec l'IA.";
  }
};
