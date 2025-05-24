import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { ClerkLoaded } from '@clerk/clerk-react';

// Pages
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import MyPosts from './pages/MyPosts';
import AddPet from './pages/AddPet';
import PetDetails from './pages/PetDetails';
import Care from './pages/Care';
import Inbox from './pages/Inbox';
import Chat from './pages/Chat';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Styles
import Colors from './colors';

// Geçici çözüm: Environment variable çalışmıyorsa doğrudan key kullan
const clerkPublishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || 'pk_test_YW1hemVkLWNoaW1wLTU5LmNsZXJrLmFjY291bnRzLmRldiQ';

// Login Component
const LoginComponent = () => (
  <div style={{
    minHeight: '100vh',
    backgroundColor: Colors.WHITE,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  }}>
    <div style={{
      textAlign: 'center',
      maxWidth: '500px',
      padding: '40px',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      backgroundColor: 'white'
    }}>
      <div style={{
        fontSize: '60px',
        marginBottom: '20px'
      }}>
        🐾
      </div>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        color: Colors.PRIMARY,
        marginBottom: '10px'
      }}>
        Welcome to PetAdoptMe
      </h1>
      <p style={{
        color: Colors.GRAY,
        fontSize: '16px',
        marginBottom: '30px',
        lineHeight: '1.5'
      }}>
        Find your perfect companion and give a loving home to pets in need.
        Sign in to start your journey!
      </p>
      <SignInButton mode="modal">
        <button style={{
          backgroundColor: Colors.PRIMARY,
          color: 'white',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          boxShadow: '0 4px 15px rgba(232, 178, 14, 0.3)'
        }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#d4a60d';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = Colors.PRIMARY;
          }}>
          Sign In to Continue
        </button>
      </SignInButton>
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <p style={{
          color: Colors.GRAY,
          fontSize: '14px',
          margin: 0
        }}>
          🔒 Secure authentication powered by Clerk
        </p>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <Router>
        <div style={{
          minHeight: '100vh',
          backgroundColor: Colors.WHITE
        }}>
          <ClerkLoaded>
            <SignedIn>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/my-posts" element={<MyPosts />} />
                <Route path="/add-pet" element={<AddPet />} />
                <Route path="/pet-details/:id" element={<PetDetails />} />
                <Route path="/care" element={<Care />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/chat/:chatId" element={<Chat />} />
              </Routes>
              <Footer />
            </SignedIn>
            <SignedOut>
              <LoginComponent />
            </SignedOut>
          </ClerkLoaded>
        </div>
      </Router>
    </ClerkProvider>
  );
};

export default App;
