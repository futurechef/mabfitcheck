
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

/**
 * Converts a File object to a Gemini-compatible inlineData part.
 */
const fileToPart = async (file: File) => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
    const { mimeType, data } = dataUrlToParts(dataUrl);
    return { inlineData: { mimeType, data } };
};

/**
 * Fetches an image from a URL and converts it to a Gemini-compatible inlineData part.
 * Includes a CORS proxy fallback to handle restrictive server configurations.
 */
const urlToPart = async (url: string) => {
    // If it's already a data URL, just parse it
    if (url.startsWith('data:')) {
        const { mimeType, data } = dataUrlToParts(url);
        return { inlineData: { mimeType, data } };
    }

    const fetchImage = async (targetUrl: string) => {
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const blob = await response.blob();
        const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                resolve(result.split(',')[1]);
            };
            reader.readAsDataURL(blob);
        });
        return { inlineData: { mimeType: blob.type, data: base64 } };
    };

    try {
        // Attempt 1: Direct fetch
        return await fetchImage(url);
    } catch (err) {
        console.warn(`Direct fetch failed for ${url}, attempting via proxy...`, err);
        try {
            // Attempt 2: CORS Proxy fallback
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
            return await fetchImage(proxyUrl);
        } catch (proxyErr) {
            console.error("Failed to fetch image from URL even with proxy:", url, proxyErr);
            throw new Error(
                `Image Load Failure: Could not access the garment image at ${url}. ` +
                `This is likely due to CORS restrictions on the hosting server. ` +
                `The proxy attempt also failed. Please try uploading a local image instead.`
            );
        }
    }
};

/**
 * Common helper to handle both File and URL/DataURL sources.
 */
const sourceToPart = async (source: File | string) => {
    if (source instanceof File) return fileToPart(source);
    return urlToPart(source);
};

const dataUrlToParts = (dataUrl: string) => {
    const arr = dataUrl.split(',');
    if (arr.length < 2) throw new Error("Invalid data URL");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || !mimeMatch[1]) throw new Error("Could not parse MIME type from data URL");
    return { mimeType: mimeMatch[1], data: arr[1] };
}

const dataUrlToPart = (dataUrl: string) => {
    const { mimeType, data } = dataUrlToParts(dataUrl);
    return { inlineData: { mimeType, data } };
}

const handleApiResponse = (response: GenerateContentResponse): string => {
    if (response.promptFeedback?.blockReason) {
        const { blockReason, blockReasonMessage } = response.promptFeedback;
        const errorMessage = `Request was blocked. Reason: ${blockReason}. ${blockReasonMessage || ''}`;
        throw new Error(errorMessage);
    }

    for (const candidate of response.candidates ?? []) {
        const imagePart = candidate.content?.parts?.find(part => part.inlineData);
        if (imagePart?.inlineData) {
            const { mimeType, data } = imagePart.inlineData;
            return `data:${mimeType};base64,${data}`;
        }
    }

    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
        throw new Error(`Generation stopped: ${finishReason}`);
    }
    
    throw new Error("The AI model did not return an image. This can happen due to safety filters.");
};

// Initialize GoogleGenAI correctly using the process.env.API_KEY string
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image';

export const generateModelImage = async (userImage: File): Promise<string> => {
    const userImagePart = await fileToPart(userImage);
    const prompt = "You are a master bespoke tailor and fashion photographer. Transform the person in this image into a full-body luxury fashion model. The background must be a sophisticated, clean, neutral studio backdrop (#f8f8f8). Preserve the person's identity and body type perfectly. Place them in a standard, elegant standing model pose. Return ONLY the final image.";
    const response = await ai.models.generateContent({
        model,
        contents: { parts: [userImagePart, { text: prompt }] },
    });
    return handleApiResponse(response);
};

export const generateVirtualTryOnImage = async (
    modelImageUrl: string, 
    garmentSource: File | string, 
    target: 'shirt' | 'suit' = 'shirt'
): Promise<string> => {
    const modelImagePart = dataUrlToPart(modelImageUrl);
    const garmentImagePart = await sourceToPart(garmentSource);
    
    let targetPrompt = '';
    if (target === 'suit') {
        targetPrompt = `You are a virtual bespoke tailor for Michael Andrews. Apply the provided fabric texture to a full bespoke suit (jacket and trousers). The suit must be perfectly tailored to the model's body. Replicate the fabric's color, pattern, and weave precisely on both the jacket and trousers. The jacket should be worn over whatever is currently under it.`;
    } else {
        targetPrompt = `You are a virtual bespoke tailor for Michael Andrews. Apply the provided garment or fabric texture to a tailored shirt. The shirt must have natural folds, crisp collars, and follow the model's body shape perfectly. Replicate the color, pattern, and weave precisely.`;
    }

    const prompt = `${targetPrompt} 

**Bespoke Standards:**
- Impeccable fit and drape.
- High-quality textile rendering with realistic lighting.
- Preserve the model's identity, hair, pose, and background perfectly.
- Return ONLY the final, edited image.`;

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [modelImagePart, garmentImagePart, { text: prompt }] },
    });
    return handleApiResponse(response);
};

export const generatePoseVariation = async (tryOnImageUrl: string, poseInstruction: string): Promise<string> => {
    const tryOnImagePart = dataUrlToPart(tryOnImageUrl);
    const prompt = `Regenerate this image from a different perspective: "${poseInstruction}". The person, bespoke outfit, and background must remain perfectly consistent. Return ONLY the final image.`;
    const response = await ai.models.generateContent({
        model,
        contents: { parts: [tryOnImagePart, { text: prompt }] },
    });
    return handleApiResponse(response);
};
