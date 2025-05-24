import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Colors from '../../../constants/Colors';
import { detectPetInImage } from '../../../services/visionService';

export default function VisionPetAnalyzer({ imageUri, onAnalysisComplete, disabled = false }) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [showResults, setShowResults] = useState(false);

    const handleAnalyze = async () => {
        if (!imageUri) {
            Alert.alert('Hata', 'Önce bir resim seçin');
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
                    Alert.alert('Bilgi', '🎯 Gelişmiş tahmin sistemi kullanıldı! Form otomatik dolduruldu.');
                } else {
                    Alert.alert('Başarılı', '🎯 AI analizi tamamlandı! Form otomatik dolduruldu.');
                }
            } else {
                Alert.alert('Hata', 'Görüntü analizi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
            }
        } catch (error) {
            console.error('🚨 Vision Analysis error:', error);
            Alert.alert('Hata', 'Analiz sırasında bir hata oluştu: ' + error.message);
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

    const AnalysisResultModal = () => {
        if (!analysisResult?.success) return null;

        const data = analysisResult.data;

        return (
            <Modal
                visible={showResults}
                animationType="slide"
                transparent={true}
                onRequestClose={closeResults}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>🎯 Gelişmiş Pet AI Analizi</Text>
                            <TouchableOpacity onPress={closeResults}>
                                <Ionicons name="close" size={24} color={Colors.PRIMARY} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.resultContainer} showsVerticalScrollIndicator={false}>
                            {/* Ana Sonuçlar */}
                            <View style={styles.mainResults}>
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
                            </View>

                            {/* Detaylı Bilgiler */}
                            <View style={styles.detailsSection}>
                                <Text style={styles.sectionTitle}>📊 Detaylı Analiz</Text>

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
                            </View>

                            {/* Öneriler */}
                            {data.recommendations && (
                                <View style={styles.recommendationsSection}>
                                    <Text style={styles.sectionTitle}>💡 AI Bakım Önerileri</Text>
                                    <Text style={styles.recommendationText}>
                                        {data.recommendations}
                                    </Text>
                                </View>
                            )}

                            {/* Teknik Detaylar */}
                            <View style={styles.technicalSection}>
                                <Text style={styles.sectionTitle}>🔬 Teknik Bilgiler</Text>
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
                            </View>
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeResults}
                        >
                            <Text style={styles.closeButtonText}>Tamam</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    const ResultItem = ({ icon, label, value, highlight = false }) => (
        <View style={[styles.resultItem, highlight && styles.highlightedItem]}>
            <View style={styles.resultIcon}>
                <Ionicons name={icon} size={20} color={highlight ? '#fff' : Colors.PRIMARY} />
            </View>
            <View style={styles.resultText}>
                <Text style={[styles.resultLabel, highlight && styles.highlightedLabel]}>{label}:</Text>
                <Text style={[styles.resultValue, highlight && styles.highlightedValue]}>
                    {value || 'Bulunamadı'}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.analyzeButton,
                    (isAnalyzing || disabled) && styles.disabledButton
                ]}
                onPress={handleAnalyze}
                disabled={isAnalyzing || disabled || !imageUri}
            >
                {isAnalyzing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#fff" />
                        <Text style={styles.buttonText}>🎯 AI Analiz Ediliyor...</Text>
                    </View>
                ) : (
                    <View style={styles.buttonContent}>
                        <Ionicons name="sparkles" size={20} color="#fff" />
                        <Text style={styles.buttonText}>🎯 Pet AI</Text>
                    </View>
                )}
            </TouchableOpacity>

            {analysisResult?.success && (
                <View style={styles.quickInfo}>
                    <Text style={styles.quickInfoText}>
                        ✅ {analysisResult.data.breed} - %{Math.round(analysisResult.data.confidence * 100)} güven
                        {analysisResult.fallback && ' (Tahmin)'}
                    </Text>
                    <TouchableOpacity onPress={() => setShowResults(true)}>
                        <Text style={styles.showDetailsText}>Detayları Gör</Text>
                    </TouchableOpacity>
                </View>
            )}

            <AnalysisResultModal />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    analyzeButton: {
        backgroundColor: Colors.PRIMARY, // Turuncu - daha çarpıcı
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'outfit-medium',
        fontSize: 16,
    },
    quickInfo: {
        backgroundColor: '#fff3e0',
        padding: 10,
        borderRadius: 8,
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: '#FF6B35',
    },
    quickInfoText: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: '#e65100',
        flex: 1,
    },
    showDetailsText: {
        fontFamily: 'outfit-medium',
        fontSize: 14,
        color: Colors.PRIMARY,
        textDecorationLine: 'underline',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        margin: 20,
        maxHeight: '85%',
        width: '95%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'outfit-medium',
        color: '#FF6B35',
    },
    resultContainer: {
        maxHeight: 500,
    },
    mainResults: {
        marginBottom: 20,
    },
    detailsSection: {
        marginBottom: 20,
    },
    recommendationsSection: {
        marginBottom: 20,
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 10,
    },
    technicalSection: {
        backgroundColor: '#e3f2fd',
        padding: 15,
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'outfit-medium',
        color: '#333',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 5,
    },
    resultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        borderRadius: 5,
        marginBottom: 2,
    },
    highlightedItem: {
        backgroundColor: '#FF6B35',
        borderRadius: 8,
        marginBottom: 5,
    },
    resultIcon: {
        width: 40,
        alignItems: 'center',
    },
    resultText: {
        flex: 1,
        marginLeft: 10,
    },
    resultLabel: {
        fontFamily: 'outfit-medium',
        fontSize: 14,
        color: '#333',
    },
    highlightedLabel: {
        color: '#fff',
    },
    resultValue: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    highlightedValue: {
        color: '#fff',
        fontFamily: 'outfit-medium',
    },
    recommendationText: {
        fontFamily: 'outfit',
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    closeButton: {
        backgroundColor: '#FF6B35',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
    },
    closeButtonText: {
        color: '#fff',
        fontFamily: 'outfit-medium',
        fontSize: 16,
    },
}); 