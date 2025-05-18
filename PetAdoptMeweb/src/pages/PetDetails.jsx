import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Colors from '../colors';
import FavoriteButton from '../components/FavoriteButton';

const PetDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
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

            {/* Adopt Me (veya Contact) butonu - sabit alt kısımda */}
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
                <button style={{
                    flex: 1,
                    padding: '15px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: Colors.PRIMARY,
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '16px'
                }}>
                    Adopt Me
                </button>
            </div>

            {/* Extra space to allow scrolling past fixed bottom button */}
            <div style={{ height: '80px' }}></div>
        </div>
    );
};

export default PetDetails;