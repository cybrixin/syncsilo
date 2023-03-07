import React, { useContext, useEffect, useState } from 'react';

import { useApp } from '@/contexts/AppContext';
import Spinner from '@/components/Spinner';

import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
    const [ user, setUser ] = useState(null);
    const [ verification, setVerification ] = useState(false);
    const [ verificationEmail, setVerificationEmail ] = useState(false);
    
    const [loading, setLoading] = useState(true);
    
    const [ config, setConfig ] = useState({
        authenticate: null,
        logout: null,
        reset: null,
        update: null,
        verify: null,
    });

    const { auth } = useApp();

    useEffect(() => {
        
        let mounted = false;

        if(!auth) return;

        let obj;

        const authConfig = async () => {
            const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updatePassword, updateProfile, sendEmailVerification, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth")
            
            obj = {
                authenticate: (email, password, register = false) => register? createUserWithEmailAndPassword(auth, email, password) : signInWithEmailAndPassword(auth, email, password),
                sso: (provider = 'google') => signInWithPopup(auth, new GoogleAuthProvider()),
                update: (obj, pwd = false, user = null) => pwd ? updatePassword(user ?? auth.currentUser, password) : updateProfile(user ?? auth.currentUser, obj),
                logout: () => signOut(auth),
                reset: (email) => sendPasswordResetEmail(auth, email),
                verify: async (user = null) => { 
                    await sendEmailVerification(user ?? auth.currentUser);
                    setVerificationEmail(true);
                }
            }

            setConfig(obj)
            
            mounted = true;
        }

        if(!mounted) authConfig();

        return onAuthStateChanged(auth, user => {
            setUser(user);
            setLoading(false);
            setVerification(false);

            if(user) {
                setVerification(user.emailVerified);
            }
        })

    }, []);
    


    const value = Object.freeze({
        user,
        verification,
        verificationEmail,
        ...config,
    });

    return (
        <AuthContext.Provider value={value}>
            { loading ? <Spinner /> : children }
        </AuthContext.Provider>
    )
}