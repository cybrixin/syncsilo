import React, { useContext, useEffect, useState } from 'react';

import { useApp } from '@/contexts/AppContext';
import Spinner from '@/components/Spinner';

import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [ config, setConfig ] = useState({
        userAuth: null,
        logout: null,
        resetPwd: null,
        updatePwd: null,
    });

    const { auth } = useApp();

    useEffect(() => {
        
        let mounted = false;

        if(!auth) return;

        const authConfig = async () => {
            const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updatePassword } = await import("firebase/auth")

            setConfig({
                userAuth: (email, password, register = false) => register? createUserWithEmailAndPassword(auth, email, password) : signInWithEmailAndPassword(auth, email, password),
                logout: () => signOut(auth),
                resetPwd: (email) => sendPasswordResetEmail(auth, email),
                updatePwd: (password) => currentUser ? updatePassword(currentUser, password) : false,
            })
            
            mounted = true;
        }

        if(!mounted) authConfig();

        return onAuthStateChanged(auth, user => {
            // TODO: Trigger => user !== undefined => Share info in context.
            console.log(user);
            setLoading(false);
            setCurrentUser(user);
        })

    }, []);
    


    const value = Object.freeze({
        currentUser,
        ...config,
    });

    return (
        <AuthContext.Provider value={value}>
            { loading ? <Spinner /> : children }
        </AuthContext.Provider>
    )
}