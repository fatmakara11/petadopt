// app/(tabs)/index.jsx
import { useUser } from '@clerk/clerk-expo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import PetListByCategory from '../components/PetListByCategory';
import Slider from '../components/Slider';

export default function HomeTab() {
    const { user } = useUser();

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeText}>
                            Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                        </Text>
                        <Text style={styles.subtitle}>
                            Find your perfect pet to adopt!
                        </Text>
                    </View>
                    <Image
                        source={{ uri: user?.imageUrl }}
                        style={styles.profileImage}
                    />
                </View>

                {/* Slider */}
                <Slider />

                {/* PetList+ Category */}
                <PetListByCategory />

                {/* Add new pet option */}
                <Link href={'/add-new-pet'}
                    style={styles.addNewPetContainer}>
                    <MaterialIcons name="pets" size={24} color={Colors.PRIMARY} />
                    <Text style={{
                        fontFamily: 'outfit-medium',
                        color: Colors.PRIMARY,
                        fontSize: 18

                    }}>Add New Pet</Text>
                </Link>

            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    addNewPetContainer: {

        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        padding: 20,
        marginTop: 40,
        textAlign: 'center',
        backgroundColor: Colors.LIGHT_PRIMARY,
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
        borderRadius: 15,
        borderStyle: 'dashed',
        justifyContent: 'center'
    },


    scrollView: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    welcomeContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    welcomeText: {
        fontSize: 20,
        fontFamily: 'outfit-bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'outfit',
        color: Colors.GRAY,
        marginBottom: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 99,
    },
});