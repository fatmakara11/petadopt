import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import Colors from '../colors';
import VisionPetAnalyzer from './VisionPetAnalyzer';

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
    const [aiStatus, setAiStatus] = useState(null);

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

    // AI analiz sonuçlarını işleyen fonksiyon
    const handleAIAnalysisComplete = (aiFormData) => {
        console.log('🎯 AI Analiz sonucu alındı:', aiFormData);

        setFormData(prev => ({
            ...prev,
            ...aiFormData
        }));

        // AI durumunu güncelle
        setAiStatus({
            success: true,
            breed: aiFormData.breed,
            confidence: aiFormData.confidence,
            timestamp: new Date().toLocaleTimeString('tr-TR')
        });
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
                createdAt: new Date(),
                // AI analysis data
                aiAnalysis: formData.aiAnalysis || null,
                confidence: formData.confidence || null
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
                                                borderRadius: '15px',
                                                border: `3px solid ${Colors.PRIMARY}`
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '300px',
                                            height: '300px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '15px',
                                            border: '2px dashed #ddd',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#666'
                                        }}>
                                            <div style={{ fontSize: '60px', marginBottom: '10px' }}>🐾</div>
                                            <p>Click to add photo</p>
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
                                <p style={{ color: Colors.PRIMARY, fontSize: '14px', textAlign: 'center' }}>
                                    {imagePreview ? 'Click to change photo' : 'Add Photo'}
                                </p>
                            </div>

                            {/* AI Pet Analyzer */}
                            <VisionPetAnalyzer
                                imageUri={imagePreview}
                                onAnalysisComplete={handleAIAnalysisComplete}
                                disabled={isSubmitting}
                            />

                            {/* AI Status Göstergesi */}
                            {aiStatus && (
                                <div style={{
                                    marginTop: '20px',
                                    padding: '15px',
                                    backgroundColor: '#fff3e0',
                                    border: `1px solid ${Colors.PRIMARY}`,
                                    borderRadius: '8px',
                                    width: '100%'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: '10px',
                                        gap: '10px'
                                    }}>
                                        <span style={{ fontSize: '20px' }}>✅</span>
                                        <h4 style={{
                                            margin: 0,
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            color: Colors.PRIMARY
                                        }}>AI Analiz Sonucu</h4>
                                    </div>
                                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#e65100' }}>
                                        🐾 Tespit: <strong>{aiStatus.breed}</strong>
                                    </p>
                                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#e65100' }}>
                                        📊 Güven: <strong>{Math.round(aiStatus.confidence * 100)}%</strong>
                                    </p>
                                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#e65100' }}>
                                        ⏰ Analiz: {aiStatus.timestamp}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right Side - Form Fields */}
                        <div style={{
                            flex: '1',
                            minWidth: '400px'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                        Pet Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleInputChange}
                                        style={{
                                            width: '100%',
                                            padding: '15px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                            fontSize: '16px'
                                        }}
                                        placeholder="Enter pet name"
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                        Pet Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        style={{
                                            width: '100%',
                                            padding: '15px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                            fontSize: '16px'
                                        }}
                                    >
                                        {categoryList.map((category, index) => (
                                            <option key={index} value={category.name}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                        Breed *
                                    </label>
                                    <input
                                        type="text"
                                        name="breed"
                                        value={formData.breed || ''}
                                        onChange={handleInputChange}
                                        style={{
                                            width: '100%',
                                            padding: '15px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                            fontSize: '16px'
                                        }}
                                        placeholder="AI tarafından otomatik doldurulur"
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                        Age *
                                    </label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age || ''}
                                        onChange={handleInputChange}
                                        style={{
                                            width: '100%',
                                            padding: '15px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                            fontSize: '16px'
                                        }}
                                        placeholder="AI tahmini yaş"
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                        Gender *
                                    </label>
                                    <select
                                        name="sex"
                                        value={formData.sex}
                                        onChange={handleInputChange}
                                        style={{
                                            width: '100%',
                                            padding: '15px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                            fontSize: '16px'
                                        }}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                        Weight (kg) *
                                    </label>
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight || ''}
                                        onChange={handleInputChange}
                                        style={{
                                            width: '100%',
                                            padding: '15px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                            fontSize: '16px'
                                        }}
                                        placeholder="Kilogram (kg)"
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleInputChange}
                                        style={{
                                            width: '100%',
                                            padding: '15px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                            fontSize: '16px'
                                        }}
                                        placeholder="Pet'in bulunduğu adres"
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>
                                        About *
                                    </label>
                                    <textarea
                                        name="about"
                                        value={formData.about || ''}
                                        onChange={handleInputChange}
                                        rows={5}
                                        style={{
                                            width: '100%',
                                            padding: '15px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                            fontSize: '16px',
                                            resize: 'vertical'
                                        }}
                                        placeholder="AI tarafından otomatik oluşturulan açıklama..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={{
                                        backgroundColor: isSubmitting ? '#ccc' : Colors.PRIMARY,
                                        color: 'white',
                                        padding: '15px 30px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '10px'
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span>⏳</span>
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        'Submit'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPetForm; 