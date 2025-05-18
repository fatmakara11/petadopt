import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import PetListByCategory from '../components/PetListByCategory';
import Colors from '../colors';

const Home = () => {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return <div className="loading" style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    }

    return (
        <div className="home-container">
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
                            color: Colors.PRIMARY,
                            textDecoration: 'none',
                            fontWeight: 'bold',
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
                            color: Colors.GRAY,
                            textDecoration: 'none',
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

            {/* Main Content */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '40px 20px'
            }}>
                {/* Welcome Section */}
                <div style={{
                    marginBottom: '40px',
                    backgroundColor: Colors.LIGHT_PRIMARY,
                    padding: '30px',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        marginBottom: '15px',
                        color: '#333'
                    }}>
                        Welcome, {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Guest'}
                    </h1>
                    <p style={{
                        color: Colors.GRAY,
                        fontSize: '18px',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Find your perfect pet companion. Browse through our available pets and give them a loving home.
                    </p>
                </div>

                {/* Pet List by Category */}
                <PetListByCategory />

                {/* Add New Pet Button */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '60px',
                    marginBottom: '30px'
                }}>
                    <Link
                        to="/add-pet"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '10px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '15px 30px',
                            backgroundColor: Colors.LIGHT_PRIMARY,
                            color: Colors.PRIMARY,
                            borderRadius: '8px',
                            border: `2px dashed ${Colors.PRIMARY}`,
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '16px',
                            width: '450px',
                            maxWidth: '95%',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <span>🐾</span>
                        <span>Add New Pet</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home; 