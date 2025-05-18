import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { db } from '../../config/FirabaseConfig'
import Category from './Category'
import PetListItem from './PetListItem'

export default function PetListByCategory() {
    const [petList, setPetList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Cats');

    useEffect(() => {
        getPetList(selectedCategory);
    }, [selectedCategory]);

    const getPetList = async (category) => {
        try {
            setPetList([]);
            const q = query(collection(db, 'Pets'), where('category', '==', category));
            const querySnapshot = await getDocs(q);
            const newPetList = [];
            querySnapshot.forEach(doc => {
                newPetList.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setPetList(newPetList);
        } catch (error) {
            console.error("Error fetching pets:", error);
        }
    }

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    return (
        <View>
            <Category category={handleCategoryChange} />
            <View style={{ marginTop: 10 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {petList.map((item, index) => (
                        <PetListItem key={index} pet={item} />
                    ))}
                </ScrollView>
            </View>
        </View>
    )
}