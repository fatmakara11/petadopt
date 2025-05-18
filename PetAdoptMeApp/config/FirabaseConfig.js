import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { useEffect, useState } from 'react';

// Firebase config
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: "pet-adopt-63663.firebaseapp.com",
    projectId: "pet-adopt-63663",
    storageBucket: "pet-adopt-63663.firebasestorage.app",
    messagingSenderId: "738692540551",
    appId: "1:738692540551:web:2953095d6cdacf75443022"
};

let db, storage;

try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app); //  Firebase Storage başlatıldı
} catch (error) {
    console.error("Error initializing Firebase:", error);
    db = { _errorMessage: "Firebase initialization failed" };
    storage = null;
}

export { db, storage };


// Hook to fetch slider data from Firestore
export const useSliderLister = () => {
    const [sliderData, setSliderData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSliders = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log("Starting to fetch sliders from Firestore...");

                // Check if db is properly initialized
                if (!db || db._errorMessage) {
                    throw new Error("Firebase database not properly initialized");
                }

                // Make sure your collection name matches exactly what's in Firebase console
                const sliderCollection = collection(db, 'Slider');
                console.log("Slider collection reference created");

                const snapshot = await getDocs(sliderCollection);
                console.log("Got snapshot with", snapshot.size, "documents");

                if (snapshot.empty) {
                    console.log("No slider documents found in collection");
                }

                const sliders = [];
                snapshot.forEach((doc) => {
                    console.log("Document data:", JSON.stringify(doc.data()));
                    sliders.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                setSliderData(sliders);
                console.log("Fetched slider data:", sliders);
            } catch (error) {
                console.error("Error fetching sliders:", error);
                setError(error.message || "Failed to fetch slider data");
            } finally {
                setLoading(false);
            }
        };

        fetchSliders();
    }, []);

    return { sliderData, loading, error };
};