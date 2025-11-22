import { GoogleGenAI } from "@google/genai";
import { Lot } from "../types";

// Initialize Gemini Client
// IMPORTANT: In a real app, do not expose API keys on the client side. 
// This should be proxied through a backend.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const analyzeLotRisk = async (lot: Lot): Promise<string> => {
  if (!apiKey) {
    return "Configuration de l'API Key manquante. Impossible d'analyser le lot.";
  }

  try {
    const prompt = `
      Agis en tant qu'expert en assurance qualité industrielle pour une entreprise de cosmétiques (Pure Essence).
      Analyse les données suivantes d'un lot de production et fournis un résumé court (max 100 mots) des risques potentiels et des recommandations.
      
      Données du Lot :
      Numéro: ${lot.lotNumber}
      Produit: ${lot.productName}
      Statut: ${lot.status}
      Score de Risque IA (0-1): ${lot.riskScore}
      Date Prod: ${lot.productionDate}
      
      Événements récents:
      ${lot.events.map(e => `- ${e.eventType}: ${e.details} (Anomalie: ${e.anomalyScore || 0})`).join('\n')}
      
      Résultats QC:
      ${lot.qcResults.map(qc => `- ${qc.testName}: ${qc.result} (${qc.value} ${qc.unit})`).join('\n')}
      
      Réponds en Français, format professionnel.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Aucune analyse générée.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erreur lors de l'analyse IA. Veuillez vérifier votre connexion ou clé API.";
  }
};
