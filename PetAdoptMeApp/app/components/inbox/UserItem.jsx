import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../../constants/Colors';

export default function UserItem({ userInfo }) {
    console.log("UserItem received:", userInfo);
    const router = useRouter();

    if (!userInfo) {
        return (
            <View style={styles.emptyItem}>
                <Text>Invalid user data</Text>
            </View>
        );
    }

    const navigateToChat = () => {
        console.log("Navigating to chat with ID:", userInfo.docId);
        if (userInfo.docId) {
            router.push({
                pathname: '/chat',
                params: { id: userInfo.docId }
            });
        } else {
            console.error("No chat ID available");
        }
    };

    // Get initials if no profile image
    const getInitials = () => {
        if (!userInfo.name) return "?";
        return userInfo.name.split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Format email to show only the username part before @
    const formatEmail = (email) => {
        if (!email) return '';
        const parts = email.split('@');
        return parts[0];
    };

    return (
        <TouchableOpacity style={styles.container} onPress={navigateToChat} activeOpacity={0.7}>
            <View style={styles.content}>
                {userInfo.imageUrl ? (
                    <Image
                        source={{ uri: userInfo.imageUrl }}
                        style={styles.avatar}
                    />
                ) : (
                    <View style={styles.initialsContainer}>
                        <Text style={styles.initials}>{getInitials()}</Text>
                    </View>
                )}

                <View style={styles.userInfo}>
                    <Text style={styles.name}>{userInfo?.name || formatEmail(userInfo?.email) || 'Unknown User'}</Text>
                </View>

                <Ionicons name="chevron-forward" size={22} color="#ccc" />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emptyItem: {
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        margin: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    initialsContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    userInfo: {
        flex: 1,
        marginLeft: 15,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    }
});