import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import PetCard from './PetCard';
import CategoryFilter from './CategoryFilter';

// Mobil uygulamadaki PetListByCategory bileşenine benzer bir bileşen
const PetListByCategory = () => {
    const [petList, setPetList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Cats');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPetList(selectedCategory);
    }, [selectedCategory]);

    const getPetList = async (category) => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div className="pet-list-by-category">
            <CategoryFilter onCategoryChange={handleCategoryChange} selectedCategory={selectedCategory} />

            {loading ? (
                <div className="loading">Loading pets...</div>
            ) : (
                <div className="pet-list">
                    {petList.length === 0 ? (
                        <div className="no-pets">No pets found in this category</div>
                    ) : (
                        <div className="pet-cards">
                            {petList.map((pet) => (
                                <PetCard key={pet.id} pet={pet} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PetListByCategory; 