import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const FavoriteButton = ({ pet, color = 'black' }) => {
    const { user, isLoaded } = useUser();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (isLoaded && user) {
            getFavStatus();
        }
    }, [isLoaded, user, pet?.id]);

    const getFavStatus = async () => {
        try {
            const email = user?.primaryEmailAddress?.emailAddress;

            if (!email) {
                console.error("Kullanıcı email adresi bulunamadı");
                return;
            }

            const docRef = doc(db, 'UserFavPet', email);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const { favorites } = docSnap.data();
                setIsFavorite(favorites.includes(pet?.id));
            } else {
                // Doküman yoksa oluştur
                await updateDoc(docRef, {
                    email: email,
                    favorites: []
                });
                setIsFavorite(false);
            }
        } catch (error) {
            console.error("Favorileri kontrol ederken hata:", error);
        }
    };

    const toggleFavorite = async () => {
        try {
            const email = user?.primaryEmailAddress?.emailAddress;

            if (!email) {
                console.error("Kullanıcı email adresi bulunamadı");
                return;
            }

            const docRef = doc(db, 'UserFavPet', email);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const { favorites } = docSnap.data();
                let newFavorites;

                if (favorites.includes(pet?.id)) {
                    // Favorilerden çıkar
                    newFavorites = favorites.filter(id => id !== pet?.id);
                } else {
                    // Favorilere ekle
                    newFavorites = [...favorites, pet?.id];
                }

                await updateDoc(docRef, { favorites: newFavorites });
                setIsFavorite(!isFavorite);
            } else {
                // Doküman yoksa oluştur ve favorilere ekle
                await updateDoc(docRef, {
                    email: email,
                    favorites: [pet?.id]
                });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error("Favorilere eklerken/çıkarırken hata:", error);
        }
    };

    if (!isLoaded || !pet) {
        return null;
    }

    return (
        <button
            onClick={toggleFavorite}
            className="favorite-button"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
            {isFavorite ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#E8B20E" stroke="none">
                    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                </svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                </svg>
            )}
        </button>
    );
};

export default FavoriteButton; 