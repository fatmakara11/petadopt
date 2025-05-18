import React, { useState, useEffect } from 'react';
import { useSignUp, useAuth } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import Colors from '../colors';

const Register = () => {
    const { isSignedIn } = useAuth();
    const { signUp, setActive, isLoaded } = useSignUp();
    const navigate = useNavigate();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
    useEffect(() => {
        if (isSignedIn) {
            navigate('/');
        }
    }, [isSignedIn, navigate]);

    const onSignUpPress = async (e) => {
        e.preventDefault();

        if (!isLoaded || isSubmitting) return;

        // Form validasyonu
        if (!emailAddress || !password) {
            setError("E-posta ve şifre alanlarını doldurun.");
            return;
        }

        if (password.length < 8) {
            setError("Şifre en az 8 karakter olmalıdır.");
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Kayıt işlemini başlat
            await signUp.create({
                emailAddress,
                password,
            });

            // E-posta doğrulama için hazırlık
            await signUp.prepareEmailAddressVerification();
            setPendingVerification(true);
        } catch (err) {
            console.error("Kayıt hatası:", err);

            // Özel hata mesajları
            let errorMessage = "Kayıt işlemi sırasında bir hata oluştu.";

            if (err?.errors && err.errors.length > 0) {
                const error = err.errors[0];
                if (error.code === "form_password_pwned") {
                    errorMessage = "Bu şifre güvenli değil. Lütfen daha güvenli bir şifre seçin.";
                } else if (error.code === "form_identifier_exists") {
                    errorMessage = "Bu e-posta adresi zaten kullanılıyor.";
                }
            }

            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const onVerifyPress = async (e) => {
        e.preventDefault();

        if (!isLoaded || isSubmitting) return;

        if (!verificationCode) {
            setError("Lütfen doğrulama kodunu girin.");
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Doğrulama kodunu gönder
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            });

            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId });
                navigate('/');
            } else {
                setError("Doğrulama işlemi tamamlanamadı. Lütfen kodu kontrol edip tekrar deneyin.");
            }
        } catch (err) {
            console.error("Doğrulama hatası:", err);

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

            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="register-container" style={{
            maxWidth: '400px',
            margin: '0 auto',
            padding: '40px 20px'
        }}>
            {pendingVerification ? (
                <>
                    <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>E-posta Adresinizi Doğrulayın</h1>
                    <p style={{ textAlign: 'center', marginBottom: '20px', color: Colors.GRAY }}>
                        E-posta adresinize gönderilen 6 haneli kodu girin
                    </p>

                    {error && (
                        <div className="error-message" style={{
                            color: 'red',
                            backgroundColor: '#ffeeee',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '20px'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={onVerifyPress}>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                    textAlign: 'center',
                                    letterSpacing: '5px'
                                }}
                                placeholder="Doğrulama kodunu girin"
                                maxLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: Colors.PRIMARY,
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '16px',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                opacity: isSubmitting ? 0.7 : 1
                            }}
                        >
                            {isSubmitting ? 'Doğrulanıyor...' : 'Doğrula'}
                        </button>
                    </form>
                </>
            ) : (
                <>
                    <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Hesap Oluştur</h1>

                    {error && (
                        <div className="error-message" style={{
                            color: 'red',
                            backgroundColor: '#ffeeee',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '20px'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={onSignUpPress}>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>
                                E-posta
                            </label>
                            <input
                                type="email"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    fontSize: '16px'
                                }}
                                placeholder="E-posta adresiniz"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>
                                Şifre (en az 8 karakter)
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    fontSize: '16px'
                                }}
                                placeholder="Şifreniz"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: Colors.PRIMARY,
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                fontSize: '16px',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                opacity: isSubmitting ? 0.7 : 1
                            }}
                        >
                            {isSubmitting ? 'Kaydediliyor...' : 'Kayıt Ol'}
                        </button>
                    </form>

                    <div style={{
                        marginTop: '20px',
                        textAlign: 'center'
                    }}>
                        <span>Hesabınız var mı? </span>
                        <Link to="/login" style={{
                            color: Colors.PRIMARY,
                            textDecoration: 'none',
                            fontWeight: '500'
                        }}>
                            Giriş Yap
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default Register; 