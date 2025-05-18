import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Colors from '../colors';

const CategoryFilter = ({ onCategoryChange, selectedCategory }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = async () => {
        try {
            setLoading(true);
            const snapshot = await getDocs(collection(db, 'Category'));
            const categoryList = [];
            snapshot.forEach((doc) => {
                categoryList.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setCategories(categoryList);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = (categoryName) => {
        onCategoryChange(categoryName);
    };

    if (loading) {
        return <div className="loading-categories" style={{
            textAlign: 'center',
            padding: '20px',
            fontSize: '0.9rem',
            color: '#666'
        }}>
            <div className="spinner" style={{
                display: 'inline-block',
                width: '20px',
                height: '20px',
                border: '2px solid rgba(0,0,0,0.1)',
                borderRadius: '50%',
                borderTop: `2px solid ${Colors.PRIMARY}`,
                animation: 'spin 1s linear infinite',
                marginBottom: '10px'
            }}></div>
            <div>Loading categories...</div>
        </div>;
    }

    return (
        <div className="category-filter-sidebar">
            <div className="category-buttons" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`category-button ${selectedCategory === category.name ? 'selected' : ''}`}
                        onClick={() => handleCategorySelect(category.name)}
                        style={{
                            backgroundColor: selectedCategory === category.name ? Colors.PRIMARY : 'white',
                            color: selectedCategory === category.name ? 'white' : '#555',
                            border: `1px solid ${selectedCategory === category.name ? Colors.PRIMARY : '#e0e0e0'}`,
                            padding: '12px 15px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            transition: 'all 0.2s ease',
                            fontSize: '1rem',
                            boxShadow: selectedCategory === category.name ? '0 4px 8px rgba(0,0,0,0.1)' : 'none',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {getCategoryIcon(category.name)}
                            {category.name}
                        </span>

                        {selectedCategory === category.name && (
                            <span style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: 'white'
                            }}></span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Helper function to get category icons
const getCategoryIcon = (categoryName) => {
    switch (categoryName.toLowerCase()) {
        case 'cats':
            return '🐱';
        case 'dogs':
            return '🐶';
        case 'birds':
            return '🦜';
        case 'fish':
            return '🐠';
        case 'rabbits':
            return '🐰';
        case 'reptiles':
            return '🦎';
        case 'hamsters':
            return '🐹';
        default:
            return '🐾';
    }
};

export default CategoryFilter; 