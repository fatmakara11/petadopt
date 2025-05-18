import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import * as React from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Colors from '../../constants/Colors'

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded || isSubmitting) return

        // Form validasyonu
        if (!emailAddress || !password) {
            Alert.alert("Hata", "Lütfen e-posta ve şifre alanlarını doldurun.");
            return;
        }

        if (password.length < 8) {
            Alert.alert("Hata", "Şifre en az 8 karakter olmalıdır.");
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Kayıt işlemi başlatılıyor:", emailAddress);

            // Start sign-up process using email and password provided
            await signUp.create({
                emailAddress,
                password,
            });

            // Send user an email with verification code
            // web authentication kullanıyoruz, email code yerine
            const signUpResponse = await signUp.prepareEmailAddressVerification();
            console.log("Doğrulama hazırlandı:", signUpResponse);

            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            setPendingVerification(true);
        } catch (err) {
            console.error("Kayıt hatası:", JSON.stringify(err, null, 2));

            // Hata mesajlarını özelleştir
            let errorMessage = "Kayıt işlemi sırasında bir hata oluştu.";

            if (err?.errors && err.errors.length > 0) {
                const error = err.errors[0];
                if (error.code === "form_password_pwned") {
                    errorMessage = "Bu şifre güvenli değil. Lütfen daha güvenli bir şifre seçin.";
                } else if (error.code === "form_identifier_exists") {
                    errorMessage = "Bu e-posta adresi zaten kullanılıyor.";
                }
            }

            Alert.alert("Kayıt Hatası", errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded || isSubmitting) return

        if (!code) {
            Alert.alert("Hata", "Lütfen doğrulama kodunu girin.");
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Doğrulama kodu gönderiliyor:", code);

            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            });

            console.log("Doğrulama sonucu:", signUpAttempt.status);

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                console.log("Kayıt tamamlandı, oturum açılıyor");
                await setActive({ session: signUpAttempt.createdSessionId });
                console.log("Ana sayfaya yönlendiriliyor");
                router.replace('/(tabs)');
            } else {
                console.error("Kayıt tamamlanamadı:", JSON.stringify(signUpAttempt, null, 2));
                Alert.alert("Doğrulama Hatası", "Doğrulama işlemi tamamlanamadı. Lütfen kodu kontrol edip tekrar deneyin.");
            }
        } catch (err) {
            console.error("Doğrulama hatası:", JSON.stringify(err, null, 2));

            // Özel hata mesajları
            let errorMessage = "Doğrulama işlemi sırasında bir hata oluştu.";

            if (err?.errors && err.errors.length > 0) {
                const error = err.errors[0];
                if (error.code === "form_code_incorrect") {
                    errorMessage = "Geçersiz doğrulama kodu. Lütfen tekrar deneyin.";
                } else if (error.code === "form_code_expired") {
                    errorMessage = "Doğrulama kodu süresi dolmuş. Lütfen yeni bir kod isteyin.";
                }
            }

            Alert.alert("Doğrulama Hatası", errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (pendingVerification) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>E-posta Adresinizi Doğrulayın</Text>
                <Text style={styles.subtitle}>E-posta adresinize gönderilen 6 haneli kodu girin</Text>
                <TextInput
                    value={code}
                    placeholder="Doğrulama kodunu girin"
                    onChangeText={(code) => setCode(code)}
                    style={styles.input}
                    keyboardType="number-pad"
                    maxLength={6}
                />
                <TouchableOpacity
                    onPress={onVerifyPress}
                    style={[styles.button, isSubmitting && styles.buttonDisabled]}
                    disabled={isSubmitting}
                >
                    <Text style={styles.buttonText}>
                        {isSubmitting ? "Doğrulanıyor..." : "Doğrula"}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hesap Oluştur</Text>
            <TextInput
                autoCapitalize="none"
                value={emailAddress}
                placeholder="E-posta adresiniz"
                onChangeText={(email) => setEmailAddress(email)}
                style={styles.input}
                keyboardType="email-address"
            />
            <TextInput
                value={password}
                placeholder="Şifre (en az 8 karakter)"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
                style={styles.input}
            />
            <TouchableOpacity
                onPress={onSignUpPress}
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                disabled={isSubmitting}
            >
                <Text style={styles.buttonText}>
                    {isSubmitting ? "Kaydediliyor..." : "Kayıt Ol"}
                </Text>
            </TouchableOpacity>
            <View style={styles.linkContainer}>
                <Text style={styles.text}>Hesabınız var mı?</Text>
                <Link href="/(auth)/sign-in" style={styles.link}>
                    <Text style={styles.linkText}>Giriş Yap</Text>
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
    subtitle: {
        fontSize: 16,
        fontFamily: 'outfit',
        marginBottom: 20,
        textAlign: 'center',
        color: Colors.GRAY
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