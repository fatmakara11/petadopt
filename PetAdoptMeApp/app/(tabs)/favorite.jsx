import { useUser } from '@clerk/clerk-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { db } from '../../config/FirabaseConfig'; // Yolunu senin yapına göre güncelle
import Shared from '../../Shared/Shared';
import PetListItem from '../components/PetListItem';

export default function Favorite() {
    const { user } = useUser();
    const [favIds, setFavIds] = useState([]);
    const [favPetList, setFavPetList] = useState([]);

    useEffect(() => {
        if (user) {
            GetFavPetIds();
        }
    }, [user]);

    // Kullanıcının favori hayvan ID'lerini getir
    const GetFavPetIds = async () => {
        const result = await Shared.GetFavList(user);
        const ids = result?.favorites || [];
        setFavIds(ids);

        if (ids.length > 0) {
            GetFavPetList(ids);
        } else {
            setFavPetList([]); // boş favori varsa listeyi temizle
        }
    };

    // Favori ID'lere karşılık gelen Pet'leri getir
    const GetFavPetList = async (ids) => {
        try {
            const q = query(collection(db, 'Pets'), where('id', 'in', ids));
            const querySnapshot = await getDocs(q);

            const petList = querySnapshot.docs.map((doc) => doc.data());
            setFavPetList(petList);
        } catch (error) {
            console.error("Favori hayvanlar alınırken hata:", error);
        }
    };

    return (
        <View style={{ padding: 20, marginTop: 20 }}>
            <Text style={{
                fontFamily: 'outfit-medium',
                fontSize: 30,
                marginBottom: 20,

            }}>
                Favoriler
            </Text>

            {favPetList.length === 0 ? (
                <Text style={{ fontFamily: 'outfit-regular', fontSize: 16 }}>
                    Favori hayvanınız bulunmamaktadır.
                </Text>
            ) : (
                <FlatList
                    data={favPetList}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <PetListItem pet={item} />
                    )}
                    keyExtractor={(item, index) => index.toString()} // ideal olarak item.id
                    contentContainerStyle={{ gap: 10 }}
                />
            )}
        </View>
    );
}
