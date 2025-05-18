import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, getDocs } from '@firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import { db, storage } from '../../config/FirabaseConfig';
import Colors from '../../constants/Colors';

function generateRandomId(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export default function AddNewPet() {
    const router = useRouter();
    const { user } = useUser();
    const [formData, setFormData] = useState({ category: 'Dogs', sex: 'Male' });
    const [gender, setGender] = useState('Male');
    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [image, setImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);

    const handleInputChange = (fieldName, FieldValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: FieldValue
        }));
    };

    useEffect(() => {
        GetCategories();
    }, []);

    const GetCategories = async () => {
        try {
            setCategoryList([]);
            const snapshot = await getDocs(collection(db, 'Category'));
            const categories = [];
            snapshot.forEach((doc) => {
                categories.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setCategoryList(categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const imagePicker = async () => {
        try {
            setIsImageLoading(true);

            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images');
                setIsImageLoading(false);
                return;
            }

            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                console.log("Selected image URI:", uri);

                try {
                    const filename = uri.split('/').pop();
                    const localUri = FileSystem.cacheDirectory + filename;

                    await FileSystem.copyAsync({
                        from: uri,
                        to: localUri
                    });

                    console.log("Image copied to:", localUri);

                    const fileInfo = await FileSystem.getInfoAsync(localUri);
                    if (fileInfo.exists) {
                        setImage(localUri);
                        handleInputChange('imageUrl', localUri);
                        console.log("Image set successfully");
                    } else {
                        console.error("File doesn't exist after copying");
                        ToastAndroid.show("Error processing image. Please try again.", ToastAndroid.LONG);
                    }
                } catch (error) {
                    console.error("Error processing image:", error);
                    setImage(uri);
                    handleInputChange('imageUrl', uri);
                }
            } else {
                console.log("Image picker cancelled or no image selected");
            }
        } catch (error) {
            console.error("Image picker error:", error);
            ToastAndroid.show("Error selecting image. Please try again.", ToastAndroid.LONG);
        } finally {
            setIsImageLoading(false);
        }
    };

    const validateForm = () => {
        const requiredFields = ['name', 'breed', 'age', 'weight', 'address', 'about'];

        for (const field of requiredFields) {
            if (!formData[field]) {
                ToastAndroid.show(`Please enter ${field}`, ToastAndroid.SHORT);
                return false;
            }
        }

        if (!image) {
            ToastAndroid.show('Please select an image', ToastAndroid.SHORT);
            return false;
        }

        return true;
    };

    const onSubmit = () => {
        if (!validateForm()) {
            return;
        }
        setIsUploading(true);
        UploadImage();
    };

    const UploadImage = async () => {
        try {
            if (!image) {
                ToastAndroid.show('Lütfen bir resim seçin', ToastAndroid.SHORT);
                return;
            }

            const response = await fetch(image);
            const blob = await response.blob();

            const imageName = `Pet-Adopt/${Date.now()}.jpg`;
            const storageRef = ref(storage, imageName);

            const metadata = { contentType: 'image/jpeg' };

            await uploadBytes(storageRef, blob, metadata);

            const downloadUrl = await getDownloadURL(storageRef);

            const randomId = generateRandomId(16);

            await addDoc(collection(db, 'Pets'), {
                about: formData.about,
                address: formData.address,
                age: formData.age,
                breed: formData.breed,
                category: formData.category,
                id: randomId,
                imageUrl: downloadUrl,
                name: formData.name,
                sex: formData.sex,
                userImage: user.imageUrl,
                userName:
                    (user.firstName && user.lastName)
                        ? user.firstName + ' ' + user.lastName
                        : (user.firstName || user.lastName || user.username || user.emailAddresses[0]?.emailAddress || 'Unknown'),
                useremail: user.emailAddresses[0]?.emailAddress,
                weight: formData.weight,
                createdAt: new Date()
            });

            ToastAndroid.show('Pet başarıyla eklendi!', ToastAndroid.SHORT);
            router.back();
        } catch (error) {
            console.error("Firebase Storage upload hatası:", error);
            if (error.code === "storage/unauthorized") {
                ToastAndroid.show('Yetkiniz yok! Storage kurallarını kontrol edin.', ToastAndroid.LONG);
            } else if (error.code === "storage/unknown") {
                ToastAndroid.show('Bilinmeyen bir hata oluştu. Storage bucket adını ve bağlantınızı kontrol edin.', ToastAndroid.LONG);
            } else {
                ToastAndroid.show('Bir hata oluştu. Lütfen tekrar deneyin.', ToastAndroid.LONG);
            }
            setIsUploading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Pet</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                <Text style={{ fontFamily: 'outfit-medium', fontSize: 18 }}>
                    Add New Pet For Adoption
                </Text>

                <TouchableOpacity
                    style={styles.imagePickerContainer}
                    onPress={imagePicker}
                    disabled={isUploading || isImageLoading}
                >
                    {isImageLoading ? (
                        <View style={styles.imageLoading}>
                            <ActivityIndicator size="large" color={Colors.PRIMARY} />
                            <Text style={styles.loadingText}>Loading image...</Text>
                        </View>
                    ) : !image ? (
                        <View style={styles.addPhotoContainer}>
                            <Image
                                source={require('../../assets/images/placeholder.png')}
                                style={styles.imagePlaceholder}
                            />
                            <Text style={styles.addPhotoText}>Add Photo</Text>
                        </View>
                    ) : (
                        <View style={styles.photoPreviewContainer}>
                            <Image
                                source={{ uri: image }}
                                style={styles.selectedImage}
                                onError={() => {
                                    console.error("Error loading image from URI:", image);
                                    setImage(null);
                                }}
                            />
                            <Text style={styles.addPhotoText}>Update Photo</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Pet Name *</Text>
                    <TextInput style={styles.input} onChangeText={(value) => handleInputChange('name', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Pet Category *</Text>
                    <Picker
                        selectedValue={selectedCategory}
                        style={styles.input}
                        onValueChange={(itemValue) => {
                            setSelectedCategory(itemValue);
                            handleInputChange('category', itemValue);
                        }}
                    >
                        {categoryList.map((category, index) => (
                            <Picker.Item key={index} label={category.name} value={category.name} />
                        ))}
                    </Picker>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Breed *</Text>
                    <TextInput style={styles.input} onChangeText={(value) => handleInputChange('breed', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Age *</Text>
                    <TextInput style={styles.input} keyboardType='numeric' onChangeText={(value) => handleInputChange('age', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Gender *</Text>
                    <Picker
                        selectedValue={gender}
                        style={styles.input}
                        onValueChange={(itemValue) => {
                            setGender(itemValue);
                            handleInputChange('sex', itemValue);
                        }}
                    >
                        <Picker.Item label="Male" value="Male" />
                        <Picker.Item label="Female" value="Female" />
                    </Picker>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Weight *</Text>
                    <TextInput style={styles.input} keyboardType='numeric' onChangeText={(value) => handleInputChange('weight', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Address *</Text>
                    <TextInput style={styles.input} onChangeText={(value) => handleInputChange('address', value)} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>About *</Text>
                    <TextInput
                        style={[styles.input, { height: 100 }]}
                        numberOfLines={5}
                        multiline={true}
                        onChangeText={(value) => handleInputChange('about', value)}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, isUploading && styles.disabledButton]}
                    onPress={onSubmit}
                    disabled={isUploading || isImageLoading}
                >
                    {isUploading ? (
                        <View style={styles.buttonContent}>
                            <ActivityIndicator size="small" color="#fff" style={styles.buttonLoader} />
                            <Text style={styles.buttonText}>Uploading...</Text>
                        </View>
                    ) : (
                        <Text style={styles.buttonText}>Submit</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginTop: 30,
        backgroundColor: '#fff'
    },
    backButton: {
        padding: 5
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'outfit-medium',
        marginLeft: 10,
    },
    imagePickerContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    addPhotoContainer: {
        alignItems: 'center',
    },
    photoPreviewContainer: {
        alignItems: 'center',
    },
    imagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.GRAY,
    },
    selectedImage: {
        width: 120,
        height: 120,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
    },
    imageLoading: {
        width: 120,
        height: 120,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.GRAY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontFamily: 'outfit',
        fontSize: 14,
        color: Colors.PRIMARY
    },
    inputContainer: {
        marginVertical: 8
    },
    input: {
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 7,
        fontFamily: 'outfit',
        borderWidth: 1,
        borderColor: '#e0e0e0'
    },
    label: {
        marginBottom: 5,
        fontFamily: 'outfit',
        fontSize: 14
    },
    button: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 7,
        marginVertical: 15,
        marginBottom: 50,
        alignItems: 'center'
    },
    disabledButton: {
        opacity: 0.7
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonLoader: {
        marginRight: 10
    },
    buttonText: {
        fontFamily: 'outfit-medium',
        color: '#fff',
        fontSize: 16
    },
    addPhotoText: {
        marginTop: 8,
        fontFamily: 'outfit',
        color: Colors.PRIMARY,
        textAlign: 'center',
        fontSize: 14
    }
});
