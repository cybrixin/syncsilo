import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Spinner from '@/components/Spinner';

export default function NotFound() {
    const navigate = useNavigate();
    
    useEffect(() => {
        navigate('/404.html');
        window.location.reload();
    }, [])
    
    return (
        <Spinner />
    )
}
