import { Stack } from 'expo-router';
import Colors from '../../constants/Colors';

export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerTransparent: true,
                headerTitle: '',
                headerTintColor: Colors.PRIMARY,
                headerBackVisible: true,
                headerShadowVisible: false,
                headerBackTitle: 'Home',
            }}
        />
    );
} 