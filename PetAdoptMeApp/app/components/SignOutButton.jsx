import { useClerk } from '@clerk/clerk-expo'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'
import { useRouter } from 'expo-router'

export default function SignOutButton() {
    // Use `useClerk()` to access the `signOut()` function
    const { signOut } = useClerk()
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut()
            router.replace('/login')
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
        }
    }

    return (
        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
            <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.PRIMARY,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
        width: '100%',
    },
    buttonText: {
        color: 'white',
        fontFamily: 'outfit-medium',
        fontSize: 16,
    }
}); 