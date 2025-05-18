import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

                // Search for pet documents by ID
                const petsCollection = collection(db, 'Pets');
                const q = query(petsCollection, where('id', '==', id));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setError('Pet not found');
                    return;
                }

                // Get the first matching document
                const petData = {
                    id: querySnapshot.docs[0].id,
                    ...querySnapshot.docs[0].data()
                };

                setPet(petData);
            } catch (err) {
                console.error('Error fetching pet details:', err);
                setError('An error occurred while loading pet details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPetDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="loading-container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div className="spinner" style={{
                    width: '50px',
                    height: '50px',
                    border: '5px solid rgba(0,0,0,0.1)',
                    borderRadius: '50%',
                    borderTop: `5px solid ${Colors.PRIMARY}`,
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
        );
    }

    if (error || !pet) {
        return (
            <div className="error-container" style={{
                maxWidth: '600px',
                margin: '100px auto',
                padding: '30px',
                textAlign: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>😿</div>
                <h2 style={{ marginBottom: '15px', color: '#dc3545' }}>{error || 'Pet not found'}</h2>
                <p style={{ marginBottom: '20px', color: '#666' }}>
                    We couldn't find the pet you were looking for. It may have been adopted or removed.
                </p>
                <Link
                    to="/"
                    style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        backgroundColor: Colors.PRIMARY,
                        color: 'white',
                        borderRadius: '5px',
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}
                >
                    Return to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="pet-details-page">
            {/* Web Header */}
            <header style={{
                borderBottom: '1px solid #eee',
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '15px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Link to="/" style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: Colors.PRIMARY,
                        textDecoration: 'none'
                    }}>
                        PetAdoptMe
                    </Link>

                    <nav style={{ display: 'flex', gap: '25px' }}>
                        <Link to="/" style={{ color: Colors.GRAY, textDecoration: 'none' }}>Home</Link>
                        <Link to="/favorites" style={{ color: Colors.GRAY, textDecoration: 'none' }}>Favorites</Link>
                        <Link to="/messages" style={{ color: Colors.GRAY, textDecoration: 'none' }}>Messages</Link>
                        <Link to="/profile" style={{ color: Colors.GRAY, textDecoration: 'none' }}>Profile</Link>
                    </nav>
                </div>
            </header>

            {/* Breadcrumb Navigation */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '15px 20px',
                color: Colors.GRAY,
                fontSize: '0.9rem'
            }}>
                <Link to="/" style={{ color: Colors.GRAY, textDecoration: 'none' }}>Home</Link>
                {' > '}
                <Link to="/" style={{ color: Colors.GRAY, textDecoration: 'none' }}>{pet.category}</Link>
                {' > '}
                <span style={{ color: '#333' }}>{pet.name}</span>
            </div>

            {/* Main Content Area */}
            <div className="pet-details-container" style={{
                maxWidth: '1200px',
                margin: '20px auto 60px',
                padding: '0 20px',
                display: 'flex',
                flexDirection: 'row',
                gap: '40px'
            }}>
                {/* Left Column - Image */}
                <div className="pet-image-section" style={{
                    flex: '0 0 45%',
                    position: 'sticky',
                    top: '100px',
                    alignSelf: 'flex-start',
                    maxHeight: 'calc(100vh - 200px)',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'relative',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                    }}>
                        <img
                            src={pet.imageUrl || 'https://placehold.co/600x400/png'}
                            alt={pet.name}
                            style={{
                                width: '100%',
                                aspectRatio: '4/3',
                                objectFit: 'cover'
                            }}
                        />

                        <div style={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px'
                        }}>
                            <FavoriteButton pet={pet} />
                        </div>
                    </div>

                    {/* Additional pet images if available */}
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        marginTop: '15px',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            opacity: 1,
                            border: `2px solid ${Colors.PRIMARY}`
                        }}>
                            <img
                                src={pet.imageUrl}
                                alt={pet.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                        {/* Placeholder thumbnails for future multiple images */}
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: '#f0f0f0',
                            opacity: 0.6
                        }}>
                        </div>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            backgroundColor: '#f0f0f0',
                            opacity: 0.6
                        }}>
                        </div>
                    </div>
                </div>

                {/* Right Column - Details */}
                <div className="pet-info-section" style={{ flex: '1 1 55%' }}>
                    <div style={{ marginBottom: '25px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid #eee',
                            paddingBottom: '15px',
                            marginBottom: '15px'
                        }}>
                            <h1 style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                margin: '0 0 10px 0'
                            }}>{pet.name}</h1>

                            <div style={{
                                backgroundColor: Colors.LIGHT_PRIMARY,
                                padding: '8px 15px',
                                borderRadius: '20px',
                                color: Colors.PRIMARY,
                                fontWeight: '600',
                                fontSize: '1.1rem'
                            }}>
                                {pet.category}
                            </div>
                        </div>

                        <p style={{
                            color: Colors.GRAY,
                            fontSize: '1.1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            <span style={{ color: Colors.PRIMARY }}>📍</span>
                            {pet.address || 'No location provided'}
                        </p>
                    </div>

                    {/* Pet Details Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '20px',
                        marginBottom: '30px'
                    }}>
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'default'
                        }} className="detail-card">
                            <span style={{
                                fontSize: '2rem',
                                background: Colors.LIGHT_PRIMARY,
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%'
                            }}>📅</span>
                            <div>
                                <div style={{ color: Colors.GRAY, fontSize: '0.9rem', marginBottom: '5px' }}>Age</div>
                                <div style={{ fontWeight: '600', fontSize: '1.2rem' }}>{pet.age} Years</div>
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'default'
                        }} className="detail-card">
                            <span style={{
                                fontSize: '2rem',
                                background: Colors.LIGHT_PRIMARY,
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%'
                            }}>🦴</span>
                            <div>
                                <div style={{ color: Colors.GRAY, fontSize: '0.9rem', marginBottom: '5px' }}>Breed</div>
                                <div style={{ fontWeight: '600', fontSize: '1.2rem' }}>{pet.breed}</div>
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'default'
                        }} className="detail-card">
                            <span style={{
                                fontSize: '2rem',
                                background: Colors.LIGHT_PRIMARY,
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%'
                            }}>⚤</span>
                            <div>
                                <div style={{ color: Colors.GRAY, fontSize: '0.9rem', marginBottom: '5px' }}>Sex</div>
                                <div style={{ fontWeight: '600', fontSize: '1.2rem' }}>{pet.sex}</div>
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'default'
                        }} className="detail-card">
                            <span style={{
                                fontSize: '2rem',
                                background: Colors.LIGHT_PRIMARY,
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%'
                            }}>⚖️</span>
                            <div>
                                <div style={{ color: Colors.GRAY, fontSize: '0.9rem', marginBottom: '5px' }}>Weight</div>
                                <div style={{ fontWeight: '600', fontSize: '1.2rem' }}>{pet.weight} Kg</div>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            marginBottom: '15px',
                            position: 'relative',
                            paddingBottom: '10px',
                            borderBottom: '1px solid #eee'
                        }}>
                            About {pet.name}
                            <span style={{
                                position: 'absolute',
                                bottom: -1,
                                left: 0,
                                width: '80px',
                                height: '3px',
                                backgroundColor: Colors.PRIMARY
                            }}></span>
                        </h2>

                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '25px',
                            borderRadius: '8px'
                        }}>
                            <p style={{
                                color: '#444',
                                lineHeight: '1.8',
                                fontSize: '1.05rem',
                                maxHeight: readMore ? 'none' : '150px',
                                overflow: readMore ? 'visible' : 'hidden',
                                position: 'relative'
                            }}>
                                {pet.about}
                                {!readMore && pet.about && pet.about.length > 350 && (
                                    <span style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: '80px',
                                        background: 'linear-gradient(transparent, #f8f9fa)'
                                    }}></span>
                                )}
                            </p>
                            {pet.about && pet.about.length > 350 && (
                                <button
                                    onClick={() => setReadMore(!readMore)}
                                    style={{
                                        background: 'none',
                                        border: `1px solid ${Colors.PRIMARY}`,
                                        color: Colors.PRIMARY,
                                        cursor: 'pointer',
                                        padding: '8px 15px',
                                        borderRadius: '20px',
                                        fontWeight: '500',
                                        marginTop: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}
                                >
                                    {readMore ? 'Read Less' : 'Read More'}
                                    <span>{readMore ? '↑' : '↓'}</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Owner Information */}
                    <div style={{ marginBottom: '40px' }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            marginBottom: '15px',
                            position: 'relative',
                            paddingBottom: '10px',
                            borderBottom: '1px solid #eee'
                        }}>
                            Owner Information
                            <span style={{
                                position: 'absolute',
                                bottom: -1,
                                left: 0,
                                width: '80px',
                                height: '3px',
                                backgroundColor: Colors.PRIMARY
                            }}></span>
                        </h2>

                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '25px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px'
                        }}>
                            <img
                                src={pet.userImage || 'https://via.placeholder.com/70'}
                                alt="Owner"
                                style={{
                                    width: '70px',
                                    height: '70px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '3px solid white',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                }}
                            />
                            <div>
                                <div style={{ fontWeight: '600', fontSize: '1.2rem', marginBottom: '8px' }}>
                                    {pet.userName || 'Unknown'}
                                </div>
                                <div style={{
                                    color: Colors.GRAY,
                                    fontSize: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}>
                                    <span style={{ fontSize: '1.1rem' }}>✉️</span>
                                    {pet.useremail || 'No email provided'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                        marginTop: '20px'
                    }}>
                        <button style={{
                            padding: '15px',
                            borderRadius: '8px',
                            border: `1px solid ${Colors.PRIMARY}`,
                            backgroundColor: 'white',
                            color: Colors.PRIMARY,
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '1.1rem',
                            transition: 'all 0.2s'
                        }}>
                            Contact Owner
                        </button>
                        <button style={{
                            padding: '15px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: Colors.PRIMARY,
                            color: 'white',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '1.1rem',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s'
                        }}>
                            Adopt Me
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{
                backgroundColor: '#f8f9fa',
                padding: '40px 20px',
                borderTop: '1px solid #eee'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    textAlign: 'center',
                    color: '#999',
                    fontSize: '0.9rem'
                }}>
                    &copy; {new Date().getFullYear()} PetAdoptMe. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default PetDetails; 