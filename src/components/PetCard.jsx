import React from 'react';
import { Link } from 'react-router-dom';
import Colors from '../colors';
import FavoriteButton from './FavoriteButton';

const PetCard = ({ pet }) => {
    if (!pet) {
        return null;
    }

    return (
        <div className="pet-card" style={{
            border: '1px solid #eaeaea',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'transform 0.3s, box-shadow 0.3s',
            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white'
        }}>
            <div className="image-container" style={{
                position: 'relative',
                height: '230px',
                overflow: 'hidden'
            }}>
                <img
                    src={pet?.imageUrl}
                    alt={pet?.name}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                    }}
                />
                <div className="favorite-button" style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    zIndex: 2
                }}>
                    <FavoriteButton pet={pet} color="white" />
                </div>

                <div className="pet-category-label" style={{
                    position: 'absolute',
                    bottom: '15px',
                    left: '15px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: Colors.PRIMARY,
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }}>
                    {pet?.category}
                </div>
            </div>

            <div style={{
                padding: '20px',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '15px'
                }}>
                    <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        margin: 0,
                        color: '#333'
                    }}>
                        {pet?.name}
                    </h3>

                    <span className="age" style={{
                        color: Colors.PRIMARY,
                        backgroundColor: Colors.LIGHT_PRIMARY,
                        padding: '4px 10px',
                        borderRadius: '16px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        height: 'fit-content'
                    }}>
                        {pet?.age} {pet?.age === 1 ? 'Year' : 'Years'}
                    </span>
                </div>

                <div className="pet-info" style={{
                    marginBottom: '15px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#666',
                        marginBottom: '8px',
                        fontSize: '0.9rem'
                    }}>
                        <span style={{ color: Colors.PRIMARY }}>🦴</span>
                        <span className="breed">{pet?.breed}</span>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#666',
                        fontSize: '0.9rem'
                    }}>
                        <span style={{ color: Colors.PRIMARY }}>📍</span>
                        <span>{pet?.address || 'No location'}</span>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                    paddingTop: '15px',
                    borderTop: '1px solid #f0f0f0'
                }}>
                    <div style={{
                        color: Colors.PRIMARY,
                        fontWeight: '700',
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <span style={{
                            backgroundColor: Colors.LIGHT_PRIMARY,
                            width: '30px',
                            height: '30px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '8px',
                            fontSize: '0.9rem'
                        }}>
                            {pet?.sex === 'Male' ? '♂️' : '♀️'}
                        </span>
                        {pet?.sex}
                    </div>

                    <Link
                        to={`/pet/${pet?.id}`}
                        className="details-link"
                        style={{
                            display: 'inline-block',
                            padding: '8px 16px',
                            backgroundColor: Colors.PRIMARY,
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            textAlign: 'center',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            fontSize: '0.95rem',
                            boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
                        }}
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PetCard; 