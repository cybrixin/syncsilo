import React, { useContext, useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';

const { 
    PUBLIC_FIREBASE_API_KEY,
    PUBLIC_FIREBASE_AUTH_DOMAIN,
    PUBLIC_FIREBASE_PROJECT_ID,
    PUBLIC_FIREBASE_STORAGE_BUCKET,
    PUBLIC_FIREBASE_MESSAGE_ID,
    PUBLIC_FIREBASE_APP_ID,
    PUBLIC_FIREBASE_MEASUREMENT_ID,
    PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY,
    PROD,
    PUBLIC_FIREBASE_EMULATOR_HOST,
    PUBLIC_FIREBASE_EMULATOR_AUTH_PORT,
    PUBLIC_FIREBASE_EMULATOR_FIRESTORE_PORT,
    PUBLIC_FIREBASE_EMULATOR_STORAGE_PORT,
} = import.meta.env;

const FIREBASE_CONFIG = {
    apiKey: PUBLIC_FIREBASE_API_KEY,
    authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: PUBLIC_FIREBASE_MESSAGE_ID,
    appId: PUBLIC_FIREBASE_APP_ID,
    measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID, 
};

const AppContext = React.createContext();

export function useApp() {
    return useContext(AppContext);
};

export default function AppProvider({
    children
}) {
    const [ loading, setLoading ] = useState(true);

    const [ config, setConfig ] = useState({
        app: null,
        auth: null,
        db: null,
        cloud: {
            folders: null,
            files: null,
            format: null,
        },
        storage: null,
        appCheck: null,
        analytics: null,
    });

    useEffect( () => {
        
        console.log(FIREBASE_CONFIG);

        let mounted = false;
        
        const appConfig = async () => {
            let { app, storage, appCheck, db, auth, analytics} = config;

            if(!loading || (app != null && storage != null && appCheck != null && db != null && auth != null && analytics != null)) return;
            
            const [
                { initializeApp }, 
                { initializeAppCheck, ReCaptchaV3Provider },
                { getAuth, connectAuthEmulator },
                { getFirestore, collection, doc, connectFirestoreEmulator },
                { getStorage, connectStorageEmulator },
                { getAnalytics }
            ] = await Promise.all([
                import("firebase/app"),
                import("firebase/app-check"),
                import("firebase/auth"),
                import("firebase/firestore"),
                import("firebase/storage"),
                import("firebase/analytics"),
            ]);

            
            app = initializeApp(FIREBASE_CONFIG);
            appCheck = initializeAppCheck(app, {
                provider: new ReCaptchaV3Provider(PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY),
                isTokenRefreshEnabled: true
            });

            auth = getAuth(app);
            db = getFirestore(app);
            storage = getStorage(app);
            analytics = getAnalytics(app);

            if(!PROD) {
                await Promise.all([
                    connectAuthEmulator(auth, `http://${PUBLIC_FIREBASE_EMULATOR_HOST}:${PUBLIC_FIREBASE_EMULATOR_AUTH_PORT}`),
                    connectFirestoreEmulator(db, PUBLIC_FIREBASE_EMULATOR_HOST, PUBLIC_FIREBASE_EMULATOR_FIRESTORE_PORT),
                    connectStorageEmulator(storage, PUBLIC_FIREBASE_EMULATOR_HOST, parseInt(PUBLIC_FIREBASE_EMULATOR_STORAGE_PORT))
                ]);
            }


            setConfig(Object.freeze({
                app,
                auth,
                db,
                cloud: {
                    folders: collection(db, "folders"),
                    files: collection(db, "files"),
                    format: doc => {
                        return { id: doc.id, ...doc.data() }
                    },
                },
                storage,
                appCheck,
                analytics,
            }));


            setLoading(false);
        }

        appConfig();

        return () => {
            mounted = true;
        }
    }, []);
    

    return (
        <AppContext.Provider value={{...config}}>
          { loading ? <Spinner /> : children }
        </AppContext.Provider>
    )
    
}