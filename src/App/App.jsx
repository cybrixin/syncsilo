import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom"

import AppContext from "@/contexts/AppContext";
import AuthContext from "@/contexts/AuthContext";

import Spinner from "@/components/Spinner";
import TestComponent from '@/components/TestComponent';

import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

export default function App() {

  const [ mounted, setMounted ] = useState(false);

  const { PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY, PROD } = import.meta.env;

  useEffect( () => {
    if( mounted || !PROD ) {
      return;
    }

    const body = document.body;
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY}`;

    script.async = true;
    script.defer = true;

    script.onload = () => {
      setMounted(true);
    };

    body.appendChild(script);

    return () => {
      mounted
    }
  }, [])

  return (
    
    <Router>
      <Routes>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/test" element={<TestComponent />}></Route>

          <Route exact path="/" element={<Home />}></Route>

          <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </Router>
  );
}
