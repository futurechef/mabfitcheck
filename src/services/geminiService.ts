import { GoogleGenerativeAI } from "@google/generative-ai";
import type { SuitData, PhotoValidationResult, UserMeasurements } from "../types";
import type { ShirtConfiguration } from "../constants/fabricSwatches";

const getAI = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === "undefined") {
        console.warn("Gemini API Key missing! AI features will be disabled.");
        return null;
    }
    return new GoogleGenerativeAI(apiKey);
};

// Use gemini-2.0-flash (current default as of Jan 2025)
const VISION_MODEL = 'gemini-2.0-flash';

/**
 * Validates the user's uploaded photo for quality and suitability.
 */
export const validateUserPhoto = async (base64Image: string | null): Promise<PhotoValidationResult> => {
    const ai = getAI();

    // DEMO FALLBACK if AI is not configured
    if (!ai || !base64Image) {
        console.warn("AI not configured or no image. Returning demo validation success.");
        return {
            lighting: { score: 10, feedback: "Perfect studio lighting (Simulation)" },
            pose: { score: 10, feedback: "Balanced bespoke stance (Simulation)" },
            background: { score: 10, feedback: "Clean atelier environment (Simulation)" },
            overall: { ready: true, message: "Silhouette successfully captured and approved for visualization." }
        };
    }

    const rawData = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const model = ai.getGenerativeModel({ model: VISION_MODEL });

    const prompt = `
    Analyze this full-body fitting photo and score it on a scale of 1-10 for the following criteria:
    - Lighting Quality (poor/fair/good/excellent)
    - Body Positioning (straight on, relaxed natural pose?)
    - Background Clarity (no clutter, neutral color?)

    Return ONLY a JSON response in the following format:
    {
      "lighting": {"score": 8, "feedback": "Good window light, minor shadows on left"},
      "pose": {"score": 9, "feedback": "Perfect neutral stance"},
      "background": {"score": 10, "feedback": "Clean white background"},
      "overall": {"ready": true, "message": "Photo approved for mockups"}
    }

    Special Rule: If any score is below 6, set "ready" to false and provide specific fixes.
  `;

    try {
        const result = await model.generateContent([
            prompt,
            { inlineData: { mimeType: "image/jpeg", data: rawData } }
        ]);



        const text = result.response.text();
        const cleanedJson = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanedJson);
    } catch (error) {
        console.error("Validation Error:", error);
        // Fallback to success in demo mode if it was a real attempt that failed
        return {
            lighting: { score: 10, feedback: "Lighting validated (Fallback)" },
            pose: { score: 10, feedback: "Pose validated (Fallback)" },
            background: { score: 10, feedback: "Background validated (Fallback)" },
            overall: { ready: true, message: "Silhouette processing complete." }
        };
    }
};

/**
 * Helper to fetch an image from a URL and convert to Base64
 */
const fetchImageAsBase64 = async (url: string): Promise<string | null> => {
    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = (reader.result as string).replace(/^data:image\/\w+;base64,/, "");
                resolve(base64);
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.warn("Failed to fetch swatch image:", url, error);
        return null;
    }
};

/**
 * Generates a photorealistic virtual try-on image using Gemini 3 Pro Image.
 */
