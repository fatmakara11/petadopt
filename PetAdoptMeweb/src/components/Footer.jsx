import React from 'react';
import { Link } from 'react-router-dom';
import Colors from '../colors';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: '#2c3e50',
            color: 'white',
            marginTop: '60px'
        }}>
            {/* Main Footer Content */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '40px 20px 20px'
            }}>
                {/* Main Section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '50px',
                    marginBottom: '40px',
                    alignItems: 'center'
                }}>
                    {/* Company Info */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '15px',
                            marginBottom: '20px'
                        }}>
                            <span style={{ fontSize: '32px' }}>🐾</span>
                            <h3 style={{
                                fontSize: '28px',
                                fontWeight: 'bold',
                                margin: 0,
                                color: Colors.PRIMARY
                            }}>
                                PetAdoptMe
                            </h3>
                        </div>
                        <p style={{
                            fontSize: '18px',
                            lineHeight: '1.6',
                            color: '#bdc3c7',
                            marginBottom: '25px',
                            maxWidth: '400px',
                            margin: '0 auto 25px'
                        }}>
                            Connecting loving families with pets in need. Every pet deserves a chance at happiness.
                        </p>

                        {/* Social Media */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '20px'
                        }}>
                            <a href="#" style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                backgroundColor: '#34495e',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textDecoration: 'none',
                                fontSize: '20px',
                                transition: 'all 0.3s ease'
                            }} onMouseEnter={(e) => {
                                e.target.style.backgroundColor = Colors.PRIMARY;
                                e.target.style.transform = 'translateY(-3px)';
                            }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#34495e';
                                    e.target.style.transform = 'translateY(0)';
                                }}>
                                📘
                            </a>
                            <a href="#" style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                backgroundColor: '#34495e',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textDecoration: 'none',
                                fontSize: '20px',
                                transition: 'all 0.3s ease'
                            }} onMouseEnter={(e) => {
                                e.target.style.backgroundColor = Colors.PRIMARY;
                                e.target.style.transform = 'translateY(-3px)';
                            }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#34495e';
                                    e.target.style.transform = 'translateY(0)';
                                }}>
                                📱
                            </a>
                            <a href="#" style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                backgroundColor: '#34495e',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textDecoration: 'none',
                                fontSize: '20px',
                                transition: 'all 0.3s ease'
                            }} onMouseEnter={(e) => {
                                e.target.style.backgroundColor = Colors.PRIMARY;
                                e.target.style.transform = 'translateY(-3px)';
                            }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#34495e';
                                    e.target.style.transform = 'translateY(0)';
                                }}>
                                🐦
                            </a>
                            <a href="#" style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                backgroundColor: '#34495e',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textDecoration: 'none',
                                fontSize: '20px',
                                transition: 'all 0.3s ease'
                            }} onMouseEnter={(e) => {
                                e.target.style.backgroundColor = Colors.PRIMARY;
                                e.target.style.transform = 'translateY(-3px)';
                            }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#34495e';
                                    e.target.style.transform = 'translateY(0)';
                                }}>
                                📷
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div style={{ textAlign: 'center' }}>
                        <h4 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            marginBottom: '25px',
                            color: 'white'
                        }}>
                            Quick Navigation
                        </h4>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '20px'
                        }}>
                            <Link to="/" style={{
                                color: '#bdc3c7',
                                textDecoration: 'none',
                                fontSize: '16px',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                backgroundColor: '#34495e',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }} onMouseEnter={(e) => {
                                e.target.style.backgroundColor = Colors.PRIMARY;
                                e.target.style.color = 'white';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#34495e';
                                    e.target.style.color = '#bdc3c7';
                                    e.target.style.transform = 'translateY(0)';
                                }}>
                                🏠 Home
                            </Link>

                            <Link to="/add-pet" style={{
                                color: '#bdc3c7',
                                textDecoration: 'none',
                                fontSize: '16px',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                backgroundColor: '#34495e',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }} onMouseEnter={(e) => {
                                e.target.style.backgroundColor = Colors.PRIMARY;
                                e.target.style.color = 'white';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#34495e';
                                    e.target.style.color = '#bdc3c7';
                                    e.target.style.transform = 'translateY(0)';
                                }}>
                                ➕ Add Pet
                            </Link>

                            <Link to="/favorites" style={{
                                color: '#bdc3c7',
                                textDecoration: 'none',
                                fontSize: '16px',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                backgroundColor: '#34495e',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }} onMouseEnter={(e) => {
                                e.target.style.backgroundColor = Colors.PRIMARY;
                                e.target.style.color = 'white';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#34495e';
                                    e.target.style.color = '#bdc3c7';
                                    e.target.style.transform = 'translateY(0)';
                                }}>
                                ❤️ Favorites
                            </Link>

                            <Link to="/care" style={{
                                color: '#bdc3c7',
                                textDecoration: 'none',
                                fontSize: '16px',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                backgroundColor: '#34495e',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }} onMouseEnter={(e) => {
                                e.target.style.backgroundColor = Colors.PRIMARY;
                                e.target.style.color = 'white';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = '#34495e';
                                    e.target.style.color = '#bdc3c7';
                                    e.target.style.transform = 'translateY(0)';
                                }}>
                                🤖 AI Care
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Copyright */}
                <div style={{
                    borderTop: '1px solid #34495e',
                    paddingTop: '25px',
                    textAlign: 'center'
                }}>
                    <p style={{
                        fontSize: '16px',
                        color: '#bdc3c7',
                        margin: '0 0 10px 0'
                    }}>
                        © 2024 PetAdoptMe. Made with ❤️ for pets in need.
                    </p>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '30px',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <span style={{
                            fontSize: '14px',
                            color: '#95a5a6',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            🌍 Available worldwide
                        </span>
                        <span style={{
                            fontSize: '14px',
                            color: '#95a5a6',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            🔒 Secure & Safe
                        </span>
                        <span style={{
                            fontSize: '14px',
                            color: '#95a5a6',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            ⚡ Fast & Easy
                        </span>
                    </div>
                </div>
            </div>

            {/* Responsive Styles */}
            <style>
                {`
                    @media (max-width: 768px) {
                        .footer-main {
                            grid-template-columns: 1fr !important;
                            gap: 30px !important;
                            text-align: center !important;
                        }
                        
                        .footer-links {
                            flex-direction: column !important;
                            gap: 15px !important;
                        }
                        
                        .footer-bottom-features {
                            flex-direction: column !important;
                            gap: 15px !important;
                        }
                    }
                `}
            </style>
        </footer>
    );
};

export default Footer; 