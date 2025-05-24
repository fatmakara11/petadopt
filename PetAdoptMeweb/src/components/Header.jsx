import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router-dom';
import Colors from '../colors';

const Header = () => {
    const { user, isLoaded } = useUser();
    const location = useLocation();

    // Header'ın görünmemesi gereken sayfalar
    const hideHeaderPaths = ['/chat', '/my-posts'];
    const shouldHideHeader = hideHeaderPaths.some(path =>
        location.pathname.startsWith(path)
    );

    if (!isLoaded || shouldHideHeader) {
        return null;
    }

    // Eğer kullanıcı login olmamışsa login page'e yönlendir
    if (!user) {
        return (
            <header style={{
                borderBottom: '1px solid #eee',
                backgroundColor: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                position: 'sticky',
                top: 0,
                zIndex: 1000
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
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span>🐾</span>
                        <span>PetAdoptMe</span>
                    </Link>

                    <div style={{
                        color: Colors.PRIMARY,
                        fontSize: '16px',
                        fontWeight: '500'
                    }}>
                        Please sign in to continue
                    </div>
                </div>
            </header>
        );
    }

    const navItems = [
        {
            path: '/',
            icon: '🏠',
            label: 'Home',
            isActive: location.pathname === '/'
        },
        {
            path: '/favorites',
            icon: '❤️',
            label: 'Favorites',
            isActive: location.pathname === '/favorites'
        },
        {
            path: '/inbox',
            icon: '💬',
            label: 'Messages',
            isActive: location.pathname === '/inbox'
        },
        {
            path: '/care',
            icon: '🤖',
            label: 'AI Care',
            isActive: location.pathname === '/care'
        },
        {
            path: '/profile',
            icon: '👤',
            label: 'Profile',
            isActive: location.pathname === '/profile'
        }
    ];

    return (
        <header style={{
            borderBottom: '1px solid #eee',
            backgroundColor: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '15px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {/* Logo */}
                <Link to="/" style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: Colors.PRIMARY,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span>🐾</span>
                    <span>PetAdoptMe</span>
                </Link>

                {/* Navigation */}
                <nav style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '30px'
                }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                color: item.isActive ? Colors.PRIMARY : Colors.GRAY,
                                textDecoration: 'none',
                                fontWeight: item.isActive ? 'bold' : 'normal',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '5px',
                                transition: 'color 0.2s'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                            <span style={{ fontSize: '14px' }}>{item.label}</span>
                        </Link>
                    ))}

                    {/* Add Pet Button */}
                    <Link to="/add-pet" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: Colors.PRIMARY,
                        color: 'white',
                        padding: '8px 15px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '500',
                        marginLeft: '10px',
                        transition: 'background-color 0.2s'
                    }}>
                        <span>+</span>
                        <span>Add Pet</span>
                    </Link>

                    {/* User Profile */}
                    <Link to="/profile" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textDecoration: 'none',
                        marginLeft: '10px'
                    }}>
                        <span style={{
                            color: '#333',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                        }}>
                            {user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Guest'}
                        </span>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#6c9bd1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '16px'
                        }}>
                            {user?.firstName ? user.firstName.charAt(0).toUpperCase() :
                                user?.emailAddresses?.[0]?.emailAddress?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header; 