import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import { db } from './../../config/FirabaseConfig';

export default function Category({ category }) {
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Cats');

    useEffect(() => {
        GetCategories();
    }, []);

    useEffect(() => {
        if (category) {
            category(selectedCategory);
        }
    }, [selectedCategory, category]);

    // categorylist için database kullanıldı
    const GetCategories = async () => {
        try {
            setCategoryList([]);
            const snapshot = await getDocs(collection(db, 'Category'));
            const categories = [];
            snapshot.forEach((doc) => {
                categories.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setCategoryList(categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleCategorySelect = (categoryName) => {
        setSelectedCategory(categoryName);
    };

    return (
        <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: 'outfit-medium', fontSize: 20 }}>
                Category
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
                {categoryList.map((item, index) => (
                    <TouchableOpacity
                        key={item.id || index}
                        onPress={() => handleCategorySelect(item.name)}
                        style={styles.categoryItem}>
                        <View style={[styles.container,
                        selectedCategory === item.name && styles.selectedCategoryContainer
                        ]}>
                            <Image
                                source={{ uri: item?.imageUrl }}
                                style={{
                                    width: 40,
                                    height: 40
                                }}
                            />
                        </View>
                        <Text style={{
                            textAlign: 'center',
                            fontFamily: 'outfit'
                        }}>{item?.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    scrollContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    categoryItem: {
        marginRight: 15,
        alignItems: 'center',
    },
    container: {
        backgroundColor: Colors.LIGHT_PRIMARY,
        padding: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Colors.PRIMARY,
        margin: 5

    },
    selectedCategoryContainer: {
        backgroundColor: Colors.SECONDARY,
        borderColor: Colors.SECONDARY
    }

})