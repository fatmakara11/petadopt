import { useUser } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { db } from '../../config/FirabaseConfig'
import Colors from '../../constants/Colors'
import UserItem from '../components/inbox/UserItem'

export default function Inbox() {
    const { user } = useUser();
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredList, setFilteredList] = useState([]);

    useEffect(() => {
        if (user) {
            GetUserList();
        }
    }, [user]);

    useEffect(() => {
        if (userList.length > 0) {
            const filtered = FilterUserList();
            setFilteredList(filtered);
        }
    }, [userList]);

    // 🗑️ Tüm sohbetleri Firebase'den sil
    const deleteAllChats = async () => {
        try {
            console.log("🗑️ Tüm sohbetler siliniyor...");
            const allChatsQuery = query(collection(db, 'Chat'));
            const allChatsSnapshot = await getDocs(allChatsQuery);

            console.log("📊 Silinecek sohbet sayısı:", allChatsSnapshot.size);

            for (const chatDoc of allChatsSnapshot.docs) {
                console.log("🗑️ Sohbet siliniyor:", chatDoc.id);
                await deleteDoc(doc(db, 'Chat', chatDoc.id));
            }

            console.log("✅ Tüm sohbetler silindi!");
            setUserList([]);
            setFilteredList([]);
        } catch (error) {
            console.error("❌ Sohbet silme hatası:", error);
        }
    };

    //kullanıcı listesinin alınması mevcut kullanıcı e-postalarına bağlıdır
    const GetUserList = async () => {
        setLoading(true);
        setUserList([]);

        const currentUserEmail = user?.primaryEmailAddress?.emailAddress;
        console.log("📧 Inbox yükleniyor - Kullanıcı email:", currentUserEmail);

        if (!currentUserEmail) {
            console.error("❌ Kullanıcı email'i bulunamadı");
            setLoading(false);
            return;
        }

        try {
            // Firebase'den bu kullanıcının dahil olduğu tüm sohbetleri al
            console.log("🔍 Firebase query: userIds array-contains", currentUserEmail);
            const q = query(collection(db, 'Chat'),
                where('userIds', 'array-contains', currentUserEmail));
            const querySnapshot = await getDocs(q);

            console.log("📊 Firebase'den dönen sohbet sayısı:", querySnapshot.size);

            if (querySnapshot.size === 0) {
                console.log("❌ Bu kullanıcı için hiçbir sohbet bulunamadı!");
                console.log("🔍 Kontrol edilecek email:", currentUserEmail);
            }

            const chatList = [];
            querySnapshot.forEach((doc) => {
                const chatData = doc.data();
                console.log("\n💬 Bulunan sohbet:");
                console.log("📄 Document ID:", doc.id);
                console.log("📧 UserIds array:", chatData.userIds);
                console.log("👥 Users array:", chatData.users?.map(u => ({ email: u.email, name: u.name })));
                console.log("✅ Array contains check:", chatData.userIds?.includes(currentUserEmail));

                chatList.push({
                    id: doc.id,
                    ...chatData
                });
            });

            console.log("✅ Toplanan sohbet listesi:", chatList.length, "adet");
            setUserList(chatList);
        } catch (error) {
            console.error("❌ Sohbet listesi yükleme hatası:", error);
        } finally {
            setLoading(false);
        }
    }

    //diğer kullanıcıların listesini filtrele
    const FilterUserList = () => {
        const list = [];
        const currentUserEmail = user?.primaryEmailAddress?.emailAddress;

        console.log("🔄 Filtreleme başlıyor - Mevcut kullanıcı:", currentUserEmail);
        console.log("📋 Toplam işlenecek sohbet:", userList.length);

        userList.forEach((record, index) => {
            console.log(`\n--- Sohbet ${index + 1} işleniyor ---`);
            console.log("📄 Record ID:", record.id);
            console.log("📧 UserIds:", record.userIds);
            console.log("👥 Users array:", record.users);

            // userIds kontrolü
            if (!record.userIds || !Array.isArray(record.userIds)) {
                console.warn("⚠️ userIds eksik veya geçersiz");
                return;
            }

            // users kontrolü
            if (!record.users || !Array.isArray(record.users)) {
                console.warn("⚠️ users array eksik veya geçersiz");
                return;
            }

            // Diğer kullanıcıyı bul
            const otherUser = record.users.find((u) =>
                u && u.email && u.email !== currentUserEmail
            );

            console.log("🔍 Bulunan diğer kullanıcı:", otherUser);

            if (otherUser) {
                const result = {
                    docId: record.id,
                    email: otherUser.email,
                    name: otherUser.name || otherUser.email?.split('@')[0] || 'Kullanıcı',
                    imageUrl: otherUser.imageUrl || '',
                    role: otherUser.role || 'user',
                    petId: otherUser.petId || '',
                    petName: otherUser.petName || ''
                };

                console.log("✅ Listeye eklenen kullanıcı:", result);
                list.push(result);
            } else {
                console.warn("❌ Bu sohbette diğer kullanıcı bulunamadı");
            }
        });

        console.log("🎯 Final filtrelenmiş liste:", list.length, "adet");
        return list;
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Clean header design */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.sectionTitle}>Sohbetler</Text>
                    {filteredList.length > 0 && (
                        <View style={styles.countContainer}>
                            <Text style={styles.countText}>{filteredList.length}</Text>
                        </View>
                    )}
                    {/* 🗑️ Temizle butonu */}
                    <TouchableOpacity onPress={deleteAllChats} style={styles.cleanButton}>
                        <Text style={styles.cleanButtonText}>🗑️ Temizle</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.PRIMARY} />
                    <Text style={styles.loadingText}>Sohbetler yükleniyor...</Text>
                </View>
            ) : (
                <FlatList
                    style={styles.listContainer}
                    data={filteredList}
                    refreshing={loading}
                    onRefresh={GetUserList}
                    keyExtractor={(item) => item.docId || Math.random().toString()}
                    renderItem={({ item }) => {
                        console.log("Rendering item:", item);
                        return <UserItem userInfo={item} />;
                    }}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconContainer}>
                                <Ionicons name="chatbubble-ellipses-outline" size={60} color="#fff" />
                            </View>
                            <Text style={styles.emptyTitle}>Henüz sohbetiniz yok</Text>
                            <Text style={styles.emptyMessage}>
                                Pet sahipleriyle iletişime geçerek bir sohbet başlatabilirsiniz
                            </Text>
                        </View>
                    )}
                    contentContainerStyle={filteredList.length === 0 ? { flex: 1, justifyContent: 'center' } : null}
                />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    countContainer: {
        backgroundColor: Colors.PRIMARY,
        height: 24,
        width: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    countText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    cleanButton: {
        backgroundColor: '#FF4444',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        marginLeft: 10,
    },
    cleanButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    listContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    emptyMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
});