import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Colors from '../../constants/Colors';
import { SmartCareService } from '../../services/smartCareService';

const { width } = Dimensions.get('window');

export default function CareScreen() {
    const { user } = useUser();
    const [activeSection, setActiveSection] = useState('pets');
    const [userPets, setUserPets] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [petAnalysis, setPetAnalysis] = useState(null);
    const [smartRecommendations, setSmartRecommendations] = useState([]);
    const [feedingPlan, setFeedingPlan] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAdvice, setSelectedAdvice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadUserPets();
        }
    }, [user]);

    const loadUserPets = async () => {
        try {
            setLoading(true);
            console.log('🐾 Kullanıcı pet\'leri yükleniyor...');

            const pets = await SmartCareService.getUserPets(user?.emailAddresses[0]?.emailAddress);
            setUserPets(pets);

            if (pets.length > 0) {
                // İlk pet'i seç ve analiz et
                selectPet(pets[0]);
            }

            console.log('✅ Pet verileri yüklendi:', pets.length, 'adet');
        } catch (error) {
            console.error('❌ Pet verileri yüklenirken hata:', error);
            Alert.alert('Hata', 'Pet verileriniz yüklenirken bir sorun oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const selectPet = async (pet) => {
        try {
            console.log('🧠 AI analizi başlıyor:', pet.name);
            setSelectedPet(pet);

            // AI analizi
            const analysis = SmartCareService.analyzePetBehavior(pet);
            setPetAnalysis(analysis);
            setSmartRecommendations(analysis.recommendations);

            // Akıllı beslenme planı
            const feeding = SmartCareService.generateSmartFeedingPlan(pet, analysis);
            setFeedingPlan(feeding);

            console.log('✅ AI analizi tamamlandı - Skor:', analysis.aiScore);
        } catch (error) {
            console.error('❌ AI analizi hatası:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadUserPets();
        setRefreshing(false);
    };

    const showAdviceDetail = (advice, title) => {
        setSelectedAdvice({ advice, title });
        setModalVisible(true);
    };

    const renderSectionButtons = () => (
        <View style={styles.sectionButtons}>
            <TouchableOpacity
                style={[styles.sectionButton, activeSection === 'pets' && styles.activeSectionButton]}
                onPress={() => setActiveSection('pets')}
            >
                <Ionicons name="paw" size={20} color={activeSection === 'pets' ? Colors.WHITE : Colors.PRIMARY} />
                <Text style={[styles.sectionButtonText, activeSection === 'pets' && styles.activeSectionButtonText]}>
                    Petlerim
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.sectionButton, activeSection === 'analysis' && styles.activeSectionButton]}
                onPress={() => setActiveSection('analysis')}
                disabled={!selectedPet}
            >
                <Ionicons name="analytics" size={20} color={activeSection === 'analysis' ? Colors.WHITE : selectedPet ? Colors.PRIMARY : Colors.GRAY} />
                <Text style={[styles.sectionButtonText, activeSection === 'analysis' && styles.activeSectionButtonText, !selectedPet && { color: Colors.GRAY }]}>
                    AI Analiz
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.sectionButton, activeSection === 'feeding' && styles.activeSectionButton]}
                onPress={() => setActiveSection('feeding')}
                disabled={!selectedPet}
            >
                <Ionicons name="restaurant" size={20} color={activeSection === 'feeding' ? Colors.WHITE : selectedPet ? Colors.PRIMARY : Colors.GRAY} />
                <Text style={[styles.sectionButtonText, activeSection === 'feeding' && styles.activeSectionButtonText, !selectedPet && { color: Colors.GRAY }]}>
                    Beslenme
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderPetsList = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>🐾 Petlerim</Text>

            {userPets.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="paw-outline" size={60} color={Colors.GRAY} />
                    <Text style={styles.emptyText}>Henüz pet'iniz bulunmuyor</Text>
                    <Text style={styles.emptySubText}>Pet ekleyerek akıllı bakım önerilerinden yararlanın</Text>
                </View>
            ) : (
                // ScrollView içinde FlatList yerine map kullanarak VirtualizedList hatasını çözüyoruz
                <View>
                    {userPets.map((item) => (
                        <TouchableOpacity
                            key={item.docId}
                            style={[
                                styles.petCard,
                                selectedPet?.docId === item.docId && styles.selectedPetCard
                            ]}
                            onPress={() => selectPet(item)}
                        >
                            <View style={styles.petInfo}>
                                {/* Pet Resmi */}
                                <View style={styles.petImageContainer}>
                                    {item.imageUrl ? (
                                        <Image
                                            source={{ uri: item.imageUrl }}
                                            style={styles.petImage}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View style={styles.petPlaceholder}>
                                            <Ionicons
                                                name={item.category === 'Dogs' ? 'dog' : item.category === 'Cats' ? 'cat' : 'bird'}
                                                size={30}
                                                color={Colors.GRAY}
                                            />
                                        </View>
                                    )}
                                </View>

                                <View style={styles.petDetails}>
                                    <Text style={styles.petName}>{item.name}</Text>
                                    <Text style={styles.petBreed}>{item.breed} • {item.age} yaş</Text>
                                    <Text style={styles.petWeight}>{item.weight} kg • {item.category}</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={Colors.GRAY} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );

    const renderAIAnalysis = () => {
        if (!selectedPet || !petAnalysis) {
            return (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🤖 AI Analizi</Text>
                    <Text style={styles.loadingText}>Pet seçin veya analiz yükleniyor...</Text>
                </View>
            );
        }

        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🤖 AI Analizi - {selectedPet.name}</Text>

                {/* AI Skoru */}
                <View style={styles.aiScoreCard}>
                    <View style={styles.scoreHeader}>
                        <Ionicons name="trophy" size={24} color={Colors.PRIMARY} />
                        <Text style={styles.scoreTitle}>Genel AI Skoru</Text>
                    </View>
                    <Text style={styles.scoreValue}>{petAnalysis.aiScore}/100</Text>
                    <View style={styles.scoreBar}>
                        <View style={[styles.scoreProgress, { width: `${petAnalysis.aiScore}%` }]} />
                    </View>
                </View>

                {/* Analiz Detayları */}
                <View style={styles.analysisGrid}>
                    <View style={styles.analysisItem}>
                        <Ionicons name="flash" size={20} color={Colors.PRIMARY} />
                        <Text style={styles.analysisLabel}>Enerji</Text>
                        <Text style={styles.analysisValue}>{petAnalysis.energyLevel}%</Text>
                    </View>
                    <View style={styles.analysisItem}>
                        <Ionicons name="people" size={20} color={Colors.PRIMARY} />
                        <Text style={styles.analysisLabel}>Sosyal</Text>
                        <Text style={styles.analysisValue}>{petAnalysis.socialNeed}%</Text>
                    </View>
                    <View style={styles.analysisItem}>
                        <Ionicons name="medical" size={20} color={Colors.RED} />
                        <Text style={styles.analysisLabel}>Sağlık Riski</Text>
                        <Text style={styles.analysisValue}>{petAnalysis.healthRisk}%</Text>
                    </View>
                    <View style={styles.analysisItem}>
                        <Ionicons name="construct" size={20} color={Colors.YELLOW} />
                        <Text style={styles.analysisLabel}>Bakım</Text>
                        <Text style={styles.analysisValue}>{petAnalysis.careComplexity}%</Text>
                    </View>
                </View>

                {/* AI Önerileri */}
                <Text style={styles.recommendationsTitle}>🎯 AI Önerileri</Text>
                {smartRecommendations.map((recommendation, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.recommendationCard,
                            recommendation.priority === 'critical' && styles.criticalCard,
                            recommendation.priority === 'high' && styles.highCard
                        ]}
                        onPress={() => showAdviceDetail(recommendation.actions, recommendation.title)}
                    >
                        <View style={styles.recommendationHeader}>
                            <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
                            <Text style={[
                                styles.priorityBadge,
                                recommendation.priority === 'critical' && styles.criticalBadge,
                                recommendation.priority === 'high' && styles.highBadge
                            ]}>
                                {recommendation.priority === 'critical' ? 'ACİL' :
                                    recommendation.priority === 'high' ? 'ÖNEMLİ' : 'NORMAL'}
                            </Text>
                        </View>
                        <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const renderSmartFeeding = () => {
        if (!selectedPet || !feedingPlan) {
            return (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🍽️ Akıllı Beslenme</Text>
                    <Text style={styles.loadingText}>Pet seçin veya plan yükleniyor...</Text>
                </View>
            );
        }

        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🍽️ Akıllı Beslenme - {selectedPet.name}</Text>

                {/* Kalori Bilgisi */}
                <View style={styles.feedingCard}>
                    <View style={styles.feedingHeader}>
                        <Ionicons name="flame" size={24} color={Colors.PRIMARY} />
                        <Text style={styles.feedingTitle}>Günlük Kalori İhtiyacı</Text>
                    </View>
                    <Text style={styles.calorieAmount}>{Math.round(feedingPlan.dailyCalories)} kalori</Text>
                    <Text style={styles.feedingNote}>{feedingPlan.note}</Text>
                </View>

                {/* Besin Değerleri */}
                <View style={styles.feedingCard}>
                    <View style={styles.feedingHeader}>
                        <Ionicons name="nutrition" size={24} color={Colors.PRIMARY} />
                        <Text style={styles.feedingTitle}>Besin Değerleri</Text>
                    </View>
                    <View style={styles.nutritionGrid}>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionLabel}>Protein</Text>
                            <Text style={styles.nutritionValue}>{feedingPlan.protein}%</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionLabel}>Yağ</Text>
                            <Text style={styles.nutritionValue}>{feedingPlan.fat}%</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionLabel}>Lif</Text>
                            <Text style={styles.nutritionValue}>{feedingPlan.fiber}%</Text>
                        </View>
                        <View style={styles.nutritionItem}>
                            <Text style={styles.nutritionLabel}>Öğün</Text>
                            <Text style={styles.nutritionValue}>{feedingPlan.frequency}/gün</Text>
                        </View>
                    </View>
                </View>

                {/* Supplements */}
                {feedingPlan.supplements.length > 0 && (
                    <View style={styles.feedingCard}>
                        <View style={styles.feedingHeader}>
                            <Ionicons name="medical" size={24} color={Colors.PRIMARY} />
                            <Text style={styles.feedingTitle}>AI Önerisi Supplements</Text>
                        </View>
                        {feedingPlan.supplements.map((supplement, index) => (
                            <Text key={index} style={styles.supplementItem}>• {supplement}</Text>
                        ))}
                    </View>
                )}

                {/* Yasak Gıdalar */}
                <View style={styles.feedingCard}>
                    <View style={styles.feedingHeader}>
                        <Ionicons name="warning" size={24} color={Colors.RED} />
                        <Text style={styles.feedingTitle}>Yasak Gıdalar</Text>
                    </View>
                    {feedingPlan.restrictions.map((restriction, index) => (
                        <Text key={index} style={styles.restrictionItem}>❌ {restriction}</Text>
                    ))}
                </View>
            </View>
        );
    };

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <Ionicons name="paw" size={60} color={Colors.PRIMARY} />
                    <Text style={styles.loadingText}>Pet'leriniz yükleniyor...</Text>
                </View>
            );
        }

        switch (activeSection) {
            case 'pets':
                return renderPetsList();
            case 'analysis':
                return renderAIAnalysis();
            case 'feeding':
                return renderSmartFeeding();
            default:
                return renderPetsList();
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>🤖 Akıllı Pet Bakım</Text>
                <Text style={styles.headerSubtitle}>
                    {selectedPet ? `${selectedPet.name} için AI önerileri` : 'Pet seçin'}
                </Text>
            </View>

            {/* Section Buttons */}
            {renderSectionButtons()}

            {/* Content */}
            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {renderContent()}
            </ScrollView>

            {/* Detail Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedAdvice?.title}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color={Colors.GRAY} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            {Array.isArray(selectedAdvice?.advice) ? (
                                selectedAdvice.advice.map((item, index) => (
                                    <Text key={index} style={styles.modalItem}>• {item}</Text>
                                ))
                            ) : (
                                <Text style={styles.modalText}>{selectedAdvice?.advice}</Text>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.LIGHT_PRIMARY,
    },
    header: {
        backgroundColor: Colors.PRIMARY,
        padding: 20,
        paddingTop: 50,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.WHITE,
        fontFamily: 'outfit-bold',
    },
    headerSubtitle: {
        fontSize: 14,
        color: Colors.WHITE,
        opacity: 0.8,
        fontFamily: 'outfit',
    },
    sectionButtons: {
        flexDirection: 'row',
        backgroundColor: Colors.WHITE,
        margin: 15,
        borderRadius: 25,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 20,
        gap: 8,
    },
    activeSectionButton: {
        backgroundColor: Colors.PRIMARY,
    },
    sectionButtonText: {
        fontSize: 12,
        color: Colors.PRIMARY,
        fontFamily: 'outfit-medium',
    },
    activeSectionButtonText: {
        color: Colors.WHITE,
    },
    content: {
        flex: 1,
        paddingHorizontal: 15,
    },
    section: {
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        marginBottom: 15,
        fontFamily: 'outfit-bold',
    },
    loadingText: {
        textAlign: 'center',
        color: Colors.GRAY,
        fontStyle: 'italic',
        marginTop: 50,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.DARK_GRAY,
        marginTop: 20,
        marginBottom: 10,
        fontFamily: 'outfit-bold',
    },
    emptySubText: {
        fontSize: 14,
        color: Colors.GRAY,
        textAlign: 'center',
        fontFamily: 'outfit',
        paddingHorizontal: 20,
    },
    petCard: {
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectedPetCard: {
        backgroundColor: Colors.PRIMARY + '20',
        borderWidth: 2,
        borderColor: Colors.PRIMARY,
    },
    petInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    petImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        marginRight: 15,
    },
    petImage: {
        width: '100%',
        height: '100%',
    },
    petPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.LIGHT_PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    petDetails: {
        flex: 1,
    },
    petName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        marginBottom: 5,
        fontFamily: 'outfit-bold',
    },
    petBreed: {
        fontSize: 14,
        color: Colors.DARK_GRAY,
        marginBottom: 2,
        fontFamily: 'outfit',
    },
    petWeight: {
        fontSize: 12,
        color: Colors.GRAY,
        fontFamily: 'outfit',
    },
    aiScoreCard: {
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    scoreHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    scoreTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        marginLeft: 10,
        fontFamily: 'outfit-bold',
    },
    scoreValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        marginBottom: 15,
        fontFamily: 'outfit-bold',
    },
    scoreBar: {
        width: '100%',
        height: 12,
        backgroundColor: Colors.LIGHT_PRIMARY,
        borderRadius: 6,
        overflow: 'hidden',
    },
    scoreProgress: {
        height: '100%',
        backgroundColor: Colors.PRIMARY,
        borderRadius: 6,
    },
    analysisGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    analysisItem: {
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        padding: 15,
        width: '48%',
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    analysisLabel: {
        fontSize: 12,
        color: Colors.DARK_GRAY,
        marginTop: 8,
        marginBottom: 4,
        fontFamily: 'outfit',
    },
    analysisValue: {
        fontSize: 16,
        color: Colors.PRIMARY,
        fontWeight: 'bold',
        fontFamily: 'outfit-bold',
    },
    recommendationsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        marginBottom: 15,
        fontFamily: 'outfit-bold',
    },
    recommendationCard: {
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    criticalCard: {
        backgroundColor: Colors.RED + '15',
        borderLeftWidth: 4,
        borderLeftColor: Colors.RED,
    },
    highCard: {
        backgroundColor: Colors.YELLOW + '15',
        borderLeftWidth: 4,
        borderLeftColor: Colors.YELLOW,
    },
    recommendationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    recommendationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        flex: 1,
        fontFamily: 'outfit-bold',
    },
    priorityBadge: {
        fontSize: 10,
        fontWeight: 'bold',
        color: Colors.WHITE,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: Colors.PRIMARY,
        fontFamily: 'outfit-bold',
    },
    criticalBadge: {
        backgroundColor: Colors.RED,
    },
    highBadge: {
        backgroundColor: Colors.YELLOW,
        color: Colors.DARK_GRAY,
    },
    recommendationDescription: {
        fontSize: 14,
        color: Colors.DARK_GRAY,
        lineHeight: 20,
        fontFamily: 'outfit',
    },
    feedingCard: {
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    feedingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    feedingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        marginLeft: 10,
        fontFamily: 'outfit-bold',
    },
    calorieAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'outfit-bold',
    },
    feedingNote: {
        fontSize: 12,
        color: Colors.GRAY,
        fontStyle: 'italic',
        textAlign: 'center',
        fontFamily: 'outfit',
    },
    nutritionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    nutritionItem: {
        width: '48%',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        backgroundColor: Colors.LIGHT_PRIMARY,
        borderRadius: 8,
    },
    nutritionLabel: {
        fontSize: 12,
        color: Colors.GRAY,
        marginBottom: 5,
        fontFamily: 'outfit',
    },
    nutritionValue: {
        fontSize: 16,
        color: Colors.PRIMARY,
        fontWeight: 'bold',
        fontFamily: 'outfit-bold',
    },
    supplementItem: {
        fontSize: 14,
        color: Colors.DARK_GRAY,
        marginBottom: 5,
        fontFamily: 'outfit',
    },
    restrictionItem: {
        fontSize: 14,
        color: Colors.RED,
        marginBottom: 5,
        fontFamily: 'outfit',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: Colors.WHITE,
        borderRadius: 20,
        padding: 20,
        width: width * 0.9,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.LIGHT_PRIMARY,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        fontFamily: 'outfit-bold',
    },
    modalBody: {
        maxHeight: 400,
    },
    modalItem: {
        fontSize: 14,
        color: Colors.DARK_GRAY,
        marginBottom: 8,
        lineHeight: 20,
        fontFamily: 'outfit',
    },
    modalText: {
        fontSize: 14,
        color: Colors.DARK_GRAY,
        lineHeight: 20,
        fontFamily: 'outfit',
    },
}); 