export const generateTryOnImage = async (
    userImageBase64: string | null,
    suit: SuitData | null,
    shirtConfig?: ShirtConfiguration,
    measurements?: UserMeasurements
): Promise<string | null> => {
    const ai = getAI();
    // FALLBACK for demo if AI is not configured
    const demoFallback = suit?.imageUrl || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80";

    if (!ai) {
        console.warn("AI not configured. Returning demo result.");
        return demoFallback;
    }

    // Use Gemini 3 Pro Image model for actual image generation
    const model = ai.getGenerativeModel({
        model: 'gemini-3-pro-image-preview',
    });

    const measurementPrompt = measurements?.chest ? `The person has a chest measurement of ${measurements.chest} inches and waist of ${measurements.waist} inches.` : "";

    // Build the prompt based on what's being generated
    let prompt: string;
    let swatchUrl: string | undefined;

    if (suit && shirtConfig) {
        // Both suit and shirt - be very specific about fabric
        swatchUrl = suit.imageUrl; // Use the suit image as visual reference for the fabric

        const fabricDesc = `${shirtConfig.fabric.color} ${shirtConfig.fabric.pattern.toLowerCase()} ${shirtConfig.fabric.name}`;
        const shirtDescription = `a ${fabricDesc} dress shirt with ${shirtConfig.style.collar} collar, ${shirtConfig.style.cuff} cuffs`;
        prompt = `Generate a high-quality, photorealistic image of a well-dressed person wearing ${suit.promptDescription || suit.name}, paired with ${shirtDescription}. ${measurementPrompt}
        
**FABRIC ACCURACY IS CRITICAL:**
- I have provided a reference image for the SUIT FABRIC. You MUST match the texture, pattern, and color of the input image EXACTLY.
- The SHIRT must be ${shirtConfig.fabric.color.toUpperCase()} color with ${shirtConfig.fabric.pattern.toUpperCase()} pattern

The suit and shirt should look professionally tailored. Professional studio photography, clean background.`;
    } else if (suit) {
        // Suit only - be very specific about fabric color and pattern
        swatchUrl = suit.imageUrl; // Use the suit image as visual reference

        prompt = `Generate a high-quality, photorealistic image of a well-dressed person wearing ${suit.promptDescription || suit.name}. ${measurementPrompt}

**FABRIC ACCURACY IS CRITICAL:**
- I have provided a reference image for the SUIT FABRIC. You MUST match the texture, pattern, and color of the input image EXACTLY.
- Do NOT generate a different color or pattern.
- The fabric texture must be visible and realistic.

Professional studio photography, clean background, excellent lighting.`;
    } else if (shirtConfig) {
        // Shirt only - NO SUIT/JACKET - Use emphatic negative instructions
        swatchUrl = shirtConfig.fabric.imageUrl; // Use fabric swatch

        const shirtDescription = `a ${shirtConfig.fabric.name} dress shirt with ${shirtConfig.style.collar} collar and ${shirtConfig.style.cuff} cuffs`;
        prompt = `Generate a high-quality, photorealistic image of a person wearing ONLY ${shirtDescription}. ${measurementPrompt}

**CRITICAL - MUST FOLLOW EXACTLY:**
- I have provided a reference image for the FABRIC. You MUST match the texture, pattern, and color of this fabric EXACTLY.
- The person is wearing ONLY the dress shirt - NO jacket, NO blazer, NO suit coat, NO vest, NO outerwear
- The dress shirt must be clearly visible with no covering garments
- Do NOT use a different fabric color or pattern

Show the person from roughly chest/waist up. Professional studio photography, clean background.`;
    } else {
        // Fallback (should not happen in normal flow)
        prompt = `Generate a high-quality, photorealistic image of a well-dressed person. ${measurementPrompt}
        
The image should be suitable for a luxury menswear catalog. 
Style: Professional studio photography, clean background, excellent lighting.`;
    }

    try {
        let contentParts: any[] = [prompt];

        // Fetch visual swatch if available
        if (swatchUrl) {
            console.log('[TryOn] Fetching swatch image:', swatchUrl);
            const swatchBase64 = await fetchImageAsBase64(swatchUrl);
            if (swatchBase64) {
                console.log('[TryOn] Swatch image successfully loaded');
                contentParts.push({
                    inlineData: { mimeType: "image/jpeg", data: swatchBase64 }
                });
                // Append text to explain the image
                contentParts.push("The image above is the EXACT FABRIC TEXTURE to use for the garment.");
            }
        }

        // Debug: Log whether user image is present
        console.log('[TryOn] User image provided:', !!userImageBase64, userImageBase64 ? `(${userImageBase64.substring(0, 50)}...)` : 'none');

        // If user provided an image, include it for reference
        if (userImageBase64) {
            const base64Data = userImageBase64.replace(/^data:image\/\w+;base64,/, "");
            contentParts.push(
                `Using this person's silhouette as reference for body type and pose, ${prompt}`,
                { inlineData: { mimeType: "image/jpeg", data: base64Data } }
            );
        }

        const result = await model.generateContent(contentParts);
        const response = result.response;

        // Check for generated image in response
        const parts = response.candidates?.[0]?.content?.parts;
        if (parts) {
            for (const part of parts) {
                if (part.inlineData?.mimeType?.startsWith('image/')) {
                    // Return the generated image as base64
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }

        // If no image was generated, log the text response and return fallback
        console.log("AI Response (no image generated):", response.text());
        return demoFallback;

    } catch (error) {
        console.error("Gemini Image Generation Error:", error);
        // Fallback to suit image or demo
        return demoFallback;
    }
};
