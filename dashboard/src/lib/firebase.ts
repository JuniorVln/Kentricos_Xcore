import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, limit, startAfter, QueryDocumentSnapshot } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Types — espelha o schema real do Firestore (coleção: results)
export interface PersonalData {
    fullName?: string;
    email?: string;
    whatsapp?: string;
    company?: string;
    sector?: string;
    maturityLevel?: string;
    employeeQuantity?: string;
    receiveContent?: boolean;
    privacyPolicy?: boolean;
    [key: string]: any;
}

export interface AssessmentScore {
    totalScore: number;
    scoresByPillar: Record<string, number>;
}

export interface Assessment {
    id: string;
    createdAt?: Date;
    personalData: PersonalData;
    assessmentScore: AssessmentScore;
}

// Data Access Layer (Global)
export const api = {
    async getAllAssessments(limitCount = 50, lastDoc?: QueryDocumentSnapshot) {
        try {
            const colRef = collection(db, 'results'); // nome real da coleção no Firestore
            let q = query(colRef, limit(limitCount));

            // If we had a timestamp, we would order by it. Assuming 'data' string is not sortable easily.
            // Trying to fetch without specific sort first to avoid index errors.

            if (lastDoc) {
                q = query(colRef, limit(limitCount), startAfter(lastDoc));
            }

            console.log('🔥 Fetching assessments...');
            const snapshot = await getDocs(q);

            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Assessment[];

            console.log(`🔥 Fetched ${data.length} docs`);
            return { data, lastDoc: snapshot.docs[snapshot.docs.length - 1] };
        } catch (error) {
            console.error("🔥 Firestore Error:", error);
            // Fallback for demo/empty state
            return { data: [], lastDoc: undefined, error };
        }
    }
};
