import { GoogleGenAI, Type } from "@google/genai";

export interface AiAnnotation {
  x: number;
  y: number;
  type: string; // Vellus Hair, Terminal Hair etc.
  radius: number;
}

export const analyzeImageWithAI = async (base64ImageData: string): Promise<AiAnnotation[] | null> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64ImageData,
    },
  };
  
  const textPart = {
    text: `
      You are a highly specialized AI assistant for trichoscopy, designed for extreme precision in analyzing dermoscopic images of the human scalp. Your single most important goal is accuracy.

      **CRITICAL INSTRUCTIONS - FOLLOW THESE STEPS EXACTLY:**

      1.  **DEFINE THE REGION OF INTEREST (ROI):** Your first and most critical task is to identify the central, brightly-lit, circular area of the scalp in the image. This is your ONLY area of analysis.
      2.  **STRICTLY IGNORE THE BACKGROUND:** The dark, textured, ring-like structure around the center is the medical instrument's viewport. It is irrelevant. You MUST NOT place any annotations in this outer region. An annotation outside the central circle is a critical failure.
      3.  **IDENTIFY AND ANNOTATE HAIRS WITHIN THE ROI:** Inside the central circle ONLY, you will identify every individual hair shaft. For each hair you find, you must:
          a. **Classify the Hair Type:**
              *   **'Terminal Hair':** Classify as this if the hair is thick, coarse, and darkly pigmented. These are the most prominent hairs.
              *   **'Vellus Hair':** Classify as this if the hair is noticeably thinner, shorter, and more lightly pigmented than terminal hairs. They can be very fine.
          b. **Determine Precise Coordinates:**
              *   Provide the (x, y) coordinates for the center of each hair you identify.
              *   **IMPORTANT:** These coordinates MUST be relative to the dimensions of the image provided to you. The top-left corner is (0, 0).
          c. **Suggest Radius:** Provide a small radius for the annotation circle, typically between 3 and 8 pixels, appropriate for the hair's thickness.

      **OUTPUT FORMAT:**
      You must return your findings as a JSON array that strictly follows the provided schema. Do not output any other text, explanations, or markdown. Your entire response must be the JSON array itself.
    `,
  };

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        x: {
          type: Type.NUMBER,
          description: "The x-coordinate of the hair's center.",
        },
        y: {
          type: Type.NUMBER,
          description: "The y-coordinate of the hair's center.",
        },
        type: {
          type: Type.STRING,
          description: "The type of the hair ('Vellus Hair' or 'Terminal Hair').",
        },
        radius: {
            type: Type.NUMBER,
            description: 'A suggested radius for the annotation circle.',
        }
      },
      required: ["x", "y", "type", "radius"],
      propertyOrdering: ["x", "y", "type", "radius"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        console.warn("AI response was empty.");
        return null;
    }
    
    return JSON.parse(jsonText) as AiAnnotation[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(`Failed to analyze image with AI. Please check the console for details.`);
  }
};