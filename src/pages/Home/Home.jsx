import React, { useEffect } from "react"

import { useAuth } from "@/contexts/AuthContext";

import Button from "react-bootstrap/Button"

export default function Home() {
  const { user } = useAuth();
  
  return ( user ? 'Hi user!' : 'Hey just login / sign up' );
}
