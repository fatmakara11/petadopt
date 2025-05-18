import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';
import OwnerInfo from '../components/PetDetails/OwnerInfo';
import PetInfo from '../components/PetDetails/PetInfo';
import PetSubInfo from '../components/PetDetails/PetSubInfo';

export default function PetDetails() {
    const router = useRouter();
    const pet = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            <ScrollView style={styles.scrollView}>
                {/* Pet Info */}
                <PetInfo pet={pet} />

                {/* Pet Sub Info*/}
                <PetSubInfo pet={pet} />

                {/* Owner details */}
                <OwnerInfo pet={pet} />

                {/* Extra space at bottom for scrolling past the fixed button */}
                <View style={{ height: 100 }}></View>
            </ScrollView>

            {/* Custom back button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push('/(tabs)')}
            >
                <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>

            {/* Adopt me button - fixed at bottom */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.adoptButton}>
                    <Text style={styles.adoptButtonText}>Adopt Me</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    scrollView: {
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.PRIMARY,
    },
    adoptButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
    adoptButtonText: {
        textAlign: 'center',
        fontFamily: 'outfit-medium',
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.WHITE,
    }
});