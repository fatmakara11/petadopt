import React, { useState } from 'react';
import { detectPetInImage } from '../services/visionService';
import Colors from '../colors';

const VisionPetAnalyzer = ({ imageUri, onAnalysisComplete, disabled = false }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const handleAnalyze = async () => {
        if (!imageUri) {
            alert('Önce bir resim seçin');
            return;
        }

        setIsAnalyzing(true);
        try {
            console.log('🎯 Gelişmiş Pet AI analizi başlıyor...');
            const result = await detectPetInImage(imageUri);

            if (result.success) {
                setAnalysisResult(result);
                setShowResults(true);

                // Form verilerini otomatik doldur
                const formData = generateFormDataFromAnalysis(result);
                onAnalysisComplete && onAnalysisComplete(formData);

                console.log('✅ Pet AI analizi tamamlandı:', result.data.breed);

                if (result.fallback) {
                    alert('🎯 Gelişmiş tahmin sistemi kullanıldı! Form otomatik dolduruldu.');
                } else {
                    alert('🎯 AI analizi tamamlandı! Form otomatik dolduruldu.');
                }
            } else {
                alert('Görüntü analizi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
            }
        } catch (error) {
            console.error('🚨 Vision Analysis error:', error);
            alert('Analiz sırasında bir hata oluştu: ' + error.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const generateFormDataFromAnalysis = (analysisResult) => {
        if (!analysisResult.success) {
            return {};
        }

        const data = analysisResult.data;

        return {
            category: data.animalType === 'dog' ? 'Dogs' :
                data.animalType === 'cat' ? 'Cats' :
                    data.animalType === 'bird' ? 'Birds' : 'Others',
            breed: data.breed || '',
            age: data.estimatedAge || '',
            about: generateAboutText(data),
            aiAnalysis: data,
            confidence: data.confidence || 0
        };
    };

    const generateAboutText = (data) => {
        let aboutText = '';

        if (data.characteristics) {
            aboutText += `🏷️ Özellikler: ${data.characteristics.join(', ')}\n\n`;
        }

        if (data.temperament) {
            aboutText += `❤️ Mizaç: ${data.temperament.join(', ')}\n\n`;
        }

        if (data.careLevel) {
            aboutText += `🛡️ Bakım Seviyesi: ${data.careLevel}\n\n`;
        }

        if (data.colors) {
            aboutText += `🎨 Renkler: ${data.colors.join(', ')}\n\n`;
        }

        if (data.recommendations) {
            aboutText += `💡 Bakım Önerileri: ${data.recommendations}`;
        }

        return aboutText.trim();
    };

    const closeResults = () => {
        setShowResults(false);
    };

    const ResultItem = ({ icon, label, value, highlight = false }) => (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 10px',
            borderBottom: '1px solid #f0f0f0',
            borderRadius: '5px',
            marginBottom: '2px',
            backgroundColor: highlight ? Colors.PRIMARY : 'transparent',
            color: highlight ? '#fff' : '#333'
        }}>
            <div style={{
                width: '40px',
                textAlign: 'center',
                fontSize: '20px'
            }}>
                {icon === 'paw' ? '🐾' :
                    icon === 'ribbon' ? '🏆' :
                        icon === 'speedometer' ? '📊' :
                            icon === 'time' ? '⏰' :
                                icon === 'heart' ? '❤️' :
                                    icon === 'star' ? '⭐' :
                                        icon === 'shield-checkmark' ? '🛡️' :
                                            icon === 'book' ? '📚' :
                                                icon === 'color-palette' ? '🎨' :
                                                    icon === 'analytics' ? '📈' :
                                                        icon === 'warning' ? '⚠️' : '📋'}
            </div>
            <div style={{ flex: 1, marginLeft: '10px' }}>
                <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: highlight ? '#fff' : '#333'
                }}>{label}:</div>
                <div style={{
                    fontSize: '14px',
                    color: highlight ? '#fff' : '#666',
                    marginTop: '2px'
                }}>
                    {value || 'Bulunamadı'}
                </div>
            </div>
        </div>
    );

    const AnalysisResultModal = () => {
        if (!analysisResult?.success || !showResults) return null;

        const data = analysisResult.data;

        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000
            }}>
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '20px',
                    padding: '20px',
                    margin: '20px',
                    maxHeight: '85vh',
                    width: '95%',
                    maxWidth: '600px',
                    overflow: 'auto'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px',
                        paddingBottom: '10px',
                        borderBottom: '1px solid #eee'
                    }}>
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: Colors.PRIMARY,
                            margin: 0
                        }}>🎯 Gelişmiş Pet AI Analizi</h2>
                        <button
                            onClick={closeResults}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: Colors.PRIMARY
                            }}
                        >
                            ×
                        </button>
                    </div>

                    <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                        {/* Ana Sonuçlar */}
                        <div style={{ marginBottom: '20px' }}>
                            <ResultItem
                                icon="paw"
                                label="Tespit Edilen Tür"
                                value={data.animalType === 'dog' ? '🐕 Köpek' :
                                    data.animalType === 'cat' ? '🐱 Kedi' :
                                        data.animalType === 'bird' ? '🦅 Kuş' : '🐾 Diğer'}
                                highlight={true}
                            />
                            <ResultItem
                                icon="ribbon"
                                label="Tahmin Edilen Cins"
                                value={data.breed}
                                highlight={true}
                            />
                            <ResultItem
                                icon="speedometer"
                                label="AI Güven Oranı"
                                value={`%${Math.round(data.confidence * 100)}`}
                                highlight={true}
                            />
                        </div>

                        {/* Detaylı Bilgiler */}
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: '10px',
                                borderBottom: '1px solid #ddd',
                                paddingBottom: '5px'
                            }}>📊 Detaylı Analiz</h3>

                            <ResultItem
                                icon="time"
                                label="Tahmini Yaş"
                                value={data.estimatedAge || 'Belirlenmedi'}
                            />
                            <ResultItem
                                icon="heart"
                                label="Mizaç Özellikleri"
                                value={data.temperament?.join(', ') || 'Analiz edilmedi'}
                            />
                            <ResultItem
                                icon="star"
                                label="Karakter Özellikleri"
                                value={data.characteristics?.join(', ') || 'Analiz edilmedi'}
                            />
                            <ResultItem
                                icon="shield-checkmark"
                                label="Tahmini Sağlık Durumu"
                                value={data.isHealthy ? '✅ Sağlıklı görünüyor' : '⚠️ Kontrol gerekebilir'}
                            />
                            <ResultItem
                                icon="book"
                                label="Bakım Zorluğu"
                                value={data.careLevel || 'Orta'}
                            />
                            <ResultItem
                                icon="color-palette"
                                label="Tespit Edilen Renkler"
                                value={data.colors?.join(', ') || 'Analiz edilmedi'}
                            />
                        </div>

                        {/* Öneriler */}
                        {data.recommendations && (
                            <div style={{
                                marginBottom: '20px',
                                backgroundColor: '#f8f9fa',
                                padding: '15px',
                                borderRadius: '10px'
                            }}>
                                <h3 style={{
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#333',
                                    marginBottom: '10px'
                                }}>💡 AI Bakım Önerileri</h3>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#555',
                                    lineHeight: '20px',
                                    margin: 0
                                }}>
                                    {data.recommendations}
                                </p>
                            </div>
                        )}

                        {/* Teknik Detaylar */}
                        <div style={{
                            backgroundColor: '#e3f2fd',
                            padding: '15px',
                            borderRadius: '10px'
                        }}>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: '10px'
                            }}>🔬 Teknik Bilgiler</h3>
                            <ResultItem
                                icon="analytics"
                                label="Analiz Kaynağı"
                                value={analysisResult.sources?.join(' + ') || 'Custom AI'}
                            />
                            <ResultItem
                                icon="time"
                                label="Analiz Zamanı"
                                value={data.analysisTimestamp ? new Date(data.analysisTimestamp).toLocaleString('tr-TR') : 'Şimdi'}
                            />
                            {analysisResult.fallback && (
                                <ResultItem
                                    icon="warning"
                                    label="Mod"
                                    value="Gelişmiş Tahmin Sistemi"
                                />
                            )}
                        </div>
                    </div>

                    <button
                        onClick={closeResults}
                        style={{
                            backgroundColor: Colors.PRIMARY,
                            color: '#fff',
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            width: '100%',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginTop: '15px'
                        }}
                    >
                        Tamam
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || disabled || !imageUri}
                style={{
                    backgroundColor: Colors.PRIMARY,
                    color: '#fff',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    width: '100%',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: disabled || !imageUri ? 'not-allowed' : 'pointer',
                    opacity: (isAnalyzing || disabled || !imageUri) ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}
            >
                {isAnalyzing ? (
                    <>
                        <span>⏳</span>
                        <span>🎯 AI Analiz Ediliyor...</span>
                    </>
                ) : (
                    <>
                        <span>✨</span>
                        <span>🎯 Pet AI</span>
                    </>
                )}
            </button>

            {analysisResult?.success && (
                <div style={{
                    backgroundColor: '#fff3e0',
                    padding: '10px',
                    borderRadius: '8px',
                    marginTop: '5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderLeft: `4px solid ${Colors.PRIMARY}`
                }}>
                    <div style={{
                        fontSize: '14px',
                        color: '#e65100',
                        flex: 1
                    }}>
                        ✅ {analysisResult.data.breed} - %{Math.round(analysisResult.data.confidence * 100)} güven
                        {analysisResult.fallback && ' (Tahmin)'}
                    </div>
                    <button
                        onClick={() => setShowResults(true)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: Colors.PRIMARY,
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Detayları Gör
                    </button>
                </div>
            )}

            <AnalysisResultModal />
        </div>
    );
};

export default VisionPetAnalyzer; 