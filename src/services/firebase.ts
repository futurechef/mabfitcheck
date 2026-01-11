import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously, type User } from 'firebase/auth';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc, getDoc, collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { getAnalytics, logEvent } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA5HFwQ3076x9pr_SCxKvjwheYrh_Y9ejA",
    authDomain: "mabsuit-479703.firebaseapp.com",
    projectId: "mabsuit-479703",
    storageBucket: "mabsuit-479703.firebasestorage.app",
    messagingSenderId: "1015942632756",
    appId: "1:1015942632756:web:b3dcb90b49461b3eb34161",
    measurementId: "G-DEVXF1PGLK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics
let analytics: any = null;
try {
    analytics = getAnalytics(app);
} catch (e) {
    console.warn("Analytics blocked or not supported");
}

export const trackEvent = (eventName: string, params?: object) => {
    if (analytics) {
        logEvent(analytics, eventName, params);
    }
    console.log(`[Analytics]: ${eventName}`, params);
};

// Authentication
export const signInWithGoogle = async (): Promise<User | null> => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        trackEvent('login', { method: 'google' });

        // Create user profile if it doesn't exist
        await ensureUserProfile(result.user);

        return result.user;
    } catch (error) {
        console.error("SSO Error:", error);
        return null;
    }
};

export const signInAsGuest = async (): Promise<User | null> => {
    try {
        const result = await signInAnonymously(auth);
        trackEvent('login', { method: 'guest' });

        // Create guest profile
        await ensureUserProfile(result.user, true);

        return result.user;
    } catch (error) {
        console.error("Guest Sign-in Error:", error);
        // Fallback: If anonymous auth fails (e.g. strict security), return null or throw.
        // For MAB demo, we really need this.
        return null;
    }
};

// User Profile Management
interface UserProfile {
    uid: string;
    displayName: string;
    email?: string;
    photoURL?: string;
    isGuest: boolean;
    createdAt: Timestamp;
    lastActive: Timestamp;
    measurements?: {
        chest?: string;
        waist?: string;
        inseam?: string;
        armLength?: string;
        shoulderWidth?: string;
    };
}

export const ensureUserProfile = async (user: User, isGuest: boolean = false): Promise<void> => {
    const userRef = doc(db, 'users', user.uid);
    try {
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            const profile: any = {
                uid: user.uid,
                displayName: isGuest ? `Guest ${user.uid.substring(0, 6)}` : (user.displayName || 'Client'),
                isGuest,
                createdAt: Timestamp.now(),
                lastActive: Timestamp.now()
            };

            if (user.email) profile.email = user.email;
            if (user.photoURL) profile.photoURL = user.photoURL;

            await setDoc(userRef, profile);
        } else {
            // Update last active
            await setDoc(userRef, { lastActive: Timestamp.now() }, { merge: true });
        }
    } catch (e) {
        console.error("Profile Error", e);
        // Proceed without profile sync if DB write fails (safety fallback)
    }
};

export const updateUserMeasurements = async (userId: string, measurements: any): Promise<void> => {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { measurements }, { merge: true });
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() as UserProfile : null;
};

// Storage - Save AI Generated Images
interface DesignMetadata {
    userId: string;
    designId: string;
    name: string;
    type: 'shirt' | 'suit' | 'both';
    createdAt: Timestamp;
    shirtConfig?: any;
    suitData?: any;
    measurements?: any;
}

export const saveDesignToFirebase = async (
    userId: string,
    imageData: string,
    metadata: Omit<DesignMetadata, 'userId' | 'createdAt'>
): Promise<string> => {
    try {
        let downloadURL = imageData;

        // Only upload if it's a data URL
        if (imageData.startsWith('data:')) {
            const imagePath = `users/${userId}/designs/${metadata.designId}.png`;
            const imageRef = ref(storage, imagePath);
            await uploadString(imageRef, imageData, 'data_url');
            downloadURL = await getDownloadURL(imageRef);
        }

        // Clean metadata of undefined values for Firestore
        const cleanMetadata = Object.fromEntries(
            Object.entries(metadata).filter(([_, v]) => v !== undefined)
        );

        // Save metadata to Firestore
        const designDoc = doc(db, 'users', userId, 'designs', metadata.designId);
        await setDoc(designDoc, {
            ...cleanMetadata,
            userId,
            imageUrl: downloadURL,
            createdAt: Timestamp.now()
        });

        trackEvent('design_saved', { userId, type: metadata.type });

        return downloadURL;
    } catch (error) {
        console.error("Error saving design:", error);
        throw error;
    }
};

// Retrieve user's designs
export const getUserDesigns = async (userId: string): Promise<any[]> => {
    try {
        const designsRef = collection(db, 'users', userId, 'designs');
        const q = query(designsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching designs:", error);
        return [];
    }
};

// Delete a design
export const deleteDesign = async (userId: string, designId: string): Promise<void> => {
    try {
        const designDoc = doc(db, 'users', userId, 'designs', designId);
        await setDoc(designDoc, { deleted: true }, { merge: true });
        trackEvent('design_deleted', { userId, designId });
    } catch (error) {
        console.error("Error deleting design:", error);
        throw error;
    }
};

// Toggle favorite
export const toggleDesignFavorite = async (userId: string, designId: string, isFavorite: boolean): Promise<void> => {
    try {
        const designDoc = doc(db, 'users', userId, 'designs', designId);
        await setDoc(designDoc, { isFavorite }, { merge: true });
    } catch (error) {
        console.error("Error toggling favorite:", error);
        throw error;
    }
};
