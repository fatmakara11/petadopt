import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { doc, getDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Colors from '../colors';
import FavoriteButton from '../components/FavoriteButton';

const PetDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);
    const [error, setError] = useState(null);
    const [readMore, setReadMore] = useState(false);

    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                setLoading(true);

                // ID'ye göre pet belgelerini ara
                const petsCollection = collection(db, 'Pets');
                const q = query(petsCollection, where('id', '==', id));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setError('Pet bulunamadı');
                    return;
                }

                // İlk eşleşen belgeyi al
                const petData = {
                    id: querySnapshot.docs[0].id,
                    ...querySnapshot.docs[0].data()
                };

                setPet(petData);
            } catch (err) {
                console.error('Pet detaylarını getirirken hata:', err);
                setError('Pet detaylarını yüklerken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPetDetails();
        }
    }, [id]);

    // İki kullanıcı arasında sohbet başlatmak için kullanıldı (mobil uygulamadan adapte edildi)
    const initiateChat = async () => {
        try {
            setChatLoading(true);
            console.log("Sohbet başlatılıyor...");
            console.log("Kullanıcı:", user?.emailAddresses?.[0]?.emailAddress);
            console.log("Pet sahibi:", pet?.useremail);

            // Email bilgilerini kontrol et
            if (!user?.emailAddresses?.[0]?.emailAddress) {
                alert("Sohbet başlatmak için giriş yapmalısınız");
                setChatLoading(false);
                return;
            }

            // Pet sahibinin email'ini al (useremail field'i kullan)
            const petOwnerEmail = pet?.useremail || pet?.email;

            if (!petOwnerEmail) {
                alert("Pet sahibi bilgileri bulunamadı");
                setChatLoading(false);
                return;
            }

            console.log("Kullanılan pet sahibi email:", petOwnerEmail);
            console.log("Mevcut kullanıcı email:", user.emailAddresses[0].emailAddress);

            // Kendi pet'inle sohbet etmeye çalışma kontrolü
            if (user.emailAddresses[0].emailAddress === petOwnerEmail) {
                alert("Kendi pet'inizle sohbet edemezsiniz");
                setChatLoading(false);
                return;
            }

            // Benzersiz sohbet ID'si oluştur - emails alfabetik sıraya koy
            const sortedEmails = [user.emailAddresses[0].emailAddress, petOwnerEmail].sort();
            const chatId = sortedEmails.join('_');

            // Kullanıcı ID'leri array'i
            const userIds = [
                user.emailAddresses[0].emailAddress,
                petOwnerEmail
            ];

            console.log("Chat ID:", chatId);
            console.log("User IDs:", userIds);

            // Firebase'de mevcut sohbeti kontrol et - daha güvenli yöntem
            const chatQuery = query(
                collection(db, 'Chat'),
                where('userIds', 'array-contains', user.emailAddresses[0].emailAddress)
            );
            const querySnapshot = await getDocs(chatQuery);

            // Aynı iki kullanıcı arasında sohbet var mı kontrol et
            let existingChatId = null;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.userIds &&
                    data.userIds.includes(user.emailAddresses[0].emailAddress) &&
                    data.userIds.includes(petOwnerEmail)) {
                    existingChatId = doc.id;
                }
            });

            // Mevcut sohbet varsa, ona yönlendir
            if (existingChatId) {
                console.log("Mevcut sohbet bulundu:", existingChatId);
                navigate('/inbox');
                setChatLoading(false);
                return;
            }

            // Yeni sohbet oluştur
            console.log("Yeni sohbet oluşturuluyor...");

            // İsim bilgilerini daha akıllı şekilde al
            const currentUserName = user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.firstName ||
                user?.username ||
                user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
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
                        email: user.emailAddresses[0].emailAddress,
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

            // Inbox'a yönlendir
            navigate('/inbox');
        } catch (error) {
            console.error("Sohbet başlatma hatası:", error);
            alert("Sohbet başlatılırken bir hata oluştu: " + error.message);
        } finally {
            setChatLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Yükleniyor...</div>;
    }

    if (error || !pet) {
        return <div className="error">{error || 'Pet bulunamadı'}</div>;
    }

    return (
        <div className="pet-details">
            {/* Two-column layout container */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                minHeight: 'calc(100vh - 80px)', // Account for footer height
            }}>
                {/* Left column - Pet Image */}
                <div style={{
                    flex: '1',
                    position: 'relative',
                    backgroundColor: '#f8f9fa'
                }}>
                    <img
                        src={pet.imageUrl || 'https://placehold.co/400x300/png'}
                        alt={pet.name}
                        className="pet-image"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            position: 'sticky',
                            top: '0'
                        }}
                    />

                    {/* Geri butonu */}
                    <button
                        onClick={() => navigate('/')}
                        className="back-button"
                        style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 10
                        }}
                    >
                        <span>&larr;</span>
                    </button>
                </div>

                {/* Right column - Pet Details */}
                <div style={{
                    flex: '1',
                    padding: '30px',
                    overflow: 'auto'
                }}>
                    {/* Pet name and favorite button */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '25px'
                    }}>
                        <div>
                            <h1 style={{
                                fontSize: '32px',
                                fontWeight: 'bold',
                                margin: 0
                            }}>{pet.name}</h1>
                            <p style={{
                                color: Colors.GRAY,
                                margin: '5px 0 0 0',
                                fontSize: '16px'
                            }}>{pet.address || 'No location'}</p>
                        </div>
                        <FavoriteButton pet={pet} />
                    </div>

                    {/* Pet info cards */}
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            marginBottom: '15px'
                        }}>
                            Pet Information
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '15px',
                            marginBottom: '15px'
                        }}>
                            {/* Yaş kutusu */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                padding: '15px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                gap: '15px'
                            }}>
                                <div style={{ fontSize: '24px' }}>📅</div>
                                <div>
                                    <div style={{ color: Colors.GRAY, fontSize: '14px' }}>Age</div>
                                    <div style={{ fontWeight: '500', fontSize: '16px' }}>{pet.age} Years</div>
                                </div>
                            </div>

                            {/* Irk kutusu */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                padding: '15px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                gap: '15px'
                            }}>
                                <div style={{ fontSize: '24px' }}>🦴</div>
                                <div>
                                    <div style={{ color: Colors.GRAY, fontSize: '14px' }}>Breed</div>
                                    <div style={{ fontWeight: '500', fontSize: '16px' }}>{pet.breed}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '15px'
                        }}>
                            {/* Cinsiyet kutusu */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                padding: '15px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                gap: '15px'
                            }}>
                                <div style={{ fontSize: '24px' }}>⚤</div>
                                <div>
                                    <div style={{ color: Colors.GRAY, fontSize: '14px' }}>Sex</div>
                                    <div style={{ fontWeight: '500', fontSize: '16px' }}>{pet.sex}</div>
                                </div>
                            </div>

                            {/* Ağırlık kutusu */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                padding: '15px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                gap: '15px'
                            }}>
                                <div style={{ fontSize: '24px' }}>⚖️</div>
                                <div>
                                    <div style={{ color: Colors.GRAY, fontSize: '14px' }}>Weight</div>
                                    <div style={{ fontWeight: '500', fontSize: '16px' }}>{pet.weight} Kg</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hakkında Bölümü */}
                    <div style={{
                        marginBottom: '30px',
                        padding: '20px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            marginBottom: '15px'
                        }}>
                            About {pet.name}
                        </h2>
                        <p style={{
                            color: Colors.GRAY,
                            lineHeight: '1.6',
                            maxHeight: readMore ? 'none' : '120px',
                            overflow: readMore ? 'visible' : 'hidden',
                            position: 'relative'
                        }}>
                            {pet.about}
                        </p>
                        <button
                            onClick={() => setReadMore(!readMore)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: Colors.SECONDARY,
                                cursor: 'pointer',
                                padding: 0,
                                marginTop: '10px',
                                fontWeight: '500'
                            }}
                        >
                            {readMore ? 'Read Less' : 'Read More'}
                        </button>
                    </div>

                    {/* Sahip Bilgileri */}
                    <div style={{
                        marginBottom: '40px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        padding: '20px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            marginBottom: '15px'
                        }}>
                            Owner Information
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <img
                                src={pet.userImage || 'https://via.placeholder.com/60'}
                                alt="Owner"
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid #eee'
                                }}
                            />
                            <div>
                                <div style={{
                                    fontWeight: '500',
                                    fontSize: '18px',
                                    marginBottom: '5px'
                                }}>{pet.userName || 'Unknown'}</div>
                                <div style={{
                                    color: Colors.GRAY,
                                    fontSize: '14px'
                                }}>{pet.useremail || 'No email'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Adopt Me butonları - sabit alt kısımda */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '15px 20px',
                backgroundColor: 'white',
                borderTop: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '15px',
                zIndex: 10,
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
            }}>
                <button style={{
                    flex: 1,
                    padding: '15px',
                    borderRadius: '8px',
                    border: `1px solid ${Colors.PRIMARY}`,
                    backgroundColor: 'white',
                    color: Colors.PRIMARY,
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '16px'
                }}>
                    Contact
                </button>
                <button
                    onClick={initiateChat}
                    disabled={chatLoading}
                    style={{
                        flex: 1,
                        padding: '15px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: chatLoading ? '#ccc' : Colors.PRIMARY,
                        color: 'white',
                        fontWeight: '600',
                        cursor: chatLoading ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    {chatLoading ? (
                        <>
                            <div style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid #ffffff',
                                borderTop: '2px solid transparent',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            Starting Chat...
                        </>
                    ) : (
                        'Adopt Me'
                    )}
                </button>
            </div>

            {/* CSS Animation for loading spinner */}
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>

            {/* Extra space to allow scrolling past fixed bottom button */}
            <div style={{ height: '80px' }}></div>
        </div>
    );
};

export default PetDetails;