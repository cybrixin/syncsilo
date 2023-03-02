import { useState } from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom"

import AppContext from "@/contexts/AppContext";
import AuthContext from "@/contexts/AuthContext";

import Spinner from "@/components/Spinner";
import TestComponent from '@/components/TestComponent';

import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Login from "@/pages/Login";

export default function App() {
  return (
    <AppContext>
        <Router>
          <AuthContext>
            <Routes>
                <Route path="/signup" element={<Spinner />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/test" element={<TestComponent />}></Route>

                <Route exact path="/" element={<Home />}></Route>

                <Route path="*" element={<NotFound />}></Route>
            </Routes>
          </AuthContext>
        </Router>
    </AppContext>
  );
}
