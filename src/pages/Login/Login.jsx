import '@/assets/styles/Auth.css';

import styles from '@/assets/styles/Auth.module.css';

import React, { useRef, useState, useEffect } from "react"

import CenteredContainer from "@/components/CenteredContainer"

import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import Stack from 'react-bootstrap/Stack'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';

import { greet, greetEmoji } from '@/util/util';

import { useAuth } from '@/contexts/AuthContext';

import { useNavigate, Link } from "react-router-dom"
import { useApp } from '@/contexts/AppContext/AppContext';

import { logEvent } from 'firebase/analytics'

const { PROD } = import.meta.env;


export default function Login() {


    const [ error, setError ] = useState("");
	const [ providerError, setProviderError ] = useState("");
	const [ slash, setSlash ] = useState(false);
    const [ validated, setValidated ] = useState(false);
	const [ {emailError, passwordError, success} , setFieldError] = useState({
		emailError: false,
		passwordError: false,
		success: false
	});

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

	const { analytics, auth } = useApp();
    const { authenticate, user, sso, providers, methods } = useAuth();

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
		setProviderError("");
        setLoading(false)
		setValidated(false);
	}

	async function handleSSO (evt) {

		evt.preventDefault();
        resetAllState();
        setLoading(true)
		
		try {
			const provider = evt.target.dataset.provider;

			await sso(provider);

			logEvent(analytics, 'login', {
				method: provider
			});

			navigate('/');

			return;

		}catch ( err ) {
			console.log(err.code);
			console.log(err.message);
			console.log(err.email);
			console.table(err.customData.email);


			switch(err.code) {
				case 'auth/user-not-found':
					setError(`No account was found. Please sign up first.`);
					break;
				case 'auth/user-disabled':
					setError(`The follwing account has been disabled by the system administrator. Please contact them & try again!`);
					break;
				case 'auth/account-exists-with-different-credential':
					setError(`An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.`);	
					methods(auth, err.customData.email).then( (signinmethod) => {
						
						let provider = Object.keys(providers).filter( value => signinmethod.includes(value));

						provider = provider.map( key => providers[key] );

						provider = provider.join(' or ');

						setProviderError(`Please try to ${provider}.`)
						
					}).catch( (err) => console.log(err));
					
					break;
				case 'auth/credential-already-in-use':
					setError('This credential is already associated with a different user account.');
					break;
				default:
					setError(`There were some internal errors. Please report to us with ${err.code} if required!`);
			}
		}finally {
			setLoading(!true);
		}
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

			logEvent(analytics, 'login', {
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
				case 'auth/account-exists-with-different-credential':
					setError('An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.');
					break;
				case 'auth/credential-already-in-use':
					setError('This credential is already associated with a different user account.');
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
		<>
			<Alert variant="warning">
				<Alert.Heading>Social Sign In is currently under development</Alert.Heading>
				<hr/>
				<p>Hi 👋🏻, please note that currently sign in in with Google/Facebook/Twitter is under development. There are various reasons like Facebook will take 24 hrs to review the App Policy, website etc, while Twitter is reviewing my dev account based on their new Terms & Conditions. I will update these as soon as they are available.</p>
				<p>On the other hand, I need a little bit more time to configure Google Linking which may take a bit more time.</p>
				<p>Your patience is appreciated.</p>
			</Alert>
			<CenteredContainer style={{'--max-width': '800px'}}>
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
							{providerError && (<><hr/> <p className={`m-0 mb-2 ${styles.intro} ${styles.danger}`} style={{'--font-family': 'Montserrat', '--font-weight': '500', 'color': 'var(--bs-info)'}}>{providerError}</p></>)}
							<hr/>
							{ !loading ? <div className="w-100 mt-3">
								<Link to="/forgot-password">Forgot Password?</Link>
							</div> : <></> }
							<Button disabled={loading} variant="outline-primary" className={`${styles.button} mt-2`} type="submit">Sign In</Button>
						</Form>
						<div className="w-100 border border-dark mt-3 h-0 mb-3" id={styles['or']} data-content="OR"></div>
						<Stack direction="horizontal" gap={3} className="me-auto w-100">
							<Button className="w-50 text-start vertical-middle" variant="outline-dark" style={{'--bs-btn-hover-border-color': '#db4437', '--bs-btn-hover-bg': '#db4437'}} onClick={handleSSO} data-provider="google" disabled={loading}><i className="fab fa-google"></i>&nbsp;Sign in with Google</Button>
							<div className="vr" />
							<Button className="w-50 text-start vertical-middle" variant="outline-dark" onClick={handleSSO} data-provider="github" disabled={loading}><i className="fab fa-github"></i>&nbsp;Sign in with Github</Button>
							<div className="vr" />
							<Button className="w-50 text-start vertical-middle" variant="outline-dark" style={{'--bs-btn-hover-border-color': '#3c5a99', '--bs-btn-hover-bg': '#3c5a99'}} onClick={handleSSO} data-provider="facebook" disabled={!PROD ? loading : PROD}><i className="fab fa-facebook"></i>&nbsp;Sign in with Facebook</Button>
							{/* <div className="vr" /> */}
							{/* <Button className="w-50 text-start vertical-middle" variant="outline-dark" style={{'--bs-btn-hover-border-color': '#1da1f2', '--bs-btn-hover-bg': '#1da1f2'}} onClick={handleSSO} data-provider="twitter" disabled={PROD}><i className="fab fa-twitter"></i>&nbsp;Sign in with Twitter</Button> */}
						</Stack>
						<hr/>
						{ !loading ? <div className="w-100 mt-3">
							Need an account? <Link to="/signup">Sign Up</Link>
						</div> : <></>}
					</Card.Body>
				</Card>
			</CenteredContainer>
		</>
    )
}


// function forgetPassword({state: [open, setOpen]}) {

// 	const [name, setName] = useState("")

// 	function openModal() {
// 		setOpen(true)
// 	}
	
// 	function closeModal() {
// 		setOpen(false)
// 	}

// 	return (
// 		<Modal>
// 			<Form>
// 				<Modal.Body>
// 					<Form.Group>
// 					<Form.Label>Forget Password</Form.Label>
// 					<Form.Control
// 						type="text"
// 						required
// 						value={name}
// 						onChange={e => setName(e.target.value)}
// 					/>
// 					</Form.Group>
// 				</Modal.Body>
// 				<Modal.Footer>
// 					<Button variant="secondary">
// 					Close
// 					</Button>
// 					<Button variant="success" type="submit">
// 					Add Folder
// 					</Button>
// 				</Modal.Footer>
// 			</Form>
// 		</Modal>
//   	)
// }