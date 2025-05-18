import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from '../config/FirabaseConfig';

export const GetFavList = async (user) => {
    const email = user?.primaryEmailAddress?.emailAddress;

    // Email değeri yoksa güvenli bir şekilde ele alalım
    if (!email) {
        console.error("Kullanıcı email adresi bulunamadı");
        return { favorites: [] };
    }

    const docRef = doc(db, 'UserFavPet', email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        const newData = {
            email: email,
            favorites: []
        };
        await setDoc(docRef, newData);
        return newData;
    }
};

const UpdateFav = async (user, favorites) => {
    const email = user?.primaryEmailAddress?.emailAddress;

    // Email değeri yoksa güvenli bir şekilde ele alalım
    if (!email) {
        console.error("Kullanıcı email adresi bulunamadı, favoriler kaydedilemedi");
        return;
    }

    const docRef = doc(db, 'UserFavPet', email);
    try {
        await updateDoc(docRef, {
            favorites: favorites
        });
    } catch (e) {
        console.error("Favoriler güncellenirken hata oluştu:", e);
    }
};

export default {
    GetFavList,
    UpdateFav
};
