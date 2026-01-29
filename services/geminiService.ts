
import { GoogleGenAI, Type } from "@google/genai";
import { CampaignSummary, DailyReport } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeCampaignPerformance(summary: CampaignSummary, daily: DailyReport[]) {
  const prompt = `
    Analiza los siguientes datos de una campaña publicitaria de "Rich Media" en España.
    Resumen:
    - Objetivo de Impresiones: ${summary.objectiveImpressions}
    - Impresiones Servidas: ${summary.servedImpressions} (${(summary.servedImpressions / summary.objectiveImpressions * 100).toFixed(2)}% del total)
    - Inversión Total Presupuestada: $${summary.investment}
    - Consumido: $${summary.consumedBudget}
    - CTR Global: ${summary.totalCtr}%
    - Viewability Global: ${summary.totalViewability}%
    - Período: ${summary.startDate} al ${summary.endDate}

    Datos diarios (Día, Impresiones, Clicks, CTR%):
    ${daily.map(d => `${d.date}: ${d.impressions} impr, ${d.clicks} clks, ${d.ctr}% CTR`).join('\n')}

    Por favor, proporciona un análisis ejecutivo breve (máximo 3 párrafos) que incluya:
    1. Desempeño general frente al objetivo.
    2. Identificación de días con mejor rendimiento (picos de CTR).
    3. Recomendaciones estratégicas basadas en el ritmo de consumo y viewability.
    
    Responde en español, con un tono profesional y directo.
  `;

  try {
    // Fixed: Always use ai.models.generateContent to query GenAI with both the model name and prompt.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Use .text property directly, do not call as a method
    return response.text;
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    return "No se pudieron cargar los insights automáticos en este momento.";
  }
}

export async function analyzeVerificationImage(base64Data: string) {
  const prompt = `
    Analiza esta captura de pantalla de una publicidad digital (ad verification).
    Extrae la siguiente información en formato JSON:
    - site: El nombre del sitio web donde aparece el anuncio (ej: El País, YouTube, etc).
    - title: Un título descriptivo para la verificación (ej: Billboard Desktop en Inicio).
    - device: El tipo de dispositivo (Desktop, Mobile, Tablet).
    - format: El formato del anuncio (ej: Skin, Intersticial, Robapáginas, Billboard).
    - url: La URL probable o detectada del sitio.
    
    Si no puedes determinar algo con exactitud, haz una estimación profesional basada en el aspecto visual.
    Responde únicamente con el objeto JSON.
  `;

  try {
    // Fixed: contents must be an object with a parts array when sending multiple parts (text + image).
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            site: { type: Type.STRING },
            title: { type: Type.STRING },
            device: { type: Type.STRING },
            format: { type: Type.STRING },
            url: { type: Type.STRING },
          },
          required: ["site", "title", "device", "format", "url"]
        }
      }
    });

    // Use .text property directly
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error analyzing image:", error);
    return {
      site: "Desconocido",
      title: "Verificación Cargada",
      device: "No detectado",
      format: "Banner",
      url: "#"
    };
  }
}
