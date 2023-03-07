import { useState, useEffect } from "react";
import { Navigate, BrowserRouter as Router, Route, Link, Routes } from "react-router-dom"
import Container from "react-bootstrap/Container";
import TopNav from "@/components/TopNav";

import TestComponent from '@/components/TestComponent';

import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/components/Dashboard";

import { useAuth } from '@/contexts/AuthContext';

export default function App() {

  const { user } = useAuth();

  console.log(user);

  return (
    <>
      <Router>
        <TopNav />
        <Routes>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/login" element={<Login />}></Route>

            <Route path="/test" element={<TestComponent />}></Route>
            
            <Route exact path="/folder/:folderId" element={user ? <Dashboard/> : <Navigate to="/" />}></Route>

            <Route exact path="/" element={user ? <Dashboard/> : <Home />}></Route>

            <Route path="*" element={<NotFound />}></Route>
        </Routes>
        <footer style={{marginTop: "220px"}}>
          <hr/>
          <Container fluid className="mt-2 p-0">
              <p className="text-center" style={{fontFamily: "Comfortaa"}}>Built with 💖 by Anweshan Roy Chowdhury.</p>
          </Container>
        </footer>
      </Router>
    </>
  );
}
