import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../../constants/Colors';

export default function AdoptButton() {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactButtonText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adoptButton}>
                <Text style={styles.adoptButtonText}>Adopt Me</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        marginBottom: 20
    },
    contactButton: {
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
        borderRadius: 10,
        padding: 15,
        flex: 1,
        alignItems: 'center'
    },
    contactButtonText: {
        fontFamily: 'outfit-medium',
        color: Colors.PRIMARY,
        fontSize: 16
    },
    adoptButton: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: 10,
        padding: 15,
        flex: 1,
        alignItems: 'center'
    },
    adoptButtonText: {
        fontFamily: 'outfit-medium',
        color: Colors.WHITE,
        fontSize: 16
    }
}); 