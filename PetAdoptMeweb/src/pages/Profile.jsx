import React from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import Colors from '../colors';

const Profile = () => {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (err) {
            console.error("Sign out error:", err);
        }
    };

    if (!isLoaded) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="profile-container">
            {/* Header with navigation */}
            <header style={{
                borderBottom: '1px solid #eee',
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '15px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: Colors.PRIMARY
                    }}>
                        PetAdoptMe
                    </div>

                    <nav style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '30px'
                    }}>
                        <Link to="/" style={{
                            color: Colors.GRAY,
                            textDecoration: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>🏠</span>
                            <span>Home</span>
                        </Link>
                        <Link to="/favorites" style={{
                            color: Colors.GRAY,
                            textDecoration: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>❤️</span>
                            <span>Favorites</span>
                        </Link>
                        <Link to="/messages" style={{
                            color: Colors.GRAY,
                            textDecoration: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>💬</span>
                            <span>Messages</span>
                        </Link>
                        <Link to="/profile" style={{
                            color: Colors.PRIMARY,
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            <span style={{ fontSize: '1.2rem' }}>👤</span>
                            <span>Profile</span>
                        </Link>

                        <Link to="/add-pet" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: Colors.PRIMARY,
                            color: 'white',
                            padding: '8px 15px',
                            borderRadius: '5px',
                            textDecoration: 'none',
                            fontWeight: '500',
                            marginLeft: '10px'
                        }}>
                            <span>+</span>
                            <span>Add Pet</span>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Profile content */}
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '40px 20px'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: '30px',
                    color: Colors.PRIMARY,
                    fontSize: '32px'
                }}>
                    Profile
                </h1>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '40px',
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                }}>
                    <img
                        src={user?.imageUrl || 'https://via.placeholder.com/120'}
                        alt="Profile"
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginBottom: '20px',
                            border: '4px solid #f5f5f5'
                        }}
                    />
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        marginBottom: '10px'
                    }}>
                        {user?.firstName && user?.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user?.username || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'
                        }
                    </h2>
                    <p style={{
                        color: Colors.GRAY,
                        fontSize: '16px'
                    }}>
                        {user?.emailAddresses?.[0]?.emailAddress || 'No email'}
                    </p>
                </div>

                <div style={{
                    marginBottom: '40px',
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                }}>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        marginBottom: '20px',
                        borderBottom: '1px solid #eee',
                        paddingBottom: '15px',
                        color: Colors.PRIMARY
                    }}>
                        Account Settings
                    </h3>

                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ fontWeight: '500', marginBottom: '8px' }}>Email</p>
                        <p style={{
                            color: Colors.GRAY,
                            backgroundColor: '#f8f9fa',
                            padding: '12px 15px',
                            borderRadius: '8px'
                        }}>
                            {user?.emailAddresses?.[0]?.emailAddress || 'No email'}
                        </p>
                    </div>

                    {user?.phoneNumbers && user.phoneNumbers.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontWeight: '500', marginBottom: '8px' }}>Phone</p>
                            <p style={{
                                color: Colors.GRAY,
                                backgroundColor: '#f8f9fa',
                                padding: '12px 15px',
                                borderRadius: '8px'
                            }}>
                                {user.phoneNumbers[0].phoneNumber}
                            </p>
                        </div>
                    )}
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                }}>
                    <h3 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        marginBottom: '20px',
                        borderBottom: '1px solid #eee',
                        paddingBottom: '15px',
                        color: Colors.PRIMARY
                    }}>
                        Actions
                    </h3>

                    <button
                        onClick={handleSignOut}
                        style={{
                            backgroundColor: Colors.PRIMARY,
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '14px',
                            width: '100%',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile; 