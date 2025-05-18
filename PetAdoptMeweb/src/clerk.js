import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';

// Clerk anahtarı - Mobil uygulama ile aynı key kullanılıyor
export const clerkKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || "pk_test_YW1hemVkLWNoaW1wLTU5LmNsZXJrLmFjY291bnRzLmRldiQ";

// ClerkProvider ile uygulama wrapping - düzgün HOC yapısı
export function withClerkProvider(Component) {
    // Bir fonksiyon komponent döndür
    return function WithClerkProvider(props) {
        return (
            <ClerkProvider publishableKey={clerkKey}>
                <Component {...props} />
            </ClerkProvider>
        );
    };
} 