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
            {/* Web Header/Navigation */}
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

                    <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <span style={{ color: '#333', fontSize: '0.9rem' }}>
                            {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Guest'}
                        </span>
                        <img
                            src={user?.imageUrl || 'https://via.placeholder.com/36'}
                            alt="Profile"
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid #eee'
                            }}
                        />
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section style={{
                backgroundColor: Colors.LIGHT_PRIMARY,
                padding: '60px 20px',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        color: '#333'
                    }}>
                        Find Your Perfect Companion
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: '#666',
                        marginBottom: '30px',
                        lineHeight: '1.6'
                    }}>
                        Connecting loving homes with pets in need. Browse our available pets and start your adoption journey today.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                        <Link to="/add-pet" style={{
                            backgroundColor: Colors.PRIMARY,
                            color: 'white',
                            padding: '12px 25px',
                            borderRadius: '30px',
                            textDecoration: 'none',
                            fontWeight: '500',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}>
                            Add Your Pet
                        </Link>
                        <a href="#pets" style={{
                            backgroundColor: 'white',
                            color: Colors.PRIMARY,
                            border: `1px solid ${Colors.PRIMARY}`,
                            padding: '12px 25px',
                            borderRadius: '30px',
                            textDecoration: 'none',
                            fontWeight: '500'
                        }}>
                            Browse Pets
                        </a>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main id="pets" style={{ padding: '60px 0' }}>
                <PetListByCategory />
            </main>

            {/* Footer */}
            <footer style={{
                backgroundColor: '#f8f9fa',
                padding: '40px 20px',
                borderTop: '1px solid #eee'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '30px'
                }}>
                    <div style={{ maxWidth: '350px' }}>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            marginBottom: '15px',
                            color: Colors.PRIMARY
                        }}>
                            PetAdoptMe
                        </h3>
                        <p style={{ color: '#666', lineHeight: '1.6' }}>
                            Our mission is to connect pets in need with loving homes. We believe every animal deserves a second chance.
                        </p>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '15px', fontWeight: '600' }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ marginBottom: '10px' }}>
                                <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>Home</Link>
                            </li>
                            <li style={{ marginBottom: '10px' }}>
                                <Link to="/favorites" style={{ color: '#666', textDecoration: 'none' }}>Favorites</Link>
                            </li>
                            <li style={{ marginBottom: '10px' }}>
                                <Link to="/add-pet" style={{ color: '#666', textDecoration: 'none' }}>Add a Pet</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '15px', fontWeight: '600' }}>Contact Us</h4>
                        <p style={{ color: '#666', marginBottom: '10px' }}>
                            Email: contact@petadoptme.com
                        </p>
                        <p style={{ color: '#666' }}>
                            Phone: (123) 456-7890
                        </p>
                    </div>
                </div>

                <div style={{
                    maxWidth: '1200px',
                    margin: '30px auto 0',
                    borderTop: '1px solid #ddd',
                    paddingTop: '20px',
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

export default Home; 