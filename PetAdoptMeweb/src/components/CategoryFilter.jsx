import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Colors from '../colors';

// Helper function to get icon and color based on category name
const getCategoryIconAndColor = (categoryName) => {
    const category = categoryName.toLowerCase();

    // Icons and colors for different categories
    if (category.includes('cat')) {
        return {
            icon: '🐱',
            color: '#FF9671' // Orange-red
        };
    } else if (category.includes('dog')) {
        return {
            icon: '🐶',
            color: '#FFC75F' // Yellow
        };
    } else if (category.includes('bird')) {
        return {
            icon: '🦜',
            color: '#9FD8CB' // Teal
        };
    } else if (category.includes('fish')) {
        return {
            icon: '🐠',
            color: '#748DA6' // Blue-gray
        };

    } else {
        return {
            icon: '🐾',
            color: '#8E7AB5' // Purple
        };
    }
};

// Mobil uygulamadaki Category bileşenine benzer bir bileşen
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
        return <div className="loading-categories" style={{ textAlign: 'center', padding: '20px' }}>Loading categories...</div>;
    }

    return (
        <div className="category-filter" style={{
            marginBottom: '30px'
        }}>
            <h2 style={{
                fontSize: '24px',
                marginBottom: '20px',
                color: Colors.PRIMARY,
                fontWeight: 'bold',
                textAlign: 'left'
            }}>Categories</h2>

            <div className="category-buttons" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                width: '100%'
            }}>
                {categories.map((category) => {
                    const { icon, color } = getCategoryIconAndColor(category.name);
                    const isSelected = selectedCategory === category.name;

                    return (
                        <button
                            key={category.id}
                            className={`category-button ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleCategorySelect(category.name)}
                            style={{
                                backgroundColor: isSelected ? color : 'white',
                                color: isSelected ? 'white' : '#333',
                                border: `2px solid ${color}`,
                                padding: '15px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                gap: '10px',
                                boxShadow: isSelected ? `0 4px 8px rgba(0,0,0,0.1)` : 'none',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span style={{
                                fontSize: '24px',
                                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : color,
                                color: isSelected ? 'white' : 'white',
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {icon}
                            </span>
                            <span>{category.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryFilter; 