// app/(tabs)/_layout.jsx
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import Colors from "../../constants/Colors";

export default function TabsLayout() {
    const { isSignedIn, isLoaded } = useAuth();
    const router = useRouter();

    // Auth kontrolünü katı bir şekilde uygula
    useEffect(() => {
        // Eğer veriler yüklendiyse ve kullanıcı giriş yapmadıysa login sayfasına yönlendir
        if (isLoaded && !isSignedIn) {
            console.log("Kullanıcı giriş yapmadı, login sayfasına yönlendiriliyor");
            router.replace("/login");
        }
    }, [isLoaded, isSignedIn, router]);

    // Yükleme durumunda gösterge göster
    if (!isLoaded) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
            </View>
        );
    }

    // Eğer kullanıcı giriş yapmadıysa hiçbir şey gösterme ve yönlendirmeyi bekle
    if (!isSignedIn) {
        return null;
    }

    // Kullanıcı giriş yaptıysa tab'leri göster
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.PRIMARY,
                tabBarLabelStyle: {
                    fontFamily: "outfit-medium",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Ana Sayfa",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="inbox"
                options={{
                    title: "Mesajlar",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbox-ellipses" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="care"
                options={{
                    title: "Bakım",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="medical" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="favorite"
                options={{
                    title: "Favoriler",
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="heart" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profil",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}