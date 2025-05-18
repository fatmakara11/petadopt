import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import Colors from "../constants/Colors";
//import firebase from '../config/FirebaseConfig';

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  // Clerk verilerinin yüklenmesini bekleyelim
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
      </View>
    );
  }

  // Kullanıcı giriş yapmışsa doğrudan ana sayfaya yönlendir
  if (isSignedIn) {
    return <Redirect href="/(tabs)" />;
  }

  // Giriş yapmamışsa login sayfasına yönlendir
  return <Redirect href="/login" />;
}