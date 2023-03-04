import styles from '@/assets/styles/Auth.module.css';

import React, { useRef, useState, useEffect } from "react"

import CenteredContainer from "@/components/CenteredContainer"

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup';

import { greet, greetEmoji } from '@/util/util';

import { useAuth } from '@/contexts/AuthContext';

import { useNavigate, Link } from "react-router-dom"
import { useApp } from '@/contexts/AppContext/AppContext';

import { logEvent } from 'firebase/analytics';


export default function Signup() {
    const [ error, setError ] = useState("");
	const [slash, setSlash] = useState(false);
    const [ validated, setValidated ] = useState(false);
	
	const [ {emailError, passwordError, nameError, confirmPassworError, success} , setFieldError] = useState({
		nameError: false,
		emailError: false,
		passwordError: false,
		confirmPassworError: false,
		success: false
	});

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

	const { analytics } = useApp();
    const { authenticate, update, user } = useAuth();

    const emailRef = useRef();
    const passwordRef = useRef();
	const nameRef = useRef();
	const confirmPasswordRef = useRef();

	function resetAllState(){
		setFieldError({
			nameError: false,
			emailError: false,
			passwordError: false,
			confirmPassworError: false,
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

		const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
		const confirmPassword = confirmPasswordRef.current.value;
        try {

			let isError = false;

			if(email === "") {
				setFieldError( (obj) => ({...obj, emailError: "Email Address is required or invalid!"}));
				isError = true;
			}

			if(confirmPassword === "") {
				setFieldError( (obj) => ({...obj, confirmPassworError: "Confirm Password is required!"}) );
				isError = true;
			}

			if(password === "") {
				setFieldError( (obj) => ({...obj, passwordError: "Password is required!"}));
				isError = true;
			}else if(password.length < 6) {
				setFieldError( (obj) => ({...obj, passwordError: "Password is not the correct length!"}));
				isError = true;
			}else if(password !== confirmPassword) {
				setFieldError( (obj) => ({...obj, passwordError: "Passwords do not match", confirmPassworError: "Passwords do not match"}));
				isError = true;
			}

			if(name === "") {
				setFieldError( (obj) => ({...obj, nameError: "Name is required"}));
				isError = true;
			}

			if(isError) {
				setLoading(false);
				setValidated(true); 
				return;
			}

			const res = await authenticate(email, password, true);

			logEvent(analytics, 'sign_up', {
				method: 'Password',
			});

			await update({
				displayName: name,
				photoURL: `https://api.dicebear.com/5.x/initials/svg?seed=${name}`,
			}, false, res.user);

			navigate('/');
			
			return;
        }catch(err) {

			switch(err.code) {
				case 'auth/email-already-in-use': 
					setError(`There is already an account with the email ${email}. Please login to your account.`)
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
		}finally {
			setLoading(false);
			setValidated(true);
		}
    }

	useEffect( () => {
		if(user) navigate('/');
	}, []);
    

    return (
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
							<Form.Control className={styles['input-group-text-prepend']} type={slash ? "text" : "password"} ref={confirmPasswordRef} disabled={loading} required isValid={validated === true && confirmPassworError === false} placeholder="Confirm your password" />
							<InputGroup.Text title="Show password" onClick={() => setSlash( prev => !prev)} className={styles['password-eye-button']}><i className={`fas fa-eye${slash ? '-slash' : ""}`}></i></InputGroup.Text>
							{ confirmPassworError !== false ? (<Form.Control.Feedback type="invalid">
								{confirmPassworError}
							</Form.Control.Feedback>) : <></> }
						</InputGroup>
					</Form.Group>
					{error && (<><hr/> <p className={`m-0 mt-2 mb-2 ${styles.intro} ${styles.danger}`} id={styles[!success ? `auth-error` : `auth-success`]} style={{'--font-family': 'Montserrat', '--font-weight': '500',}}>{error}</p></>)}
					<hr/>
					<Button disabled={loading} variant="outline-primary" size="lg" className={`${styles.button} mt-2`} type="submit">Sign Up</Button>
				</Form>
				{ !loading ? <div className="w-100 mt-3">
					Need an account? <Link to="/login">Sign In</Link>
				</div> : <></>}
			</Card.Body>
		</Card>
	</CenteredContainer>
    )
}
