import { useApp } from '@/contexts/AppContext'
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";

import { useState, useEffect } from 'react';

export default function TestComponent() {
    const { db } = useApp();
    const [ users, setUsers ] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            if(snapshot.size) {
                const data = snapshot.docs.map(doc => doc.id)
                setUsers(data);
            }else {

            }
        });
    
      return () => {
        unsubscribe()
      }
    }, []);
    
    
    return (
       <ul>
            {users.map( (user, index) => 
                (<li key={index}>{user}</li>) 
            )}
       </ul>
    )
}
