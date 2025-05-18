import React from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSliderLister } from '../../config/FirabaseConfig';
import Colors from '../../constants/Colors';

export default function Slider() {
    const { sliderData, loading, error } = useSliderLister();

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load slider images</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {sliderData.length > 0 ? (
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    {sliderData.map((item, index) => (
                        <View key={item.id || index}>
                            <Image
                                source={{ uri: item?.imageUrl }}
                                style={styles.sliderImage}
                            />
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <Text style={styles.noDataText}>No slider images available</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        marginBottom: 10,
    },
    loadingContainer: {
        height: 170,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        height: 170,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    noDataText: {
        textAlign: 'center',
        fontSize: 16,
        marginVertical: 20,
    },
    sliderImage: {
        width: Dimensions.get('screen').width * 0.99,
        height: 150,
        borderRadius: 15,
        marginRight: 15
    }
})