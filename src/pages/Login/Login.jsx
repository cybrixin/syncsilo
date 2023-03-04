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
import { useApp } from '@/contexts/AppContext/AppContext';

import { logEvent } from 'firebase/analytics'


export default function Login() {


    const [ error, setError ] = useState("");
	const [ slash, setSlash ] = useState(false);
    const [ validated, setValidated ] = useState(false);
	const [ {emailError, passwordError, success} , setFieldError] = useState({
		emailError: false,
		passwordError: false,
		success: false
	});

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

	const { analytics } = useApp();
    const { authenticate, user } = useAuth();

    const emailRef = useRef();
    const passwordRef = useRef();

	function resetAllState() {
		setFieldError({
			emailError: false,
			passwordError: false,
			success: false,
		});
		setSlash(false);
		setError("");
        setLoading(false)
		setValidated(false);
	}

    async function handleSubmit (evt) {
        evt.preventDefault();
        resetAllState();
        setLoading(true)
		setValidated(!true);

		
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        try {

			let isError = false;

			if(email === "") {
				setFieldError( (obj) => ({...obj, emailError: "Email Address is required or invalid!"}));
				isError = true;
			}

			if(password === "") {
				setFieldError( (obj) => ({...obj, passwordError: "Password is required!"}));
				isError = true;
			}

			if(isError) {
				setLoading(false);
				setValidated(true); 
				return;
			}

			await authenticate(email, password);

			logEvent(analytics, 'log_in', {
				method: 'password'
			})

			navigate('/');

			return;
        }catch(err) {

			console.log(err.code);

			switch(err.code) {
				case 'auth/user-not-found':
					setError(`No account was found with the email ${email}. Please sign up first.`);
					break;
				case 'auth/wrong-password':
					setError(`The email or password is incorrect. Please check and try again.`);
					break;
				case 'auth/user-disabled':
					setError(`The follwing account has been disabled by the system administrator. Please contact them & try again!`);
					break;
				case 'auth/invalid-email':
					setError(`The email address you have entered is invalid!`);
					break;
				case 'auth/invalid-password':
					setError(`The password you have provided is invalid. It must be atleast 6 characters.`);
					break;
				case 'auth/invalid-password-hash':
				case 'auth/invalid-password-salt':
					setError('There were some internal password errors. Please try again!');
					break;
				default:
					setError(`There were some internal errors. Please report to us with ${err.code} if required!`);
			}
        }finally{
			setLoading(false);
			setValidated(true);
		}
    }

	useEffect( () => {
		resetAllState();
		if(user) navigate('/');
	}, []);
    

    return (
		<CenteredContainer style={{'--max-width': '500px'}}>
			<Card className={styles.card}>
				<Card.Body>
					<h4 className={`m-0 mb-2 ${styles.intro}`}>Hi! {greet()}{' '}<span className='emoji'>{greetEmoji()}</span></h4>
					<p className={`m-0 mb-2 ${styles.intro}`} style={{'--font-family': 'Montserrat', '--font-weight': '400',}}>We are glad to have you back. Sign in with your credentials and let hop on the journey 🤝🏻!</p>
					<p className={`m-0 mb-2 ${styles.intro} ${styles.danger}`}>All <i className={`far fa-asterisk ${styles.asterisk}`}></i> fields are required.</p>
					<hr/>
					<Form onSubmit={handleSubmit} noValidate validated={validated}>
						<Form.Group id="email" as={Col}>
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
						{error && (<><hr/> <p className={`m-0 mt-2 mb-2 ${styles.intro} ${styles.danger}`} id={styles[!success ? `auth-error` : `auth-success`]} style={{'--font-family': 'Montserrat', '--font-weight': '500',}}>{error}</p></>)}
						<hr/>
						{ !loading ? <div className="w-100 mt-3">
							<Link to="/forgot-password">Forgot Password?</Link>
						</div> : <></> }
						<Button disabled={loading} variant="outline-primary" size="lg" className={`${styles.button} mt-2`} type="submit">Sign In</Button>
					</Form>
					{ !loading ? <div className="w-100 mt-3">
						Need an account? <Link to="/signup">Sign Up</Link>
					</div> : <></>}
				</Card.Body>
			</Card>
		</CenteredContainer>
    )
}
