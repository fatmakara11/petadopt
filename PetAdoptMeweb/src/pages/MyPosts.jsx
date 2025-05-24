import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Colors from '../colors';
import { Link } from 'react-router-dom';

const MyPosts = () => {
    const { user, isLoaded } = useUser();
    const [userPostList, setUserPostList] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        if (user) {
            getUserPost();
        }
    }, [user]);

    // Kullanıcının postlarını Firebase'den çek
    const getUserPost = async () => {
        setLoader(true);
        setUserPostList([]);
        try {
            // Mobil uygulamayla uyumlu field adı: 'useremail'
            const q = query(
                collection(db, 'Pets'),
                where('useremail', '==', user?.emailAddresses[0]?.emailAddress)
            );
            const querySnapshot = await getDocs(q);
            const posts = [];
            querySnapshot.forEach((doc) => {
                console.log(doc.data());
                posts.push({ ...doc.data(), docId: doc.id });
            });
            setUserPostList(posts);
        } catch (error) {
            console.error('Error fetching user posts:', error);
        } finally {
            setLoader(false);
        }
    };

    // Firebase'den post silme
    const deletePostFromFirebase = async (docId) => {
        try {
            await deleteDoc(doc(db, 'Pets', docId));
            setUserPostList(prev => prev.filter(item => item.docId !== docId));
            alert('Post successfully deleted!');
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Error deleting post. Please try again.');
        }
    };

    // Delete confirmation
    const onDeletePost = (docId) => {
        if (window.confirm('Do you really want to delete this post?')) {
            deletePostFromFirebase(docId);
        }
    };

    // Modern Pet Card Component
    const PetCard = ({ pet }) => (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s ease',
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
            }}>

            {/* Image Container */}
            <div style={{ position: 'relative' }}>
                <img
                    src={pet.imageUrl || 'https://via.placeholder.com/300x200'}
                    alt={pet.name}
                    style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover'
                    }}
                />

                {/* Category Badge */}
                <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    backgroundColor: pet.category === 'Dogs' ? '#4CAF50' :
                        pet.category === 'Cats' ? '#FF9800' :
                            pet.category === 'Birds' ? '#2196F3' : '#9C27B0',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {pet.category}
                </div>

                {/* Status Indicator */}
                <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    <span style={{ width: '6px', height: '6px', backgroundColor: 'white', borderRadius: '50%' }}></span>
                    ACTIVE
                </div>
            </div>

            {/* Content */}
            <div style={{
                padding: '20px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#333',
                    marginBottom: '8px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {pet.name}
                </h3>

                <p style={{
                    color: Colors.GRAY,
                    fontSize: '14px',
                    marginBottom: '15px',
                    fontWeight: '500'
                }}>
                    {pet.breed}
                </p>

                {/* Pet Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>{pet.age}</div>
                        <div style={{ fontSize: '11px', color: Colors.GRAY, textTransform: 'uppercase' }}>Years</div>
                    </div>
                    <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#333' }}>{pet.weight || 'N/A'}</div>
                        <div style={{ fontSize: '11px', color: Colors.GRAY, textTransform: 'uppercase' }}>Kg</div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: 'auto'
                }}>
                    <Link
                        to={`/pet-details/${pet.id}`}
                        style={{
                            flex: 1,
                            backgroundColor: Colors.PRIMARY,
                            color: 'white',
                            padding: '12px',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            textAlign: 'center',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#d4a60d';
                            e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = Colors.PRIMARY;
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        👁️ View
                    </Link>

                    <button
                        onClick={() => onDeletePost(pet.docId)}
                        style={{
                            flex: 1,
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '12px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#c82333';
                            e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#dc3545';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    );

    if (!isLoaded) {
        return <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            fontSize: '18px',
            color: Colors.GRAY
        }}>Loading...</div>;
    }

    if (!user) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '50px',
                color: Colors.GRAY
            }}>
                Please sign in to view your posts.
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa'
        }}>
            {/* Modern Header */}
            <div style={{
                backgroundColor: 'white',
                borderBottom: '1px solid #f0f0f0',
                padding: '30px 0',
                marginBottom: '40px'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px'
                    }}>
                        <Link to="/profile" style={{
                            width: '45px',
                            height: '45px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none',
                            color: '#333',
                            fontSize: '20px',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = Colors.PRIMARY;
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                                e.target.style.color = '#333';
                            }}>
                            ←
                        </Link>

                        <div>
                            <h1 style={{
                                fontSize: '36px',
                                fontWeight: '700',
                                color: '#333',
                                margin: '0 0 5px 0'
                            }}>
                                My Pet Listings
                            </h1>
                            <p style={{
                                color: Colors.GRAY,
                                fontSize: '16px',
                                margin: 0
                            }}>
                                Manage and track your posted pets
                            </p>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                    }}>
                        {/* Stats */}
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '12px 20px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <span style={{ fontSize: '20px' }}>📊</span>
                            <div>
                                <div style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
                                    {userPostList.length}
                                </div>
                                <div style={{ fontSize: '12px', color: Colors.GRAY }}>
                                    Active Posts
                                </div>
                            </div>
                        </div>

                        {/* Add New Pet Button */}
                        <Link
                            to="/add-pet"
                            style={{
                                backgroundColor: Colors.PRIMARY,
                                color: 'white',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#d4a60d';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = Colors.PRIMARY;
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            ➕ Add New Pet
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 20px'
            }}>
                {loader ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '80px 20px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            border: `4px solid ${Colors.PRIMARY}`,
                            borderTop: '4px solid transparent',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginBottom: '25px'
                        }} />
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '10px'
                        }}>
                            Loading Your Posts
                        </h3>
                        <p style={{
                            color: Colors.GRAY,
                            fontSize: '16px'
                        }}>
                            Please wait while we fetch your pet listings...
                        </p>
                    </div>
                ) : userPostList.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '80px 40px',
                        textAlign: 'center',
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                    }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '60px',
                            background: `linear-gradient(135deg, ${Colors.PRIMARY}, #d4a60d)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '30px',
                            fontSize: '50px'
                        }}>
                            🐾
                        </div>
                        <h3 style={{
                            fontSize: '28px',
                            fontWeight: '700',
                            color: '#333',
                            marginBottom: '15px'
                        }}>
                            No pets listed yet
                        </h3>
                        <p style={{
                            color: Colors.GRAY,
                            fontSize: '16px',
                            lineHeight: '1.6',
                            maxWidth: '400px',
                            marginBottom: '30px'
                        }}>
                            Start helping pets find their forever homes by listing your first pet for adoption.
                        </p>
                        <Link
                            to="/add-pet"
                            style={{
                                backgroundColor: Colors.PRIMARY,
                                color: 'white',
                                padding: '15px 30px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#d4a60d';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = Colors.PRIMARY;
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            🐾 List Your First Pet
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Filter/Actions Bar */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '30px',
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '16px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                        }}>
                            <h3 style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                color: '#333',
                                margin: 0
                            }}>
                                Your Pet Listings ({userPostList.length})
                            </h3>

                            <button
                                onClick={getUserPost}
                                disabled={loader}
                                style={{
                                    backgroundColor: '#f8f9fa',
                                    color: '#333',
                                    border: '1px solid #e9ecef',
                                    padding: '10px 20px',
                                    borderRadius: '10px',
                                    cursor: loader ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (!loader) {
                                        e.target.style.backgroundColor = '#e9ecef';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#f8f9fa';
                                }}
                            >
                                🔄 {loader ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>

                        {/* Pet Cards Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '25px',
                            marginBottom: '40px'
                        }}>
                            {userPostList.map((pet, index) => (
                                <PetCard key={pet.docId || index} pet={pet} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Loading Animation */}
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    @media (max-width: 768px) {
                        .header-actions {
                            flex-direction: column !important;
                            gap: 15px !important;
                        }
                        
                        .grid-responsive {
                            grid-template-columns: 1fr !important;
                            gap: 20px !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default MyPosts; 