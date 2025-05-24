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
            navigate('/');
        } catch (err) {
            console.error("Sign out error:", err);
        }
    };

    if (!isLoaded) {
        return <div className="loading" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            fontSize: '18px',
            color: Colors.GRAY
        }}>Loading...</div>;
    }

    // Profile menü öğeleri
    const menuItems = [
        {
            icon: '➕',
            title: 'Add New Pet',
            description: 'List a new pet for adoption',
            path: '/add-pet',
            backgroundColor: '#e8f5e8',
            iconColor: '#2e7d32'
        },
        {
            icon: '📝',
            title: 'My Posts',
            description: 'Manage your pet listings',
            path: '/my-posts',
            backgroundColor: '#fff3e0',
            iconColor: '#f57c00'
        },
        {
            icon: '❤️',
            title: 'Favorites',
            description: 'View your favorite pets',
            path: '/favorites',
            backgroundColor: '#fce4ec',
            iconColor: '#c2185b'
        },
        {
            icon: '💬',
            title: 'Messages',
            description: 'Chat with other users',
            path: '/inbox',
            backgroundColor: '#e3f2fd',
            iconColor: '#1976d2'
        },
        {
            icon: '🤖',
            title: 'AI Care',
            description: 'AI-powered pet care insights',
            path: '/care',
            backgroundColor: '#f3e5f5',
            iconColor: '#7b1fa2'
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            paddingTop: '40px',
            paddingBottom: '40px'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 20px'
            }}>
                {/* Page Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '50px'
                }}>
                    <h1 style={{
                        fontSize: '42px',
                        fontWeight: '700',
                        color: '#333',
                        marginBottom: '10px'
                    }}>
                        My Profile
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        color: Colors.GRAY,
                        margin: 0
                    }}>
                        Manage your account and pet listings
                    </p>
                </div>

                {/* Main Content Grid */}
                <div
                    className="profile-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr',
                        gap: '40px',
                        alignItems: 'start'
                    }}>
                    {/* Left Column - User Info */}
                    <div
                        className="profile-sticky"
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            padding: '40px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                            border: '1px solid #f0f0f0',
                            textAlign: 'center',
                            position: 'sticky',
                            top: '120px'
                        }}>
                        {/* User Avatar */}
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            backgroundColor: '#6c9bd1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 25px',
                            fontSize: '48px',
                            color: 'white',
                            fontWeight: 'bold',
                            boxShadow: '0 8px 24px rgba(108, 155, 209, 0.3)'
                        }}>
                            {user?.firstName ? user.firstName.charAt(0).toUpperCase() :
                                user?.emailAddresses?.[0]?.emailAddress?.charAt(0).toUpperCase() || 'U'}
                        </div>

                        {/* User Details */}
                        <h2 style={{
                            fontSize: '26px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            {user?.firstName && user?.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user?.username || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User'
                            }
                        </h2>

                        <p style={{
                            color: Colors.GRAY,
                            fontSize: '16px',
                            marginBottom: '30px'
                        }}>
                            {user?.emailAddresses?.[0]?.emailAddress || 'No email'}
                        </p>

                        {/* Member Since */}
                        <div style={{
                            backgroundColor: '#f8f9fa',
                            padding: '15px',
                            borderRadius: '12px',
                            marginBottom: '30px'
                        }}>
                            <p style={{
                                color: Colors.GRAY,
                                fontSize: '14px',
                                margin: '0 0 5px 0'
                            }}>
                                Member since
                            </p>
                            <p style={{
                                fontWeight: '500',
                                fontSize: '16px',
                                color: '#333',
                                margin: 0
                            }}>
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                            </p>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleSignOut}
                            style={{
                                width: '100%',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '15px 20px',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#c82333';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(220, 53, 69, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#dc3545';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>🚪</span>
                            Sign Out
                        </button>
                    </div>

                    {/* Right Column - Menu Items */}
                    <div>
                        <h3 style={{
                            fontSize: '24px',
                            fontWeight: '600',
                            color: '#333',
                            marginBottom: '25px'
                        }}>
                            Quick Actions
                        </h3>

                        <div style={{
                            display: 'grid',
                            gap: '20px'
                        }}>
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.path}
                                    style={{
                                        display: 'block',
                                        backgroundColor: 'white',
                                        padding: '25px',
                                        borderRadius: '16px',
                                        textDecoration: 'none',
                                        color: '#333',
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                                        border: '1px solid #f0f0f0',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-4px)';
                                        e.target.style.boxShadow = '0 12px 32px rgba(0,0,0,0.15)';
                                        e.target.style.borderColor = Colors.PRIMARY;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                                        e.target.style.borderColor = '#f0f0f0';
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px'
                                    }}>
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '16px',
                                            backgroundColor: item.backgroundColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '28px',
                                            color: item.iconColor,
                                            flexShrink: 0
                                        }}>
                                            {item.icon}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{
                                                fontSize: '20px',
                                                fontWeight: '600',
                                                color: '#333',
                                                margin: '0 0 5px 0'
                                            }}>
                                                {item.title}
                                            </h4>
                                            <p style={{
                                                color: Colors.GRAY,
                                                fontSize: '14px',
                                                margin: 0,
                                                lineHeight: '1.4'
                                            }}>
                                                {item.description}
                                            </p>
                                        </div>
                                        <div style={{
                                            color: Colors.PRIMARY,
                                            fontSize: '20px',
                                            fontWeight: 'bold'
                                        }}>
                                            →
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Stats Section */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            padding: '30px',
                            marginTop: '30px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                            border: '1px solid #f0f0f0'
                        }}>
                            <h3 style={{
                                fontSize: '20px',
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: '20px'
                            }}>
                                Your Impact
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '20px'
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        fontSize: '32px',
                                        fontWeight: 'bold',
                                        color: Colors.PRIMARY,
                                        marginBottom: '5px'
                                    }}>
                                        0
                                    </div>
                                    <div style={{
                                        color: Colors.GRAY,
                                        fontSize: '14px'
                                    }}>
                                        Pets Listed
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        fontSize: '32px',
                                        fontWeight: 'bold',
                                        color: '#28a745',
                                        marginBottom: '5px'
                                    }}>
                                        0
                                    </div>
                                    <div style={{
                                        color: Colors.GRAY,
                                        fontSize: '14px'
                                    }}>
                                        Adoptions
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        fontSize: '32px',
                                        fontWeight: 'bold',
                                        color: '#dc3545',
                                        marginBottom: '5px'
                                    }}>
                                        0
                                    </div>
                                    <div style={{
                                        color: Colors.GRAY,
                                        fontSize: '14px'
                                    }}>
                                        Favorites
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Responsive Design for Mobile */}
                <style>
                    {`
                        @media (max-width: 1024px) {
                            .profile-grid {
                                grid-template-columns: 1fr 1fr !important;
                                gap: 30px !important;
                            }
                        }
                        @media (max-width: 768px) {
                            .profile-grid {
                                grid-template-columns: 1fr !important;
                                gap: 20px !important;
                            }
                            .profile-sticky {
                                position: static !important;
                                padding: 30px !important;
                            }
                        }
                        @media (max-width: 480px) {
                            .profile-grid {
                                padding: 0 10px !important;
                            }
                        }
                    `}
                </style>
            </div>
        </div>
    );
};

export default Profile; 