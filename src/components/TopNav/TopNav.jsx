import React from "react"
import { Link } from "react-router-dom"

import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Container from "react-bootstrap/Container"

import { useAuth } from "@/contexts/AuthContext"


import styles from './TopNav.module.css'


export default function TopNav() {

  return (
    <Navbar bg="dark" variant="dark" sticky="top">
      <Container fluid>
        <Navbar.Brand href="/">
          <span className={styles['brand-image']}></span>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
