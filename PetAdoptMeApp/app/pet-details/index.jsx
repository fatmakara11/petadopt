import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../config/FirabaseConfig';
import Colors from '../../constants/Colors';
import OwnerInfo from '../components/PetDetails/OwnerInfo';
import PetInfo from '../components/PetDetails/PetInfo';
import PetSubInfo from '../components/PetDetails/PetSubInfo';

export default function PetDetails() {
    const router = useRouter();
    const pet = useLocalSearchParams();
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    // İki kullanıcı arasında sohbet başlatmak için kullanıldı
    const InitiateChat = async () => {
        try {
            setLoading(true);
            console.log("Sohbet başlatılıyor...");
            console.log("Kullanıcı:", user?.primaryEmailAddress?.emailAddress);
            console.log("Pet sahibi:", pet?.useremail);

            // Email bilgilerini kontrol et
            if (!user?.primaryEmailAddress?.emailAddress) {
                alert("Sohbet başlatmak için giriş yapmalısınız");
                setLoading(false);
                return;
            }

            // Pet sahibinin email'ini al (useremail field'i kullan)
            const petOwnerEmail = pet?.useremail || pet?.email;

            if (!petOwnerEmail) {
                alert("Pet sahibi bilgileri bulunamadı");
                setLoading(false);
                return;
            }

            console.log("Kullanılan pet sahibi email:", petOwnerEmail);
            console.log("Mevcut kullanıcı email:", user.primaryEmailAddress.emailAddress);

            // Kendi pet'inle sohbet etmeye çalışma kontrolü
            if (user.primaryEmailAddress.emailAddress === petOwnerEmail) {
                alert("Kendi pet'inizle sohbet edemezsiniz");
                setLoading(false);
                return;
            }

            // Benzersiz sohbet ID'si oluştur - emails alfabetik sıraya koy
            const sortedEmails = [user.primaryEmailAddress.emailAddress, petOwnerEmail].sort();
            const chatId = sortedEmails.join('_');

            // Kullanıcı ID'leri array'i
            const userIds = [
                user.primaryEmailAddress.emailAddress,
                petOwnerEmail
            ];

            console.log("Chat ID:", chatId);
            console.log("User IDs:", userIds);

            // Firebase'de mevcut sohbeti kontrol et - daha güvenli yöntem
            const chatQuery = query(
                collection(db, 'Chat'),
                where('userIds', 'array-contains', user.primaryEmailAddress.emailAddress)
            );
            const querySnapshot = await getDocs(chatQuery);

            // Aynı iki kullanıcı arasında sohbet var mı kontrol et
            let existingChatId = null;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.userIds &&
                    data.userIds.includes(user.primaryEmailAddress.emailAddress) &&
                    data.userIds.includes(petOwnerEmail)) {
                    existingChatId = doc.id;
                }
            });

            // Mevcut sohbet varsa, ona yönlendir
            if (existingChatId) {
                console.log("Mevcut sohbet bulundu:", existingChatId);
                router.push({
                    pathname: '/chat',
                    params: { id: existingChatId }
                });
                setLoading(false);
                return;
            }

            // Yeni sohbet oluştur
            console.log("Yeni sohbet oluşturuluyor...");

            // 🔧 İsim bilgilerini daha akıllı şekilde al
            const currentUserName = user?.userName ||
                user?.firstName + ' ' + user?.lastName ||
                user?.firstName ||
                user?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
                'Kullanıcı';

            const petOwnerName = pet?.userName ||
                pet?.ownerName ||
                petOwnerEmail?.split('@')[0] ||
                'Pet Sahibi';

            console.log("🏷️ Kullanıcı adları:");
            console.log("Current user name:", currentUserName);
            console.log("Pet owner name:", petOwnerName);

            const chatData = {
                id: chatId,
                userIds: userIds,
                users: [
                    {
                        email: user.primaryEmailAddress.emailAddress,
                        imageUrl: user?.imageUrl || '',
                        name: currentUserName,
                        role: 'adopter'
                    },
                    {
                        email: petOwnerEmail,
                        imageUrl: pet?.userImage || '',
                        name: petOwnerName,
                        petId: pet?.id || '',
                        petName: pet?.name || '',
                        role: 'owner'
                    }
                ],
                petDetails: {
                    id: pet?.id || '',
                    name: pet?.name || '',
                    image: pet?.imageUrl || pet?.image || '',
                    breed: pet?.breed || ''
                },
                createdAt: new Date(),
                lastMessage: null,
                lastMessageTime: new Date()
            };

            console.log("Oluşturulacak chat data:", chatData);

            await setDoc(doc(db, 'Chat', chatId), chatData);

            console.log("Sohbet başarıyla oluşturuldu!");

            // Yeni sohbete yönlendir
            router.push({
                pathname: '/chat',
                params: { id: chatId }
            });
        } catch (error) {
            console.error("Sohbet başlatma hatası:", error);
            alert("Sohbet başlatılırken bir hata oluştu: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            <ScrollView style={styles.scrollView}>
                {/* Pet Info */}
                <PetInfo pet={pet} />

                {/* Pet Sub Info*/}
                <PetSubInfo pet={pet} />

                {/* Owner details */}
                <OwnerInfo pet={pet} />

                {/* Extra space at bottom for scrolling past the fixed button */}
                <View style={{ height: 100 }}></View>
            </ScrollView>

            {/* Custom back button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push('/(tabs)')}
            >
                <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
            </TouchableOpacity>

            {/* Adopt me button - fixed at bottom */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    onPress={InitiateChat}
                    disabled={loading}
                    style={styles.adoptButton}>
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.adoptButtonText}>Adopt Me</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    scrollView: {
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.PRIMARY,
    },
    adoptButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
    adoptButtonText: {
        textAlign: 'center',
        fontFamily: 'outfit-medium',
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.WHITE,
    }
});






