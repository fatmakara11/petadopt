import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import PetCard from './PetCard';
import CategoryFilter from './CategoryFilter';
import Colors from '../colors';

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
        <div className="pet-list-by-category" style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px'
        }}>
            <div className="pet-list-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '40px',
                borderBottom: '1px solid #eee',
                paddingBottom: '20px'
            }}>
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#333',
                    margin: 0,
                    position: 'relative'
                }}>
                    Available Pets
                    <span style={{
                        display: 'block',
                        width: '60px',
                        height: '3px',
                        backgroundColor: Colors.PRIMARY,
                        marginTop: '10px'
                    }}></span>
                </h2>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: Colors.GRAY
                }}>
                    <span>Found {petList.length} pets</span>
                </div>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '30px',
                alignItems: 'flex-start'
            }}>
                {/* Sidebar with CategoryFilter */}
                <div className="sidebar" style={{
                    flex: '0 0 250px',
                    position: 'sticky',
                    top: '100px',
                    backgroundColor: 'white',
                    padding: '25px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                }}>
                    <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: '600',
                        marginTop: 0,
                        marginBottom: '20px',
                        borderBottom: '1px solid #eee',
                        paddingBottom: '10px',
                        position: 'relative'
                    }}>
                        Filter by Category
                        <span style={{
                            position: 'absolute',
                            bottom: -1,
                            left: 0,
                            width: '40px',
                            height: '3px',
                            backgroundColor: Colors.PRIMARY
                        }}></span>
                    </h3>

                    <CategoryFilter
                        onCategoryChange={handleCategoryChange}
                        selectedCategory={selectedCategory}
                    />
                </div>

                {/* Main content area with pet cards */}
                <div className="main-content" style={{ flex: 1 }}>
                    {loading ? (
                        <div className="loading" style={{
                            textAlign: 'center',
                            padding: '80px 40px',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                            color: '#666'
                        }}>
                            <div className="spinner" style={{
                                display: 'inline-block',
                                width: '40px',
                                height: '40px',
                                border: '4px solid rgba(0,0,0,0.1)',
                                borderRadius: '50%',
                                borderTop: `4px solid ${Colors.PRIMARY}`,
                                animation: 'spin 1s linear infinite',
                                marginBottom: '20px'
                            }}></div>
                            <div style={{ fontSize: '1.2rem' }}>Loading pets...</div>
                        </div>
                    ) : (
                        <div className="pet-list">
                            {petList.length === 0 ? (
                                <div className="no-pets" style={{
                                    textAlign: 'center',
                                    padding: '60px 40px',
                                    backgroundColor: 'white',
                                    borderRadius: '10px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                                    color: '#666'
                                }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🐾</div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#444' }}>
                                        No pets found in {selectedCategory} category
                                    </h3>
                                    <p style={{ fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
                                        We don't have any {selectedCategory.toLowerCase()} available for adoption at the moment.
                                        Please check back later or browse another category.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <h3 style={{
                                        fontSize: '1.3rem',
                                        fontWeight: '600',
                                        marginTop: 0,
                                        marginBottom: '25px',
                                        color: '#555'
                                    }}>
                                        {selectedCategory} Available for Adoption
                                    </h3>

                                    <div className="pet-cards" style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                        gap: '30px',
                                        alignItems: 'stretch'
                                    }}>
                                        {petList.map((pet) => (
                                            <PetCard key={pet.id} pet={pet} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PetListByCategory; 