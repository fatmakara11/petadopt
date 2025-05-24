// app/(tabs)/profile.jsx
import { useClerk, useUser } from '@clerk/clerk-expo';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/Colors';

export default function ProfileTab() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.replace('/login');
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        }
    };

    // Function to get user initials for avatar
    const getUserInitials = () => {
        if (!user) return "?";

        const name = user.firstName || user.emailAddresses[0]?.emailAddress || "";
        return name.charAt(0).toUpperCase();
    };

    const navigateToAddNewPet = () => {
        try {
            console.log("Navigating to Add New Pet screen");
            router.push("/add-new-pet");
        } catch (error) {
            console.error("Navigation error:", error);
        }
    };

    // Menu items configuration
    const menuItems = [
        {
            id: 1,
            icon: "add-circle",
            label: "Add New Pet",
            color: Colors.PRIMARY,
            onPress: navigateToAddNewPet
        },
        {
            id: 2,
            icon: "bookmark",
            label: "My Post",
            color: Colors.PRIMARY,
            onPress: () => router.push('/user-post')
        },
        {
            id: 3,
            icon: "heart",
            label: "Favorites",
            color: Colors.PRIMARY,
            onPress: () => router.push('/(tabs)/favorite')
        },
        {
            id: 4,
            icon: "chatbubble",
            label: "Inbox",
            color: Colors.PRIMARY,
            onPress: () => router.push('/(tabs)/inbox')
        },
        {
            id: 5,
            icon: "log-out",
            label: "Logout",
            color: Colors.PRIMARY,
            onPress: handleSignOut
        }
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                    {user?.imageUrl ? (
                        <Image
                            source={{ uri: user.imageUrl }}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={styles.initialsAvatar}>
                            <Text style={styles.initialsText}>{getUserInitials()}</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.userName}>
                    {user?.firstName || user?.emailAddresses[0]?.emailAddress.split('@')[0]}
                </Text>

                <Text style={styles.userEmail}>
                    {user?.emailAddresses[0]?.emailAddress}
                </Text>
            </View>

            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={item.onPress}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                            <Ionicons name={item.icon} size={24} color={item.color} />
                        </View>
                        <Text style={styles.menuItemText}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    profileHeader: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 30,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatarContainer: {
        marginBottom: 15,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    initialsAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#00634a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialsText: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 14,
        color: '#888',
    },
    menuContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '500',
    }
});