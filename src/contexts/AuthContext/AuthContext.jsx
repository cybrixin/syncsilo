import React, { useContext, useEffect, useState } from 'react';

import { useApp } from '@/contexts/AppContext';
import Spinner from '@/components/Spinner';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
    
    const [currentUser, setCurrentUser] = useState(null);
    
    const [loading, setLoading] = useState(true);
    
    const [ config, setConfig ] = useState({
        userAuth: null,
        signout: null,
        resetPwd: null,
        updatePwd: null,
    });

    const { auth } = useApp();

    useEffect(() => {
        
        if(!auth) return;

        return async () => {
            const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updatePassword, onAuthStateChanged } = await import("firebase/auth")

            setConfig({
                userAuth: (email, password, register = false) => register? createUserWithEmailAndPassword(auth, email, password) : signInWithEmailAndPassword(auth, email, password),
                signout: () => signOut(auth),
                resetPwd: (email) => sendPasswordResetEmail(auth, email),
                updatePwd: (password) => currentUser ? updatePassword(currentUser, password) : false,
            })
            

            return onAuthStateChanged(auth, user => {
                setCurrentUser(user)
                setLoading(false)
            })
        }
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