import { useUser } from '@clerk/clerk-react';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Shared from '../../Shared/Shared';

export default function MarkFav({ pet, color = 'black' }) {
    const { user } = useUser();
    const [favList, setFavList] = useState([]);

    useEffect(() => {
        if (user) {
            GetFav();
        }
    }, [user]);

    const GetFav = async () => {
        const result = await Shared.GetFavList(user);
        setFavList(result?.favorites || []);
    };

    const AddToFav = async () => {
        if (!favList.includes(pet.id)) {
            const updatedFavs = [...favList, pet.id];
            await Shared.UpdateFav(user, updatedFavs);
            GetFav();
        }
    };
    const removeFromFav = async () => {
        if (favList.includes(pet.id)) {
            const updatedFavs = favList.filter(id => id !== pet.id); // pet.id'yi çıkar
            await Shared.UpdateFav(user, updatedFavs); // güncellenmiş listeyi kaydet
            GetFav(); // yeniden fetch et ve state'i güncelle
        }
    };
    return (
        <View>
            {favList.includes(pet.id) ? (
                <Pressable onPress={removeFromFav}>
                    <Ionicons name="heart" size={30} color="red" />
                </Pressable>
            ) : (
                <Pressable onPress={AddToFav}>
                    <Ionicons name="heart-outline" size={30} color={color} />
                </Pressable>
            )}
        </View>
    );
}
