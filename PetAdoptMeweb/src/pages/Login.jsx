import React, { useState, useEffect } from 'react';
import { useSignIn, useAuth } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import Colors from '../colors';

const Login = () => {
    const { isSignedIn } = useAuth();
    const { signIn, setActive, isLoaded } = useSignIn();
    const navigate = useNavigate();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
    useEffect(() => {
        if (isSignedIn) {
            navigate('/');
        }
    }, [isSignedIn, navigate]);

    const onSignInPress = async (e) => {
        e.preventDefault();

        if (!isLoaded || isSubmitting) return;

        // Form validasyonu
        if (!emailAddress || !password) {
            setError("E-posta ve şifre alanlarını doldurun.");
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Giriş denemesi
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                navigate('/');
            } else if (signInAttempt.status === 'needs_first_factor') {
                setError("İki faktörlü kimlik doğrulama gerekiyor.");
            } else {
                setError("Giriş işlemi tamamlanamadı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.");
            }
        } catch (err) {
            console.error("Giriş hatası:", err);

            // Özel hata mesajları
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

            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container" style={{
            maxWidth: '400px',
            margin: '0 auto',
            padding: '40px 20px'
        }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Giriş Yap</h1>

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

            <form onSubmit={onSignInPress}>
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
                        Şifre
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
                    {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </button>
            </form>

            <div style={{
                marginTop: '20px',
                textAlign: 'center'
            }}>
                <span>Hesabınız yok mu? </span>
                <Link to="/register" style={{
                    color: Colors.PRIMARY,
                    textDecoration: 'none',
                    fontWeight: '500'
                }}>
                    Kaydol
                </Link>
            </div>
        </div>
    );
};

export default Login; 