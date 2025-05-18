import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import Colors from '../colors';

// Mobil uygulamadaki add-new-pet sayfasına benzer bir form
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
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="add-pet-form-container" style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 20px'
        }}>
            <h1 style={{
                textAlign: 'center',
                marginBottom: '30px',
                color: Colors.PRIMARY,
                fontSize: '32px'
            }}>Add New Pet For Adoption</h1>

            {error && (
                <div className="error-message" style={{
                    color: 'white',
                    marginBottom: '20px',
                    backgroundColor: '#ff5252',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}

            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
                overflow: 'hidden'
            }}>
                <form onSubmit={onSubmit} className="add-pet-form" style={{ padding: '30px' }}>
                    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                        {/* Left Side - Image Upload */}
                        <div style={{
                            flex: '1',
                            minWidth: '300px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <div className="image-upload" style={{
                                marginBottom: '30px',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <label htmlFor="image-input" style={{
                                    cursor: 'pointer',
                                    display: 'block',
                                    marginBottom: '15px'
                                }}>
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Selected"
                                            style={{
                                                width: '300px',
                                                height: '300px',
                                                objectFit: 'cover',
                                                borderRadius: '12px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    ) : (
                                        <div className="placeholder-image" style={{
                                            width: '300px',
                                            height: '300px',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            color: Colors.GRAY,
                                            border: '2px dashed #ddd'
                                        }}>
                                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🖼️</div>
                                            <div style={{ fontSize: '18px' }}>Add Pet Photo</div>
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
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('image-input').click()}
                                    style={{
                                        backgroundColor: Colors.LIGHT_PRIMARY,
                                        color: Colors.PRIMARY,
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {imagePreview ? 'Change Photo' : 'Upload Photo'}
                                </button>
                            </div>
                        </div>

                        {/* Right Side - Form Fields */}
                        <div style={{ flex: '1.5', minWidth: '300px' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '20px',
                                marginBottom: '30px'
                            }}>
                                <div className="form-group">
                                    <label style={labelStyle}>Pet Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleInputChange}
                                        required
                                        style={inputStyle}
                                    />
                                </div>

                                <div className="form-group">
                                    <label style={labelStyle}>Pet Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category || 'Dogs'}
                                        onChange={handleInputChange}
                                        required
                                        style={inputStyle}
                                    >
                                        {categoryList.map((category) => (
                                            <option key={category.id} value={category.name}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label style={labelStyle}>Breed *</label>
                                    <input
                                        type="text"
                                        name="breed"
                                        value={formData.breed || ''}
                                        onChange={handleInputChange}
                                        required
                                        style={inputStyle}
                                    />
                                </div>

                                <div className="form-group">
                                    <label style={labelStyle}>Age *</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age || ''}
                                        onChange={handleInputChange}
                                        required
                                        style={inputStyle}
                                    />
                                </div>

                                <div className="form-group">
                                    <label style={labelStyle}>Gender *</label>
                                    <select
                                        name="sex"
                                        value={formData.sex || 'Male'}
                                        onChange={handleInputChange}
                                        required
                                        style={inputStyle}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label style={labelStyle}>Weight (kg) *</label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight || ''}
                                        onChange={handleInputChange}
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleInputChange}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '30px' }}>
                                <label style={labelStyle}>About *</label>
                                <textarea
                                    name="about"
                                    value={formData.about || ''}
                                    onChange={handleInputChange}
                                    rows="5"
                                    required
                                    style={{
                                        ...inputStyle,
                                        minHeight: '120px',
                                        resize: 'vertical'
                                    }}
                                ></textarea>
                            </div>
                        </div>
                    </div>

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
                            fontSize: '16px',
                            fontWeight: '600',
                            width: '100%',
                            marginTop: '20px',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Add Pet for Adoption'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Styles
const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333'
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    fontSize: '16px'
};

export default AddPetForm; 