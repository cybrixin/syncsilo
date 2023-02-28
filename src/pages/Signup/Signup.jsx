import styles from '@/assets/styles/Auth.module.css';

import React, { useRef, useState, useEffect } from "react"

import CenteredContainer from "@/components/CenteredContainer"

import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'

import { greet, greetEmoji } from '@/util/util';

import { useAuth } from '@/contexts/AuthContext';

import { useNavigate, Link } from "react-router-dom"


export default function Signup() {

    const [ error, setError ] = useState("");
	const [ { nameError, emailError, passwordError, confirmPasswordError }, setFieldError ] = useState({
		nameError: "",
		emailError: "",
		passwordError: "",
		confirmPasswordError: "",
	});
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const { userAuth, currentUser } = useAuth();

    const emailRef = useRef()
    const passwordRef = useRef();
	const confirmPasswordRef = useRef();
	const nameRef = useRef();

    async function handleSubmit (evt) {
        evt.preventDefault();
        setError("");
        setLoading(true)

        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        try {
            if(email === "" || password === "") {
                setError("All fields are required.");
            }else {
                // await userAuth(emailRef.current.value, passwordRef.current.value)
            }
        }catch(err) {

        }finally {
            setLoading(false);   
        }
    }

    useEffect(() => {
      if(currentUser) {
        // Logged in user
        navigate('/');
      }
    }, []);
    

    return (
		<>
			<Navbar bg="light" variant="light">
				<Container fluid>
					<Navbar.Brand href="/">
						<span className='brand'>Fire Cloud</span>
					</Navbar.Brand>
					<Navbar.Collapse className="justify-content-center">
						<Navbar.Text style={{color: 'unset'}}>
							<span className="intro">Sign Up Page</span>
						</Navbar.Text>
					</Navbar.Collapse>
				</Container>
      		</Navbar>
			<CenteredContainer maxWidth={"500px"}>
				<Card>
					<Card.Body>
						<h4 className={`m-0 mb-2 ${styles.intro}`}>Hi! {greet()}{' '}<span className='emoji'>{greetEmoji()}</span></h4>
						{/* <p className={`m-0 mb-2 ${styles.intro}`}>Please sign in to continue.</p> */}
						<hr/>
						<p className={`m-0 mb-4 ${styles.intro} ${styles.danger}`}>All * fields are requied.</p>
						<Form onSubmit={handleSubmit}>
							<Form.Group id="name">
								<Form.Label className={styles.label}>Name*</Form.Label>
								<Form.Control type="name" ref={nameRef} disabled={loading} />
							</Form.Group>
							<Form.Group id="email">
								<Form.Label className={styles.label}>Email*</Form.Label>
								<Form.Control type="email" ref={emailRef} disabled={loading} />
							</Form.Group>
							<Form.Group id="password" className={styles.gap}>
								<Form.Label className={styles.label}>Password*</Form.Label>
								<Form.Control type="password" ref={passwordRef} disabled={loading} />
							</Form.Group>
                            <Form.Group id="confirm-password" className={styles.gap}>
								<Form.Label className={styles.label}>Confirm Password*</Form.Label>
								<Form.Control type="password" ref={confirmPasswordRef} disabled={loading} />
							</Form.Group>
							{error && (<><hr/> <p className={`m-0 mt-2 mb-2 ${styles.intro} ${styles.danger}`} style={{fontWeight: 500}}>Aw snap! There was an error! {error}</p></>)}
							<hr/>
							<Button disabled={loading} variant="outline-primary" size="lg" className={`${styles.button} mt-3`} type="submit">Sign Up</Button>
						</Form>
						<div className="w-100 mt-3">
							Already have an account? <Link to="/login">Sign In</Link>
						</div>
					</Card.Body>
				</Card>
			</CenteredContainer>
		</>
    )
}
