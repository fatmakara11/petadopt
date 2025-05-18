import { useAuth, useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Colors from '../../constants/Colors'

export default function SignInScreen() {
    const { isSignedIn } = useAuth();
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    // Eğer kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
    useEffect(() => {
        if (isSignedIn) {
            console.log("Kullanıcı zaten giriş yapmış, ana sayfaya yönlendiriliyor");
            router.replace("/(tabs)");
        }
    }, [isSignedIn, router]);

    // Handle the submission of the sign-in form
    const onSignInPress = async () => {
        if (!isLoaded || isSubmitting) return

        // Boş alan kontrolü
        if (!emailAddress || !password) {
            Alert.alert("Hata", "E-posta ve şifre alanlarını doldurun.");
            return;
        }

        setIsSubmitting(true)

        try {
            // Start the sign-in process using the email and password provided
            console.log("Giriş denenecek email:", emailAddress);

            // Direkt oturum açma denemesi - strategy belirtmeden
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });

            console.log("Giriş denemesi:", signInAttempt.status);

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })

                // Ana sayfaya yönlendir ve bu sefer gerekirse sayfayı yenilemeyi zorla
                console.log("Giriş başarılı, ana sayfaya yönlendiriliyor...");
                router.replace('/(tabs)');
            } else if (signInAttempt.status === 'needs_first_factor') {
                // İki faktörlü kimlik doğrulama gerekiyorsa
                console.log("İki faktörlü kimlik doğrulama gerekiyor");
                // İki faktörlü kimlik doğrulama işlemlerini buraya ekleyin
                Alert.alert("Bilgi", "İki faktörlü kimlik doğrulama gerekiyor.");
            } else {
                console.error("Giriş tamamlanamadı:", JSON.stringify(signInAttempt, null, 2))
                Alert.alert("Giriş Hatası", "Giriş işlemi tamamlanamadı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.")
            }
        } catch (err) {
            console.error("Giriş hatası:", JSON.stringify(err, null, 2))

            // Daha özel hata mesajları
            let errorMessage = "Giriş sırasında bir hata oluştu. Lütfen bilgilerinizi kontrol edip tekrar deneyin.";

            if (err?.errors && err.errors.length > 0) {
                const error = err.errors[0];
                if (error.code === "strategy_for_user_invalid") {
                    errorMessage = "Bu hesap için geçersiz giriş yöntemi. Lütfen başka bir yöntemle giriş yapmayı deneyin.";
                } else if (error.code === "form_password_incorrect") {
                    errorMessage = "Şifre yanlış. Lütfen şifrenizi kontrol edin.";
                } else if (error.code === "form_identifier_not_found") {
                    errorMessage = "Bu e-posta adresi ile kayıtlı bir hesap bulunamadı.";
                }
            }

            Alert.alert("Giriş Hatası", errorMessage);
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Giriş Yap</Text>
            <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="E-posta adresiniz"
                onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                style={styles.input}
            />
            <TextInput
                value={password}
                placeholder="Şifreniz"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                style={styles.input}
            />
            <TouchableOpacity
                onPress={onSignInPress}
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>{isSubmitting ? "Giriş Yapılıyor..." : "Giriş Yap"}</Text>
            </TouchableOpacity>
            <View style={styles.linkContainer}>
                <Text style={styles.text}>Hesabınız yok mu?</Text>
                <Link href="/(auth)/sign-up" style={styles.link}>
                    <Text style={styles.linkText}>Kaydol</Text>
                </Link>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'outfit-bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        fontFamily: 'outfit',
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonDisabled: {
        backgroundColor: Colors.GRAY,
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontFamily: 'outfit-medium',
        fontSize: 16,
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: 'outfit',
    },
    link: {
        marginLeft: 5,
    },
    linkText: {
        color: Colors.PRIMARY,
        fontFamily: 'outfit-medium',
    }
}); 