import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { useState, useEffect } from 'react';

// Firebase config - Mobil uygulama ile aynı config kullanılıyor
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: "pet-adopt-63663.firebaseapp.com",
    projectId: "pet-adopt-63663",
    storageBucket: "pet-adopt-63663.firebasestorage.app",
    messagingSenderId: "738692540551",
    appId: "1:738692540551:web:2953095d6cdacf75443022"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Firestore ve Storage servislerini başlat
export const db = getFirestore(app);
export const storage = getStorage(app);

// Slider verilerini çekmek için hook
export const useSliderData = () => {
    const [sliderData, setSliderData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSliders = async () => {
            try {
                setLoading(true);
                setError(null);

                // Slider koleksiyonunu çek
                const sliderCollection = collection(db, 'Slider');
                const snapshot = await getDocs(sliderCollection);

                if (snapshot.empty) {
                    console.log("No slider documents found");
                }

                const sliders = [];
                snapshot.forEach((doc) => {
                    sliders.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                setSliderData(sliders);
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

// Evcil hayvan verilerini çekmek için hook
export const usePetsData = () => {
    const [petsData, setPetsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log("Fetching pets data...");

                // Evcil hayvan koleksiyonunu çek
                const petsCollection = collection(db, 'Pets');
                const snapshot = await getDocs(petsCollection);

                if (snapshot.empty) {
                    console.log("No pets documents found");
                } else {
                    console.log(`Found ${snapshot.size} pets`);
                }

                const pets = [];
                snapshot.forEach((doc) => {
                    console.log("Pet data:", doc.id, doc.data());
                    pets.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                setPetsData(pets);
            } catch (error) {
                console.error("Error fetching pets:", error);
                setError(error.message || "Failed to fetch pets data");
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, []);

    return { petsData, loading, error };
}; 