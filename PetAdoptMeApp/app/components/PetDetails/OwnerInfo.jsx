import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Colors from '../../../constants/Colors';

export default function OwnerInfo({ pet }) {
    return (
        <View style={styles.container}>


            <View style={styles.ownerCard}>
                <Image
                    source={{ uri: pet.userImage }}
                    style={styles.ownerImage}
                />
                <View style={styles.ownerInfo}>
                    <Text style={styles.ownerName}>{pet.userName}</Text>
                    <Text style={styles.ownerLabel}>Pet Owner</Text>
                </View>

                <Ionicons name="send-sharp" size={24} color={Colors.PRIMARY} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    heading: {
        fontSize: 18,
        fontFamily: 'outfit-medium',
        marginBottom: 8,
        fontWeight: 'bold'
    },
    description: {
        color: Colors.GRAY,
        fontSize: 14,
        fontFamily: 'outfit-regular',
        lineHeight: 20,
        marginBottom: 4
    },
    readMore: {
        color: Colors.PRIMARY,
        fontSize: 14,
        fontFamily: 'outfit-medium',
    },
    ownerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: '#EEEEEE',
        padding: 15,
        backgroundColor: Colors.WHITE,
        marginBottom: 20
    },
    ownerImage: {
        width: 45,
        height: 45,
        borderRadius: 25
    },
    ownerInfo: {
        flex: 1,
        marginLeft: 15
    },
    ownerName: {
        fontSize: 16,
        fontFamily: 'outfit-medium',
        fontWeight: '500'
    },
    ownerLabel: {
        fontSize: 14,
        color: Colors.GRAY,
        fontFamily: 'outfit-regular'
    }
}); 