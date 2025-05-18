import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { withClerkProvider } from './clerk';
import { useAuth } from '@clerk/clerk-react';
import Home from './pages/Home';
import PetDetails from './pages/PetDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import AddPetForm from './components/AddPetForm';
import './styles.css';

// Kimlik doğrulama kontrolü için Protected Route bileşeni
const ProtectedRoute = ({ children }) => {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return <div className="loading">Yükleniyor...</div>;
    }

    if (!isSignedIn) {
        return <Navigate to="/login" />;
    }

    return children;
};

// Giriş yapılmış kullanıcılara özel routelar için
const AuthRoute = ({ children }) => {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return <div className="loading">Yükleniyor...</div>;
    }

    if (isSignedIn) {
        return <Navigate to="/" />;
    }

    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={
                    <AuthRoute>
                        <Login />
                    </AuthRoute>
                } />
                <Route path="/register" element={
                    <AuthRoute>
                        <Register />
                    </AuthRoute>
                } />

                {/* Protected routes */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />
                <Route path="/pet/:id" element={
                    <ProtectedRoute>
                        <PetDetails />
                    </ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                } />
                <Route path="/favorites" element={
                    <ProtectedRoute>
                        <Favorites />
                    </ProtectedRoute>
                } />
                <Route path="/add-pet" element={
                    <ProtectedRoute>
                        <AddPetForm />
                    </ProtectedRoute>
                } />

                {/* Redirect all other routes to home */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

// ClerkProvider ile sarmalayarak export et
export default withClerkProvider(App); 