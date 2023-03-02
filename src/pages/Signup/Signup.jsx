import styles from '@/assets/styles/Auth.module.css';

import React, { useRef, useState, useEffect } from "react"

import CenteredContainer from "@/components/CenteredContainer"

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup';

import { greet, greetEmoji } from '@/util/util';

import { useAuth } from '@/contexts/AuthContext';

import { useNavigate, Link } from "react-router-dom"


export default function Signup() {


    const [ error, setError ] = useState("");
	const [slash, setSlash] = useState(false);
    const [ validated, setValidated ] = useState(false);
	const [ {emailError, passwordError, nameError, confirmPassworError} , setFieldError] = useState({
		nameError: false,
		emailError: false,
		passwordError: false,
		confirmPassworError: false,
	});

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const { userAuth, currentUser, logout } = useAuth();

    const emailRef = useRef();
    const passwordRef = useRef();
	const nameRef = useRef();
	const confirmPasswordRef = useRef();

    async function handleSubmit (evt) {
        evt.preventDefault();
        setError("");
        setLoading(true)
		setValidated(!true);

		const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
		const confirmPassword = confirmPasswordRef.current.value;
        try {

			setFieldError({
				nameError: false,
				emailError: false,
				passwordError: false,
				confirmPassworError: false,
			})

			if(email === "") {
				setFieldError( (obj) => ({...obj, emailError: "Email Address is required or invalid!"}));
			}

			if(confirmPassword === "") {
				setFieldError( (obj) => ({...obj, confirmPassworError: "Confirm Password is required!"}) );
			}

			if(password === "") {
				setFieldError( (obj) => ({...obj, passwordError: "Password is required!"}));
			}else if(password.length < 8) {
				setFieldError( (obj) => ({...obj, passwordError: "Password is not the correct length!"}));
			}else if(password !== confirmPassword) {
				setFieldError( (obj) => ({...obj, passwordError: "Passwords do not match", confirmPassworError: "Passwords do not match"}));
			}

			if(name === "") {
				setFieldError( (obj) => ({...obj, nameError: "Name is required"}));
			}

			
			await userAuth(email, password, true);
            
        }catch(err) {

        }finally {
            setLoading(false);
			setValidated(true); 
        }

		
    }

    useEffect(() => {
		console.log("hi");
		if(currentUser) {
			// Logged in user
			( async() => {
				await logout();
			})();
		}

		// TODO: Track new user sign up
    }, [currentUser]);
    

    return (
		<>
			<Navbar bg="light" variant="light">
				<Container fluid>
					<Navbar.Brand href="/">
						<span className='brand'>Fire Cloud</span>
					</Navbar.Brand>
				</Container>
      		</Navbar>
			<CenteredContainer style={{'--max-width': '800px'}}>
				<Card className={styles.card}>
					<Card.Body>
						<h4 className={`m-0 mb-2 ${styles.intro}`}>Hi! {greet()}{' '}<span className='emoji'>{greetEmoji()}</span></h4>
						<p className={`m-0 mb-2 ${styles.intro}`} style={{'--font-family': 'Montserrat', '--font-weight': '400',}}>We are glad to have you here. Just sign up with some details and lets hop on the journey together 🤝🏻!</p>
						<p className={`m-0 mb-2 ${styles.intro} ${styles.danger}`}>All <i className={`far fa-asterisk ${styles.asterisk}`}></i> fields are required.</p>
						<hr/>
						<Form onSubmit={handleSubmit} noValidate validated={validated}>
							<Form.Group id="name" as={Col} >
								<Form.Label className={styles.label}>Name&nbsp;<i className={`far fa-asterisk ${styles.asterisk}`}></i></Form.Label>
								<InputGroup hasValidation>
									<InputGroup.Text id="inputGroupNamePrepend" className={styles['input-group-text-prepend']}><i className='fas fa-signature'></i></InputGroup.Text>
									<Form.Control type="name" ref={nameRef} disabled={loading} required isValid={validated === true && nameError === false} placeholder="John Doe" />
									{ nameError !== false ? (<Form.Control.Feedback type="invalid">
              							{nameError}
            						</Form.Control.Feedback>) : <></> }
								</InputGroup>
							</Form.Group>
							<Form.Group id="email" as={Col} className={styles.gap}>
								<Form.Label className={styles.label}>Email&nbsp;<i className={`far fa-asterisk ${styles.asterisk}`}></i></Form.Label>
								<InputGroup hasValidation >
									<InputGroup.Text id="inputGroupEmailPrepend" className={styles['input-group-text-prepend']}><i className='fas fa-at'></i></InputGroup.Text>
									<Form.Control type="email" ref={emailRef} disabled={loading} required isValid={validated === true && emailError === false} placeholder="johndoe@example.com" />
									{ emailError !== false ? (<Form.Control.Feedback type="invalid">
              							{emailError}
            						</Form.Control.Feedback>) : <></> }
								</InputGroup>
							</Form.Group>
							<Form.Group id="password" as={Col} className={styles.gap}>
								<Form.Label className={styles.label}>Password&nbsp;<i className={`far fa-asterisk ${styles.asterisk}`}></i></Form.Label>
								<InputGroup hasValidation>
									<InputGroup.Text id="inputGroupPasswordPrepend" className={styles['input-group-text-prepend']}><i className='fas fa-user-secret'></i></InputGroup.Text>
									<Form.Control type={slash ? "text" : "password"} className={styles['input-group-text-prepend']} ref={passwordRef} disabled={loading} required isValid={validated === true && passwordError === false} placeholder="Enter your password" />
									<InputGroup.Text title="Show password" onClick={() => setSlash( prev => !prev)} className={styles['password-eye-button']}><i className={`fas fa-eye${slash ? '-slash' : ""}`}></i></InputGroup.Text>
									{ passwordError !== false ? (<Form.Control.Feedback type="invalid">
              							{passwordError}
            						</Form.Control.Feedback>) : <></> }
								</InputGroup>
							</Form.Group>
							<Form.Group id="confirm-password" as={Col} className={styles.gap}>
								<Form.Label className={styles.label}>Confirm Password&nbsp;<i className={`far fa-asterisk ${styles.asterisk}`}></i></Form.Label>
								<InputGroup hasValidation>
									<InputGroup.Text id="inputGroupConfirmPasswordPrepend" className={styles['input-group-text-prepend']}><i className='fas fa-user-secret'></i></InputGroup.Text>
									<Form.Control className={styles['input-group-text-prepend']} type="password" ref={confirmPasswordRef} disabled={loading} required isValid={validated === true && confirmPassworError === false} placeholder="Confirm your password" />
									<InputGroup.Text title="Show password" onClick={() => setSlash( prev => !prev)} className={styles['password-eye-button']}><i className={`fas fa-eye${slash ? '-slash' : ""}`}></i></InputGroup.Text>
									{ confirmPassworError !== false ? (<Form.Control.Feedback type="invalid">
              							{confirmPassworError}
            						</Form.Control.Feedback>) : <></> }
								</InputGroup>
							</Form.Group>
							{error && (<><hr/> <p className={`m-0 mt-2 mb-2 ${styles.intro} ${styles.danger}`} style={{'--font-family': 'Montserrat', '--font-weight': '400',}}><i className='far fa-exclaimation'></i>&nbsp;{error}</p></>)}
							<hr/>
							<Button disabled={loading} variant="outline-primary" size="lg" className={`${styles.button} mt-2`} type="submit">Sign Up</Button>
						</Form>
						<div className="w-100 mt-3">
							Need an account? <Link to="/login">Sign In</Link>
						</div>
					</Card.Body>
				</Card>
			</CenteredContainer>
		</>
    )
}
