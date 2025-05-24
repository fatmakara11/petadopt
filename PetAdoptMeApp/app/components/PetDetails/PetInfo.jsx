
import React from 'react';
import { Image, Text, View } from 'react-native';
import Colors from '../../../constants/Colors';
import MarkFav from '../MarkFav';

export default function PetInfo({ pet }) {

    console.log(pet)
    return (
        <View>
            <Image
                source={{ uri: pet?.imageUrl || 'https://placehold.co/400x300/png' }}
                style={{
                    width: '100%',
                    height: 300,
                }}
                resizeMode="cover"
                onError={(error) => console.log("Image Load Error:", error.nativeEvent)}
            />
            <View style={{
                padding: 20,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <View>
                    <Text style={{
                        fontFamily: 'outfit-bold',
                        fontSize: 24
                    }}>{pet?.name || 'Pet Name'}</Text>
                    <Text style={{
                        fontFamily: 'outfit',
                        fontSize: 16,
                        color: Colors.GRAY
                    }}>{pet?.address || 'No location'}</Text>
                </View>
                <MarkFav pet={pet} />
            </View>
        </View>
    )
}
