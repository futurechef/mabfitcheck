
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ClothingTarget } from "../types";

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
 */
const urlToPart = async (url: string) => {
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
        return await fetchImage(url);
    } catch (err) {
        try {
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
            return await fetchImage(proxyUrl);
        } catch (proxyErr) {
            throw new Error(
                `Image Load Failure: Could not access image at ${url}. Please try a local file.`
            );
        }
    }
};

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
    const candidate = response.candidates?.[0];
    if (!candidate) throw new Error("No candidates returned from AI.");

    for (const part of candidate.content?.parts ?? []) {
        if (part.inlineData) {
            const { mimeType, data } = part.inlineData;
            return `data:${mimeType};base64,${data}`;
        }
    }

    const finishReason = candidate.finishReason;
    if (finishReason && finishReason !== 'STOP') {
        throw new Error(`Generation stopped: ${finishReason}`);
    }
    
    throw new Error("The AI model did not return an image. This can happen due to safety filters or instruction complexity.");
};

// Use the high-quality Gemini 3 Pro Image model
const MODEL_NAME = 'gemini-3-pro-image-preview';

export const generateModelImage = async (userImage: File): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const userImagePart = await fileToPart(userImage);
    const prompt = "Act as a high-end fashion photographer and bespoke digital tailor. Re-render the person in this photo into a full-body model image. Background: minimalist light grey studio. Pose: Professional standing posture. Ensure identity, hair texture, and anatomical proportions are perfectly preserved. Return ONLY the high-resolution image.";
    
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: { parts: [userImagePart, { text: prompt }] },
        config: {
            imageConfig: {
                aspectRatio: "1:1",
                imageSize: "1K"
            }
        }
    });
    return handleApiResponse(response);
};

export const generateVirtualTryOnImage = async (
    modelImageUrl: string, 
    garmentSource: File | string, 
    target: ClothingTarget = 'shirt'
): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelImagePart = dataUrlToPart(modelImageUrl);
    const garmentImagePart = await sourceToPart(garmentSource);
    
    let instructions = '';
    switch (target) {
        case 'jacket':
            instructions = "Carefully add or replace ONLY the suit jacket with the provided fabric/garment. Keep the existing shirt and trousers perfectly intact. Ensure the jacket's drape and tailoring are world-class, matching the model's build.";
            break;
        case 'trousers':
            instructions = "Replace ONLY the trousers with the provided fabric/garment. Keep the existing jacket (if any) and shirt perfectly intact. Ensure the trouser break and crease are professionally rendered.";
            break;
        case 'suit':
            instructions = "Expertly tailor a full bespoke suit (BOTH jacket and trousers) using the provided fabric/garment. The fit must be sharp and the pattern must be perfectly aligned across all seams.";
            break;
        default: // shirt
            instructions = "Tailor a crisp bespoke shirt using the provided fabric/garment. If a jacket is currently worn, show the shirt details through the opening and at the cuffs. Maintain realistic collar stiffness.";
            break;
    }

    const prompt = `Michael Andrews Atelier Virtual Try-On.
    Model: [Model Image Provided]
    Target Article: ${target.toUpperCase()}
    Fabric/Garment Source: [Source Provided]
    
    ${instructions}
    
    Requirements:
    - Absolutely preserve model identity and existing background.
    - Photorealistic rendering of textile weight and drape.
    - High-end bespoke tailoring standards only.
    - Return ONLY the final composite image.`;

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: { parts: [modelImagePart, garmentImagePart, { text: prompt }] },
        config: {
            imageConfig: {
                aspectRatio: "1:1",
                imageSize: "1K"
            }
        }
    });
    return handleApiResponse(response);
};

export const generateJacketRemovalImage = async (modelImageUrl: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelImagePart = dataUrlToPart(modelImageUrl);
    
    const prompt = "Michael Andrews Atelier. DIGITAL DE-LAYERING. Please remove the outermost suit jacket from the model in this image. Show the bespoke shirt and trousers that were underneath. Ensure the shirt fit is perfectly rendered where it was previously covered by the jacket. Maintain the same background and model identity. Return ONLY the re-rendered image.";

    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: { parts: [modelImagePart, { text: prompt }] },
        config: {
            imageConfig: {
                aspectRatio: "1:1",
                imageSize: "1K"
            }
        }
    });
    return handleApiResponse(response);
};

export const generatePoseVariation = async (tryOnImageUrl: string, poseInstruction: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const tryOnImagePart = dataUrlToPart(tryOnImageUrl);
    const prompt = `Anatomical Re-rendering. 
    Maintain identity, background, and the exact bespoke outfit from the reference image.
    Adjust the person's pose to: "${poseInstruction}".
    The fabric drape must react naturally to the new body position. 
    Return ONLY the final high-quality image.`;
    
    const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: { parts: [tryOnImagePart, { text: prompt }] },
        config: {
            imageConfig: {
                aspectRatio: "1:1",
                imageSize: "1K"
            }
        }
    });
    return handleApiResponse(response);
};
