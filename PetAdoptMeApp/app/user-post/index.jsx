import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { query } from 'firebase/database';
import { collection, deleteDoc, doc, getDocs, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import { db } from '../../config/FirabaseConfig';
import Colors from '../../constants/Colors';
import PetListItem from '../components/PetListItem';

export default function UserPost() {
    const navigation = useNavigation();
    const { user } = useUser();
    const router = useRouter();
    const [loader, setLoader] = useState(false);
    const [userPostList, setUserPostList] = useState([]);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: 'User Post'
        });
        user && GetUserPost();
    }, [user]);

    /**
     * Used to get User Post
     */
    const GetUserPost = async () => {
        setLoader(true);
        setUserPostList([]);
        const q = query(collection(db, 'Pets'), where('useremail', '==', user?.emailAddresses[0]?.emailAddress));
        const querySnapshot = await getDocs(q);
        const posts = [];
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            posts.push({ ...doc.data(), docId: doc.id });
        });
        setUserPostList(posts);
        setLoader(false);
    }

    const deletePostFromFirebase = async (docId) => {
        try {
            // Firebase'den silme işlemi
            await deleteDoc(doc(db, 'Pets', docId));

            // Local state'den silme
            setUserPostList(prev => prev.filter(item => item.docId !== docId));

            ToastAndroid.show('Post successfully deleted!', ToastAndroid.SHORT);
        } catch (error) {
            console.error('Error deleting post:', error);
            ToastAndroid.show('Error deleting post. Please try again.', ToastAndroid.LONG);
        }
    };

    const OnDeletePost = (docId) => {
        Alert.alert('Do You want to Delete?', 'Do you really want to delete this post', [
            {
                text: 'Cancel',
                onPress: () => console.log("Cancel Click"),
                style: 'cancel'
            },
            {
                text: 'Delete',
                onPress: () => deletePostFromFirebase(docId)
            }
        ]);
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>User Post</Text>
            </View>

            <View style={{ padding: 20 }}>
                <Text style={{
                    fontFamily: 'outfit-medium',
                    fontSize: 30
                }}>UserPost</Text>

                <FlatList
                    data={userPostList}
                    numColumns={2}
                    refreshing={loader}
                    onRefresh={GetUserPost}
                    contentContainerStyle={styles.flatListContainer}
                    columnWrapperStyle={styles.row}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <View style={styles.petItemContainer}>
                            <PetListItem pet={item} key={index} />
                            <Pressable onPress={() => OnDeletePost(item?.docId)} style={styles.deleteButton}>
                                <Text style={{
                                    fontFamily: 'outfit',
                                    textAlign: 'center'
                                }}>Delete</Text>
                            </Pressable>
                        </View>
                    )}
                />
            </View>
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
    deleteButton: {
        backgroundColor: Colors.LIGHT_PRIMARY,
        padding: 5,
        borderRadius: 7,
        marginTop: 5,
        marginRight: 10
    },
    flatListContainer: {
        padding: 10,
    },
    row: {
        justifyContent: 'space-between',
    },
    petItemContainer: {
        marginBottom: 10,
    }
});