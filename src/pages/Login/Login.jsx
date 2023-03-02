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


export default function Login() {


    const [ error, setError ] = useState("");
    const [ validated, setValidated ] = useState(false);
	const [ {emailError, passwordError} , setFieldError] = useState({
		emailError: false,
		passwordError: false,
	});

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const { userAuth, currentUser } = useAuth();

    const emailRef = useRef()
    const passwordRef = useRef()

    async function handleSubmit (evt) {
        evt.preventDefault();
        setError("");
        setLoading(true)
		setValidated(!true);

        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        try {

			setFieldError({
				emailError: false,
				passwordError: false,
			})

			if(email === "") {
				setFieldError( (obj) => ({...obj, emailError: "Email Address is required or invalid!"}));
			}

			if(password === "") {
				setFieldError( (obj) => ({...obj, passwordError: "Password is required!"}));
			}

			console.log(emailRef.current)
            
        }catch(err) {

        }finally {
            setLoading(false);
			setValidated(true); 
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
				</Container>
      		</Navbar>
			<CenteredContainer style={{'--max-width': '500px'}}>
				<Card className={styles.card}>
					<Card.Body>
						<h4 className={`m-0 mb-2 ${styles.intro}`}>Hi! {greet()}{' '}<span className='emoji'>{greetEmoji()}</span></h4>
						<p className={`m-0 mb-2 ${styles.intro}`} style={{'--font-family': 'Montserrat', '--font-weight': '400',}}>We are glad to have you back. Sign in with your credentials and let hop on the journey 🙂!</p>
						<p className={`m-0 mb-2 ${styles.intro} ${styles.danger}`}>All <i className={`far fa-asterisk ${styles.asterisk}`}></i> fields are required.</p>
						<hr/>
						<Form onSubmit={handleSubmit} noValidate validated={validated}>
							<Form.Group id="email" as={Col} >
								<Form.Label className={styles.label}>Email&nbsp;<i className={`far fa-asterisk ${styles.asterisk}`}></i></Form.Label>
								<InputGroup hasValidation >
									<InputGroup.Text id="inputGroupEmailPrepend"><i className='fas fa-at'></i></InputGroup.Text>
									<Form.Control type="email" ref={emailRef} disabled={loading} required isValid={validated === true && emailError === false} placeholder="johndoe@example.com" />
									{ emailError !== false ? (<Form.Control.Feedback type="invalid">
              							{emailError}
            						</Form.Control.Feedback>) : <></> }
								</InputGroup>
							</Form.Group>
							<Form.Group id="password" as={Col} className={styles.gap}>
								<Form.Label className={styles.label}>Password&nbsp;<i className={`far fa-asterisk ${styles.asterisk}`}></i></Form.Label>
								<InputGroup hasValidation>
									<InputGroup.Text id="inputGroupPasswordPrepend" className=''><i className='fas fa-user-secret'></i></InputGroup.Text>
									<Form.Control type="password" ref={passwordRef} disabled={loading} required isValid={validated === true && passwordError === false} placeholder="Enter your password" />
									{ passwordError !== false ? (<Form.Control.Feedback type="invalid">
              							{passwordError}
            						</Form.Control.Feedback>) : <></> }
								</InputGroup>
							</Form.Group>
							{error && (<><hr/> <p className={`m-0 mt-2 mb-2 ${styles.intro} ${styles.danger}`} style={{'--font-family': 'Montserrat', '--font-weight': '400',}}><i className='far fa-exclaimation'></i>&nbsp;{error}</p></>)}
							<hr/>
							<div className="w-100 mt-3">
								<Link to="/forgot-password">Forgot Password?</Link>
							</div>
							<Button disabled={loading} variant="outline-success" size="lg" className={`${styles.button} mt-3`} type="submit">Sign In</Button>
						</Form>
						<div className="w-100 mt-3">
							Need an account? <Link to="/signup">Sign Up</Link>
						</div>
					</Card.Body>
				</Card>
			</CenteredContainer>
		</>
    )
}
