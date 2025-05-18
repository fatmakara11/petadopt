// app/(tabs)/profile.jsx
import { useUser } from '@clerk/clerk-expo';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import { useClerk } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";

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

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Ionicons name="person-circle" size={100} color={Colors.PRIMARY} />
                <Text style={styles.name}>
                    {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                </Text>
                <Text style={styles.email}>{user?.emailAddresses[0]?.emailAddress}</Text>

                <TouchableOpacity onPress={handleSignOut} style={styles.button}>
                    <Text style={styles.buttonText}>Sign out</Text>
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
    profileContainer: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        fontSize: 24,
        fontFamily: 'outfit-bold',
        marginVertical: 10,
    },
    email: {
        fontSize: 16,
        fontFamily: 'outfit',
        color: Colors.GRAY,
        marginBottom: 30,
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: 'white',
        fontFamily: 'outfit-medium',
        fontSize: 16,
    }
});