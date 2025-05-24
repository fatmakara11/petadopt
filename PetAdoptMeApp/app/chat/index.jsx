import { useUser } from '@clerk/clerk-expo';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db, storage } from '../../config/FirabaseConfig';
import Colors from '../../constants/Colors';

export default function ChatScreen() {
    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const router = useRouter();
    const { user } = useUser();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [otherUserInfo, setOtherUserInfo] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [viewingImage, setViewingImage] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);

    const flatListRef = useRef(null);

    useEffect(() => {
        console.log("Chat sayfası açıldı, params:", params);
        if (params?.id) {
            GetUserDetails();
            const unsubscribe = loadMessages();
            return () => {
                if (unsubscribe) unsubscribe();
            };
        } else {
            setError("Sohbet ID'si bulunamadı");
            setLoading(false);
        }
    }, [params?.id]);

    // Mesajları Firebase'den yükle
    const loadMessages = () => {
        try {
            console.log("Mesajlar yükleniyor...");
            if (!params?.id) {
                console.error("Chat ID bulunamadı");
                setError("Sohbet bulunamadı");
                setLoading(false);
                return null;
            }

            const chatRef = collection(db, 'Chat', params.id, 'messages');
            const q = query(chatRef, orderBy('createdAt', 'desc'));

            return onSnapshot(q,
                (snapshot) => {
                    console.log("Mesaj sayısı:", snapshot.docs.length);
                    const msgs = snapshot.docs.map(doc => {
                        const data = doc.data();

                        // Timestamp işleme
                        let msgDate = new Date();

                        if (data.createdAt) {
                            try {
                                if (typeof data.createdAt.toDate === 'function') {
                                    msgDate = data.createdAt.toDate();
                                } else if (data.createdAt.seconds) {
                                    msgDate = new Date(data.createdAt.seconds * 1000);
                                } else {
                                    msgDate = new Date(data.createdAt);
                                }
                            } catch (err) {
                                console.error("Tarih dönüşüm hatası:", err);
                                msgDate = new Date();
                            }
                        }

                        return {
                            _id: data._id || doc.id,
                            text: data.text || "",
                            createdAt: msgDate,
                            user: data.user || { _id: 1 },
                            image: data.image || null,
                            video: data.video || null,
                        };
                    });

                    setMessages(msgs);
                    setLoading(false);
                },
                (err) => {
                    console.error("Mesaj yükleme hatası:", err);
                    setError(err.message);
                    setLoading(false);
                }
            );
        } catch (err) {
            console.error("Mesaj yükleme hatası:", err);
            setError(err.message);
            setLoading(false);
            return null;
        }
    };

    /**
     * Get Users Info
     */
    const GetUserDetails = async () => {
        try {
            console.log("Kullanıcı detayları yükleniyor...");
            const docRef = doc(db, 'Chat', params?.id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                console.error("Sohbet bulunamadı");
                setError("Sohbet bulunamadı");
                setLoading(false);
                return;
            }

            const result = docSnap.data();
            console.log("Sohbet bilgileri:", result);
            setChatData(result);

            if (!result?.users || !Array.isArray(result.users)) {
                console.error("Geçersiz sohbet verileri");
                setError("Sohbet bilgileri yüklenemedi");
                setLoading(false);
                return;
            }

            // Güvenli kullanıcı e-posta kontrolü
            const currentUserEmail = user?.primaryEmailAddress?.emailAddress || "";

            if (!currentUserEmail) {
                console.error("Kullanıcı email bilgisi bulunamadı");
                setError("Kullanıcı bilgilerinize erişilemedi");
                setLoading(false);
                return;
            }

            // Diğer kullanıcının bilgilerini bul - e-posta kontrolünü güvenli şekilde yap
            let otherUser = null;
            for (const item of result.users) {
                if (item && item.email && item.email !== currentUserEmail) {
                    otherUser = item;
                    break;
                }
            }

            console.log("Diğer kullanıcı:", otherUser);

            if (otherUser) {
                setOtherUserInfo(otherUser);
            }
        } catch (err) {
            console.error("Kullanıcı detayları yükleme hatası:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    // Resim seçme
    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('İzin gerekli', 'Lütfen galeri erişim izni verin');
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedUri = result.assets[0].uri;
                setSelectedImage(selectedUri);
                uploadAndSendImage(selectedUri);
            }
        } catch (error) {
            console.error("Resim seçme hatası:", error);
            Alert.alert("Hata", "Resim seçilirken bir hata oluştu");
        }
    };

    // Video seçme
    const pickVideo = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('İzin gerekli', 'Lütfen galeri erişim izni verin');
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedUri = result.assets[0].uri;
                uploadAndSendVideo(selectedUri);
            }
        } catch (error) {
            console.error("Video seçme hatası:", error);
            Alert.alert("Hata", "Video seçilirken bir hata oluştu");
        }
    };

    // Dosya yükleme ve gönderme
    const uploadAndSendImage = async (uri) => {
        try {
            setIsUploading(true);
            const response = await fetch(uri);
            const blob = await response.blob();

            const imageName = `chat_images/${params.id}/${Date.now()}.jpg`;
            const storageRef = ref(storage, imageName);

            await uploadBytes(storageRef, blob);
            const downloadUrl = await getDownloadURL(storageRef);

            // Mesaj gönderme
            const messageId = Date.now().toString();
            const chatRef = collection(db, 'Chat', params.id, 'messages');

            await addDoc(chatRef, {
                text: "",
                createdAt: new Date(),
                _id: messageId,
                image: downloadUrl,
                user: {
                    _id: user?.primaryEmailAddress?.emailAddress || "guest@example.com",
                    name: user?.userName || user?.firstName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || "Kullanıcı",
                    avatar: user?.imageUrl || ""
                }
            });

            setSelectedImage(null);
            setIsUploading(false);
        } catch (error) {
            console.error("Resim yükleme hatası:", error);
            Alert.alert("Hata", "Resim yüklenirken bir hata oluştu");
            setIsUploading(false);
        }
    };

    const uploadAndSendVideo = async (uri) => {
        try {
            setIsUploading(true);
            const response = await fetch(uri);
            const blob = await response.blob();

            const videoName = `chat_videos/${params.id}/${Date.now()}.mp4`;
            const storageRef = ref(storage, videoName);

            await uploadBytes(storageRef, blob);
            const downloadUrl = await getDownloadURL(storageRef);

            // Mesaj gönderme
            const messageId = Date.now().toString();
            const chatRef = collection(db, 'Chat', params.id, 'messages');

            await addDoc(chatRef, {
                text: "",
                createdAt: new Date(),
                _id: messageId,
                video: downloadUrl,
                user: {
                    _id: user?.primaryEmailAddress?.emailAddress || "guest@example.com",
                    name: user?.userName || user?.firstName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || "Kullanıcı",
                    avatar: user?.imageUrl || ""
                }
            });

            setIsUploading(false);
        } catch (error) {
            console.error("Video yükleme hatası:", error);
            Alert.alert("Hata", "Video yüklenirken bir hata oluştu");
            setIsUploading(false);
        }
    };

    const sendMessage = () => {
        try {
            if (!messageText.trim()) {
                console.error("Geçersiz mesaj");
                return;
            }

            console.log("Mesaj gönderiliyor:", messageText);

            // Mesaj ID'si oluştur
            const messageId = Date.now().toString();

            // Firebase'e kaydet
            const chatRef = collection(db, 'Chat', params.id, 'messages');
            addDoc(chatRef, {
                text: messageText,
                createdAt: new Date(),
                _id: messageId,
                user: {
                    _id: user?.primaryEmailAddress?.emailAddress || "guest@example.com",
                    name: user?.userName || user?.firstName || user?.primaryEmailAddress?.emailAddress?.split('@')[0] || "Kullanıcı",
                    avatar: user?.imageUrl || ""
                }
            }).then(() => {
                setMessageText("");
                console.log("Mesaj Firebase'e kaydedildi");
            }).catch(err => {
                console.error("Mesaj gönderme hatası:", err);
                alert("Mesaj gönderilemedi: " + err.message);
            });
        } catch (err) {
            console.error("Mesaj gönderme hatası:", err);
            alert("Mesaj gönderilemedi: " + err.message);
        }
    };

    const formatTime = (date) => {
        try {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (err) {
            return '';
        }
    };

    const handleImagePress = (imageUrl) => {
        setViewingImage(imageUrl);
        setShowImageModal(true);
    };

    const renderMessageItem = ({ item }) => {
        const isCurrentUser = item.user._id === user?.primaryEmailAddress?.emailAddress;

        return (
            <View style={[
                styles.messageBubble,
                isCurrentUser ? styles.userMessage : styles.otherMessage
            ]}>
                {item.image && (
                    <TouchableOpacity onPress={() => handleImagePress(item.image)}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.messageImage}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                )}

                {item.video && (
                    <View style={styles.videoContainer}>
                        <TouchableOpacity style={styles.videoThumbnail}>
                            <MaterialIcons name="play-circle-filled" size={40} color="white" />
                            <Text style={styles.videoText}>Video</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {item.text && (
                    <Text style={[
                        styles.messageText,
                        isCurrentUser ? styles.userMessageText : styles.otherMessageText
                    ]}>
                        {item.text}
                    </Text>
                )}

                <Text style={[
                    styles.messageTime,
                    isCurrentUser ? styles.userMessageTime : styles.otherMessageTime
                ]}>
                    {formatTime(item.createdAt)}
                </Text>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
                <Text style={styles.loadingText}>Sohbet yükleniyor...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>Bir hata oluştu</Text>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            {/* Custom Header */}
            <View style={styles.customHeader}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {otherUserInfo?.name || "Sohbet"}
                </Text>
                <View style={styles.headerRight} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                enabled={Platform.OS === 'ios'}
            >
                {isUploading && (
                    <View style={styles.uploadingContainer}>
                        <ActivityIndicator size="small" color={Colors.PRIMARY} />
                        <Text style={styles.uploadingText}>Dosya yükleniyor...</Text>
                    </View>
                )}

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessageItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.messagesContainer}
                    inverted={true}
                />

                <View style={styles.inputContainer}>
                    <View style={styles.inputActions}>
                        <TouchableOpacity onPress={pickImage} style={styles.attachButton}>
                            <Ionicons name="image-outline" size={24} color="#666" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={pickVideo} style={styles.attachButton}>
                            <Ionicons name="videocam-outline" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Mesaj yazın..."
                        placeholderTextColor="#999"
                        value={messageText}
                        onChangeText={setMessageText}
                        multiline={false}
                    />

                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            !messageText.trim() && styles.sendButtonDisabled
                        ]}
                        onPress={sendMessage}
                        disabled={!messageText.trim()}
                    >
                        <Ionicons
                            name="send"
                            size={24}
                            color={messageText.trim() ? Colors.PRIMARY : '#ccc'}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* Image Viewer Modal */}
            <Modal
                visible={showImageModal}
                transparent={true}
                onRequestClose={() => setShowImageModal(false)}
            >
                <View style={styles.imageViewerContainer}>
                    <TouchableOpacity
                        style={styles.imageViewerCloseButton}
                        onPress={() => setShowImageModal(false)}
                    >
                        <Ionicons name="close" size={28} color="white" />
                    </TouchableOpacity>

                    <Image
                        source={{ uri: viewingImage }}
                        style={styles.fullScreenImage}
                        resizeMode="contain"
                    />
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8'
    },
    customHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 40,
        paddingBottom: 10,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    headerRight: {
        width: 40, // To balance the header
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555'
    },
    uploadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    uploadingText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#555',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    errorTitle: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 18,
        fontWeight: 'bold'
    },
    errorText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#555'
    },
    messagesContainer: {
        paddingHorizontal: 10,
        paddingBottom: 10
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 15,
        marginVertical: 5,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: Colors.PRIMARY,
    },
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#F0F0F0',
    },
    messageText: {
        fontSize: 16,
    },
    userMessageText: {
        color: 'white',
    },
    otherMessageText: {
        color: 'black',
    },
    messageTime: {
        fontSize: 12,
        marginTop: 2,
        alignSelf: 'flex-end',
    },
    userMessageTime: {
        color: 'rgba(255,255,255,0.7)',
    },
    otherMessageTime: {
        color: 'gray',
    },
    messageImage: {
        width: 200,
        height: 150,
        borderRadius: 10,
        marginBottom: 8,
    },
    videoContainer: {
        width: 200,
        height: 150,
        borderRadius: 10,
        marginBottom: 8,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoThumbnail: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoText: {
        color: 'white',
        marginTop: 5,
        fontSize: 14,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    inputActions: {
        flexDirection: 'row',
        marginRight: 10,
    },
    attachButton: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
    },
    sendButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    imageViewerContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageViewerCloseButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
    },
    fullScreenImage: {
        width: '100%',
        height: '80%',
    }
});

// exportu fonksiyon başında yapıyoruz