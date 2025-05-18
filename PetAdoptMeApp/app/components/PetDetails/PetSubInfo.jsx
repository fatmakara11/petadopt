import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../../constants/Colors';

export default function PetSubInfo({ pet }) {
    const [readMore, setReadMore] = useState(false);

    return (
        <View style={{
            padding: 20
        }}>
            {/* First row */}
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10
            }}>
                {/* Age box */}
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: Colors.WHITE,
                    padding: 15,
                    borderRadius: 8,
                    gap: 10,
                    flex: 1,
                    marginRight: 8
                }}>
                    <Image source={require('../../../assets/images/calendar.png')}
                        style={{
                            width: 32,
                            height: 32
                        }} />
                    <View>
                        <Text style={{
                            fontFamily: 'outfit',
                            fontSize: 14,
                            color: Colors.GRAY
                        }}>Age</Text>
                        <Text style={{
                            fontFamily: 'outfit-medium',
                            fontSize: 16
                        }}>{pet?.age} Years</Text>
                    </View>
                </View>

                {/* Breed box */}
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: Colors.WHITE,
                    padding: 15,
                    borderRadius: 8,
                    gap: 10,
                    flex: 1
                }}>
                    <Image source={require('../../../assets/images/bone.png')}
                        style={{
                            width: 32,
                            height: 32
                        }} />
                    <View>
                        <Text style={{
                            fontFamily: 'outfit',
                            fontSize: 14,
                            color: Colors.GRAY
                        }}>Breed</Text>
                        <Text style={{
                            fontFamily: 'outfit-medium',
                            fontSize: 16
                        }}>{pet?.breed}</Text>
                    </View>
                </View>
            </View>

            {/* Second row */}
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                {/* Sex box */}
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: Colors.WHITE,
                    padding: 15,
                    borderRadius: 8,
                    gap: 10,
                    flex: 1,
                    marginRight: 8
                }}>
                    <Image source={require('../../../assets/images/sex.png')}
                        style={{
                            width: 32,
                            height: 32
                        }} />
                    <View>
                        <Text style={{
                            fontFamily: 'outfit',
                            fontSize: 14,
                            color: Colors.GRAY
                        }}>Sex</Text>
                        <Text style={{
                            fontFamily: 'outfit-medium',
                            fontSize: 16
                        }}>{pet?.sex}</Text>
                    </View>
                </View>

                {/* Weight box */}
                <View style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: Colors.WHITE,
                    padding: 15,
                    borderRadius: 8,
                    gap: 10,
                    flex: 1
                }}>
                    <Image source={require('../../../assets/images/weight.png')}
                        style={{
                            width: 32,
                            height: 32
                        }} />
                    <View>
                        <Text style={{
                            fontFamily: 'outfit',
                            fontSize: 14,
                            color: Colors.GRAY
                        }}>Weight</Text>
                        <Text style={{
                            fontFamily: 'outfit-medium',
                            fontSize: 16
                        }}>{pet?.weight} Kg</Text>
                    </View>
                </View>
            </View>

            {/* About Section */}
            <View style={{
                marginTop: 20
            }}>
                <Text style={{
                    fontFamily: 'outfit-medium',
                    fontSize: 18,
                    marginBottom: 10
                }}>About {pet?.name}</Text>
                <Text numberOfLines={readMore ? undefined : 3} style={{
                    fontFamily: 'outfit',
                    fontSize: 14,
                    color: Colors.GRAY,
                    lineHeight: 20
                }}>
                    {pet?.about}
                </Text>
                {readMore && (
                    <TouchableOpacity onPress={() => setReadMore(false)}>
                        <Text style={{
                            fontFamily: 'outfit-medium',
                            fontSize: 14,
                            color: Colors.SECONDARY,
                            marginTop: 5
                        }}>
                            Read Less
                        </Text>
                    </TouchableOpacity>
                )}
                {!readMore && (
                    <TouchableOpacity onPress={() => setReadMore(true)}>
                        <Text style={{
                            fontFamily: 'outfit-medium',
                            fontSize: 14,
                            color: Colors.SECONDARY,
                            marginTop: 5
                        }}>
                            Read More
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
} 