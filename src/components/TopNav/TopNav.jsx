import React from "react"
import { Navbar, Nav } from "react-bootstrap"
import { Link } from "react-router-dom"

import { useAuth } from "@/contexts/AuthContext"


import styles from './TopNav.module.css'


export default function TopNav() {

  return (
    <Navbar bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand href="/">
          <span className={styles['brand-image']}></span>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
