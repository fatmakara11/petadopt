import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import PetListByCategory from '../components/PetListByCategory';
import Colors from '../colors';

const Home = () => {
    const { user, isLoaded } = useUser();
    const [currentSlide, setCurrentSlide] = useState(0);
    const categoriesRef = useRef(null);

    // Slider images
    const sliderImages = [
        {
            id: 1,
            image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            title: 'Find Your Perfect Companion',
            subtitle: 'Thousands of pets are waiting for their forever home'
        },
        {
            id: 2,
            image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            title: 'Give Love, Get Love',
            subtitle: 'Every pet deserves a chance at happiness and love'
        },
        {
            id: 3,
            image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            title: 'Start Your Journey Today',
            subtitle: 'Browse our available pets and change a life forever'
        }
    ];

    // Auto-slide functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [sliderImages.length]);

    // Scroll to categories
    const scrollToCategories = () => {
        categoriesRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    if (!isLoaded) {
        return <div className="loading" style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    }

    return (
        <div className="home-container">
            {/* Hero Slider Section */}
            <div style={{
                position: 'relative',
                height: '500px',
                overflow: 'hidden',
                marginBottom: '60px'
            }}>
                {/* Slider Images */}
                {sliderImages.map((slide, index) => (
                    <div
                        key={slide.id}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: currentSlide === index ? 1 : 0,
                            transition: 'opacity 0.8s ease-in-out',
                            backgroundImage: `url(${slide.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    >
                        {/* Overlay */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <div style={{
                                textAlign: 'center',
                                color: 'white',
                                maxWidth: '600px',
                                padding: '0 20px'
                            }}>
                                <h1 style={{
                                    fontSize: '48px',
                                    fontWeight: 'bold',
                                    marginBottom: '20px',
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                                    opacity: currentSlide === index ? 1 : 0,
                                    transform: currentSlide === index ? 'translateY(0)' : 'translateY(30px)',
                                    transition: 'all 0.8s ease 0.3s'
                                }}>
                                    {slide.title}
                                </h1>
                                <p style={{
                                    fontSize: '20px',
                                    marginBottom: '30px',
                                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                                    opacity: currentSlide === index ? 1 : 0,
                                    transform: currentSlide === index ? 'translateY(0)' : 'translateY(30px)',
                                    transition: 'all 0.8s ease 0.5s'
                                }}>
                                    {slide.subtitle}
                                </p>

                                {/* Adopt Now Button */}
                                <button
                                    onClick={scrollToCategories}
                                    style={{
                                        backgroundColor: Colors.PRIMARY,
                                        color: 'white',
                                        border: 'none',
                                        padding: '18px 40px',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        borderRadius: '50px',
                                        cursor: 'pointer',
                                        boxShadow: '0 8px 25px rgba(232, 178, 14, 0.4)',
                                        transition: 'all 0.3s ease',
                                        opacity: currentSlide === index ? 1 : 0,
                                        transform: currentSlide === index ? 'translateY(0)' : 'translateY(30px)',
                                        transitionDelay: '0.7s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#d4a60d';
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 12px 35px rgba(232, 178, 14, 0.6)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = Colors.PRIMARY;
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 8px 25px rgba(232, 178, 14, 0.4)';
                                    }}
                                >
                                    🐾 Adopt Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Slider Indicators */}
                <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '10px'
                }}>
                    {sliderImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                border: 'none',
                                backgroundColor: currentSlide === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>

                {/* Navigation Arrows */}
                <button
                    onClick={() => setCurrentSlide((prev) =>
                        prev === 0 ? sliderImages.length - 1 : prev - 1
                    )}
                    style={{
                        position: 'absolute',
                        left: '30px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        color: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                        e.target.style.boxShadow = 'none';
                    }}
                >
                    ‹
                </button>

                <button
                    onClick={() => setCurrentSlide((prev) =>
                        prev === sliderImages.length - 1 ? 0 : prev + 1
                    )}
                    style={{
                        position: 'absolute',
                        right: '30px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        cursor: 'pointer',
                        fontSize: '20px',
                        color: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                        e.target.style.boxShadow = 'none';
                    }}
                >
                    ›
                </button>
            </div>

            {/* Main Content */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 20px'
            }}>
                {/* Pet List by Category */}
                <div ref={categoriesRef}>
                    <PetListByCategory />
                </div>

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

            {/* Mobile Responsive Styles */}
            <style>
                {`
                    @media (max-width: 768px) {
                        .home-container .slider-content h1 {
                            font-size: 32px !important;
                        }
                        .home-container .slider-content p {
                            font-size: 16px !important;
                        }
                        .home-container .slider-height {
                            height: 400px !important;
                        }
                        .home-container .slider-arrows {
                            width: 40px !important;
                            height: 40px !important;
                            font-size: 16px !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Home; 