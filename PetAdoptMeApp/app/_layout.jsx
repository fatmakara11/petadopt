import { ClerkProvider } from '@clerk/clerk-expo';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

// Güvenli token saklama işlevi
const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      console.error("Token alma hatası:", err);
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      console.error("Token kaydetme hatası:", err);
      return;
    }
  },
};

// Clerk anahtarını sabit olarak tanımlayalım
// Bu, app.json'dan alınan değer çalışmazsa kullanılacak
const clerkKey = Constants.expoConfig?.extra?.clerkPublishableKey ||
  "pk_test_ZmxhdC1zbGltZS0xNC5jbGVyay5hY2NvdW50cy5kZXYk";

console.log("Clerk anahtarı kullanılıyor:", clerkKey);

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'outfit': require('../assets/fonts/Outfit-Regular.ttf'),
    'outfit-medium': require('../assets/fonts/Outfit-Medium.ttf'),
    'outfit-bold': require('../assets/fonts/Outfit-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={clerkKey}
    >
      <Stack
        screenOptions={{
          headerShown: false
        }}
      />
    </ClerkProvider>
  );
}
