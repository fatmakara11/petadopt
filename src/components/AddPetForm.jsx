import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import Colors from '../colors';

const AddPetForm = () => {
    const navigate = useNavigate();
    const { user, isLoaded } = useUser();
    const [formData, setFormData] = useState({ category: 'Dogs', sex: 'Male' });
    const [categoryList, setCategoryList] = useState([]);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isLoaded && !user) {
            navigate('/login');
        }
        getCategories();
    }, [isLoaded, user, navigate]);

    const getCategories = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'Category'));
            const categories = [];
            snapshot.forEach((doc) => {
                categories.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            setCategoryList(categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setError("Failed to load categories");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setImage(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
        }
    };

    const generateRandomId = (length = 16) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const validateForm = () => {
        const requiredFields = ['name', 'breed', 'age', 'weight', 'address', 'about'];

        for (const field of requiredFields) {
            if (!formData[field]) {
                setError(`Please enter ${field}`);
                return false;
            }
        }

        if (!image) {
            setError('Please select an image');
            return false;
        }

        return true;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            // Upload image to Firebase Storage
            const storageRef = ref(storage, `Pet-Adopt/${Date.now()}_${image.name}`);
            await uploadBytes(storageRef, image);
            const downloadUrl = await getDownloadURL(storageRef);

            // Generate a random ID for the pet
            const randomId = generateRandomId();

            // Add pet to Firestore
            await addDoc(collection(db, 'Pets'), {
                about: formData.about,
                address: formData.address,
                age: formData.age,
                breed: formData.breed,
                category: formData.category,
                id: randomId,
                imageUrl: downloadUrl,
                name: formData.name,
                sex: formData.sex,
                userImage: user.imageUrl,
                userName:
                    (user.firstName && user.lastName)
                        ? user.firstName + ' ' + user.lastName
                        : (user.firstName || user.lastName || user.username || user.primaryEmailAddress?.emailAddress || 'Unknown'),
                useremail: user.primaryEmailAddress?.emailAddress,
                weight: formData.weight,
                createdAt: new Date()
            });

            alert('Pet added successfully!');
            navigate('/');
        } catch (error) {
            console.error("Error adding pet:", error);
            setError("Failed to add pet. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isLoaded) {
        return <div className="loading" style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    }

    return (
        <div className="add-pet-page">
            {/* Web Header */}
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
                    <Link to="/" style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: Colors.PRIMARY,
                        textDecoration: 'none'
                    }}>
                        PetAdoptMe
                    </Link>

                    <nav style={{ display: 'flex', gap: '25px' }}>
                        <Link to="/" style={{ color: Colors.GRAY, textDecoration: 'none' }}>Home</Link>
                        <Link to="/favorites" style={{ color: Colors.GRAY, textDecoration: 'none' }}>Favorites</Link>
                        <Link to="/messages" style={{ color: Colors.GRAY, textDecoration: 'none' }}>Messages</Link>
                        <Link to="/profile" style={{ color: Colors.GRAY, textDecoration: 'none' }}>Profile</Link>
                    </nav>
                </div>
            </header>

            {/* Breadcrumb Navigation */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '15px 20px',
                color: Colors.GRAY,
                fontSize: '0.9rem'
            }}>
                <Link to="/" style={{ color: Colors.GRAY, textDecoration: 'none' }}>Home</Link>
                {' > '}
                <span style={{ color: '#333' }}>Add New Pet</span>
            </div>

            <div className="add-pet-form-container" style={{
                maxWidth: '900px',
                margin: '20px auto 60px',
                padding: '30px',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 2px 15px rgba(0,0,0,0.05)'
            }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '600',
                    marginBottom: '30px',
                    textAlign: 'center',
                    color: '#333',
                    position: 'relative',
                    paddingBottom: '15px'
                }}>
                    Add New Pet For Adoption
                    <span style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80px',
                        height: '3px',
                        backgroundColor: Colors.PRIMARY
                    }}></span>
                </h1>

                {error && (
                    <div className="error-message" style={{
                        color: 'white',
                        backgroundColor: '#dc3545',
                        padding: '12px 20px',
                        borderRadius: '5px',
                        marginBottom: '25px',
                        fontSize: '0.95rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="add-pet-form" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '25px'
                }}>
                    {/* Image Upload - Takes up full width */}
                    <div className="image-upload" style={{
                        gridColumn: '1 / -1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: '15px'
                    }}>
                        <label htmlFor="image-input" style={{
                            cursor: 'pointer',
                            marginBottom: '10px'
                        }}>
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Selected"
                                    style={{
                                        width: '180px',
                                        height: '180px',
                                        objectFit: 'cover',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                    }}
                                />
                            ) : (
                                <div className="placeholder-image" style={{
                                    width: '180px',
                                    height: '180px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: Colors.GRAY,
                                    border: '2px dashed #ddd'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📷</div>
                                        <div>Add Photo</div>
                                    </div>
                                </div>
                            )}
                        </label>
                        <input
                            id="image-input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <p style={{
                            color: Colors.PRIMARY,
                            marginTop: '8px',
                            fontWeight: '500'
                        }}>
                            {imagePreview ? 'Change Photo' : 'Add Pet Photo'}
                        </p>
                    </div>

                    {/* Basic Info Form Fields */}
                    <div className="form-group">
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500'
                        }}>
                            Pet Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500'
                        }}>
                            Pet Category *
                        </label>
                        <select
                            name="category"
                            value={formData.category || 'Dogs'}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                appearance: 'none',
                                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 12px top 50%',
                                backgroundSize: '10px auto',
                                paddingRight: '30px'
                            }}
                        >
                            {categoryList.map((category) => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500'
                        }}>
                            Breed *
                        </label>
                        <input
                            type="text"
                            name="breed"
                            value={formData.breed || ''}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500'
                        }}>
                            Age (Years) *
                        </label>
                        <input
                            type="number"
                            name="age"
                            value={formData.age || ''}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500'
                        }}>
                            Gender *
                        </label>
                        <select
                            name="sex"
                            value={formData.sex || 'Male'}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                appearance: 'none',
                                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 12px top 50%',
                                backgroundSize: '10px auto',
                                paddingRight: '30px'
                            }}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500'
                        }}>
                            Weight (kg) *
                        </label>
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight || ''}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500'
                        }}>
                            Address *
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleInputChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {/* About Field - Takes up full width */}
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: '500'
                        }}>
                            About Pet *
                        </label>
                        <textarea
                            name="about"
                            value={formData.about || ''}
                            onChange={handleInputChange}
                            rows="5"
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                resize: 'vertical',
                                minHeight: '120px',
                                fontFamily: 'inherit'
                            }}
                            placeholder="Describe your pet's personality, habits, needs, and why they need a new home..."
                        ></textarea>
                    </div>

                    {/* Submit Button - Takes up full width */}
                    <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isSubmitting}
                            style={{
                                backgroundColor: Colors.PRIMARY,
                                color: 'white',
                                padding: '14px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                opacity: isSubmitting ? 0.7 : 1,
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                width: '100%',
                                transition: 'background-color 0.2s',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                            }}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Pet for Adoption'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <footer style={{
                backgroundColor: '#f8f9fa',
                padding: '30px 20px',
                borderTop: '1px solid #eee'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
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

export default AddPetForm; 