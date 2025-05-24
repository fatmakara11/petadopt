import React from 'react';
import { Link } from 'react-router-dom';
import Colors from '../colors';
import FavoriteButton from './FavoriteButton';

// Mobil uygulamadaki PetListItem bileşenine benzer bir bileşen
const PetCard = ({ pet }) => {
    if (!pet) {
        return null;
    }

    return (
        <div className="pet-card">
            <div className="image-container">
                <img src={pet?.imageUrl} alt={pet?.name} />
                <div className="favorite-button">
                    <FavoriteButton pet={pet} color="white" />
                </div>
            </div>
            <h3>{pet?.name}</h3>
            <div className="pet-info">
                <span className="breed">{pet?.breed}</span>
                <span className="age" style={{
                    color: Colors.PRIMARY,
                    backgroundColor: Colors.LIGHT_PRIMARY,
                    padding: '2px 7px',
                    borderRadius: '10px',
                    fontSize: '11px'
                }}>{pet?.age}YRS</span>
            </div>
            <Link to={`/pet-details/${pet?.id}`} className="details-link">View Details</Link>
        </div>
    );
};

export default PetCard; 