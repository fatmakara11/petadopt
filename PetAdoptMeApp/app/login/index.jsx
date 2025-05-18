import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import Colors from "../../constants/Colors";

// Login ekranı artık sadece giriş sayfasına yönlendiriyor
export default function LoginScreen() {
    const router = useRouter();

    const handleSignIn = () => {
        router.push("/(auth)/sign-in");
    };

    const handleSignUp = () => {
        router.push("/(auth)/sign-up");
    };

    return (
        <View style={{ backgroundColor: Colors.WHITE, height: "100%", justifyContent: 'space-between' }}>
            <Image
                source={require("../../assets/images/login2.png")}
                style={{ width: "100%", height: 450 }}
                resizeMode="cover"
            />

            <View style={{ padding: 20, marginBottom: 30 }}>
                <Text style={{
                    fontFamily: "outfit-bold",
                    fontSize: 30,
                    textAlign: "center",
                    marginBottom: 15
                }}>
                    Yeni bir dost edinmeye hazır mısın?
                </Text>

                <Text style={{
                    fontFamily: 'outfit',
                    fontSize: 16,
                    textAlign: 'center',
                    color: Colors.GRAY,
                    marginBottom: 40
                }}>
                    Beğendiğiniz evcil hayvanı sahiplenin ve hayatlarını tekrar mutlu edin
                </Text>

                <Pressable
                    onPress={handleSignIn}
                    style={{
                        padding: 16,
                        marginBottom: 15,
                        backgroundColor: Colors.PRIMARY,
                        borderRadius: 14,
                        alignItems: 'center'
                    }}
                >
                    <Text style={{
                        fontFamily: 'outfit-medium',
                        fontSize: 18,
                        color: 'white'
                    }}>
                        Giriş Yap
                    </Text>
                </Pressable>

                <Pressable
                    onPress={handleSignUp}
                    style={{
                        padding: 16,
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderColor: Colors.PRIMARY,
                        borderRadius: 14,
                        alignItems: 'center'
                    }}
                >
                    <Text style={{
                        fontFamily: 'outfit-medium',
                        fontSize: 18,
                        color: Colors.PRIMARY
                    }}>
                        Hesap Oluştur
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
