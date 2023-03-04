import React, { useEffect } from "react"

import { useAuth } from "@/contexts/AuthContext";

import Button from "react-bootstrap/Button"

export default function Home() {
  const { user, logout } = useAuth();

  useEffect(() => {
    console.log(user)
  }, [user])
  

  return (
    ( user ? <Button onClick={ () => logout()} variant="outline-primary" size="lg" type="button">Log Out</Button> : <a type="button" variant="outline-primary" href="/login">Login</a> )
  )
}
