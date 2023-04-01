import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"

import Navbar from "react-bootstrap/Navbar"
import Container from "react-bootstrap/Container"
import Dropdown from "react-bootstrap/Dropdown"

import { useAuth } from "@/contexts/AuthContext"

import styles from './TopNav.module.css'

import noUser from '@/assets/images/no-user.jpg'


export default function TopNav() {
  
  const [ show, setShow ] = useState(false);
  const [ link, setLink ] = useState('/login')

  const { logout, user } = useAuth();

  const navigate = useNavigate();

  function handleLogout(evt) {
    evt.preventDefault();
    logout();
  }

  function handleAuth() {
    navigate(link);
    setLink( _ => window.location.pathname === '/login' ? '/signup' : '/login');
  }


  useEffect( () => {
    if(user) setLink('/login');
  }, [user])
  

  return (
    <Navbar bg="dark" variant="dark" sticky="top">
      <Container fluid>
        <Navbar.Brand href="/">
          <span className={styles['brand-image']}></span>
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          { !user ? (
            <Navbar.Text>
              <a as={<Link />} id={styles["login-link"]} onClick={handleAuth}>{link === '/login' ? 'Login' : 'Sign up'}</a>
            </Navbar.Text>
          ) : (
            <Dropdown align='end' autoClose={true} onToggle={ (res) => setShow(res)}>
              <Dropdown.Toggle className={`${styles["dropdown-toggle"]} ${show ? styles["show"] : ''}`.trim()}>
                <img src={user?.photoURL ?? noUser} className={styles["user-profile"]} />
              </Dropdown.Toggle>
              <Dropdown.Menu className={styles['dropdown-toggle-items']}>
                <Dropdown.Item role="button" onClick="">My Profile</Dropdown.Item>
                <Dropdown.Item role="button" onClick={handleLogout}>Sign Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> 
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
