import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import Colors from '../colors';
import PetCard from '../components/PetCard';

const Favorites = () => {
    const { user, isLoaded } = useUser();
    const [favPets, setFavPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded && user) {
            getFavoritePets();
        }
    }, [isLoaded, user]);

    const getFavoritePets = async () => {
        try {
            setLoading(true);
            const email = user?.primaryEmailAddress?.emailAddress;

            if (!email) {
                console.error("User email not found");
                return;
            }

            // Get the user's favorite pet IDs
            const userFavRef = doc(db, 'UserFavPet', email);
            const userFavDoc = await getDoc(userFavRef);

            if (!userFavDoc.exists()) {
                setLoading(false);
                return;
            }

            const { favorites } = userFavDoc.data();

            if (!favorites || favorites.length === 0) {
                setLoading(false);
                return;
            }

            // Fetch the pet details for each favorite ID
            const petsCollection = collection(db, 'Pets');
            const q = query(petsCollection, where('id', 'in', favorites));
            const querySnapshot = await getDocs(q);

            const petList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setFavPets(petList);
        } catch (error) {
            console.error("Error fetching favorite pets:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoaded) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="favorites-container">
            {/* Main Content */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '40px 20px'
            }}>
                <h1 style={{
                    textAlign: 'center',
                    marginBottom: '30px',
                    color: Colors.PRIMARY,
                    fontSize: '32px'
                }}>
                    My Favorites
                </h1>

                {loading ? (
                    <div className="loading" style={{ textAlign: 'center', padding: '50px' }}>
                        Loading favorites...
                    </div>
                ) : favPets.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        marginTop: '50px',
                        padding: '50px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                        color: Colors.GRAY
                    }}>
                        <p style={{ fontSize: '18px', marginBottom: '20px' }}>
                            You don't have any favorite pets yet.
                        </p>
                        <Link to="/" style={{
                            color: 'white',
                            backgroundColor: Colors.PRIMARY,
                            textDecoration: 'none',
                            fontWeight: '500',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            display: 'inline-block'
                        }}>
                            Browse Pets
                        </Link>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '25px',
                        marginTop: '20px'
                    }}>
                        {favPets.map(pet => (
                            <PetCard key={pet.id} pet={pet} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites; 