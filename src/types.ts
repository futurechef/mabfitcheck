import { Timestamp } from 'firebase/firestore';

export interface SuitData {
    id: string;
    name: string;
    category: string;
    description: string;
    imageUrl: string;
    promptDescription: string;
    color: string;
    colorHex: string;
    pattern: string;
    fabricType: string;
    fabricMill: string;
    weight: string;
    price: string;
    productionTime: string;
    productionType: 'Bespoke' | 'Made-to-Measure';
    buttonCount: number;
    lapelStyle: string;
    shoulderCut: string;
    productUrl: string;
}

export interface ShirtData {
    id: string;
    name: string;
    category: 'Dress Shirts' | 'Business Casual' | 'Formal' | 'Sport';
    description: string;
    imageUrl: string;
    promptDescription: string;
    baseColor: string;
    colorHex: string;
    pattern: string;
    fabricType: string;
    fabricMill: string;
    weight: string;
    price: string;
    productionTime: string;
    productionType: 'Bespoke' | 'Made-to-Measure';
    collarStyle: string;
    cuffStyle: string;
    frontStyle: string;
    productUrl: string;
    compatibleFabricIds?: string[]; // Links to specific fabric swatches
}

export interface UserMeasurements {
    chest?: string;
    waist?: string;
    inseam?: string;
    armLength?: string;
    shoulderWidth?: string;
}

export interface UserProfile {
    uid: string;
    displayName: string;
    email?: string;
    photoURL?: string;
    isGuest: boolean;
    createdAt: Timestamp;
    lastActive: Timestamp;
    measurements?: UserMeasurements;
}

export interface PhotoValidationResult {
    lighting: { score: number; feedback: string };
    pose: { score: number; feedback: string };
    background: { score: number; feedback: string };
    overall: { ready: boolean; message: string };
}

export interface ShirtStyle {
    collar: string;
    front: string;
    cuff: string;
    back: string;
}

export interface FabricSwatch {
    id: string;
    name: string;
    mill: string;
    imageUrl: string;
    colorHex: string;
    pattern: string;
    weight: string;
}

export interface ShirtConfiguration {
    style: ShirtStyle;
    fabric: FabricSwatch;
}

export interface WardrobeItem {
    id: string;
    userId: string;
    name: string;
    type: 'shirt' | 'suit' | 'both';
    imageUrl: string;
    createdAt: Timestamp;
    shirtConfig?: ShirtConfiguration;
    suitData?: SuitData;
    measurements?: UserMeasurements;
    isFavorite?: boolean;
    deleted?: boolean;
}

export type AppStep =
    | 'HERO'
    | 'CAPTURE'
    | 'VALIDATION_FEEDBACK'
    | 'MEASUREMENTS'
    | 'SELECT_GARMENT_TYPE'
    | 'SELECT_SHIRT'           // New: Browse shirt products
    | 'SELECT_SHIRT_STYLE'     // Custom: Choose collar/cuff/style
    | 'SELECT_SHIRT_FABRIC'    // Custom: Choose fabric
    | 'SELECT_SUIT'
    | 'PROCESSING'
    | 'RESULT';

export type GarmentType = 'shirt' | 'suit' | 'both';
