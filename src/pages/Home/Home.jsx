import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert'

import { Link } from 'react-router-dom';

import { useEffect } from 'react';

export default function Home() {
    
    useEffect(() => {

        const { PUBLIC_RAZORPAY_BUTTON_ID, PROD } = import.meta.env;
        console.log(PUBLIC_RAZORPAY_BUTTON_ID, PROD)
      let script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/payment-button.js";
      script.setAttribute("data-payment_button_id", PUBLIC_RAZORPAY_BUTTON_ID);

      script.async = true;

      script.onload = () => {
        console.log("loaded");
      };

      document.getElementById("razorpay").appendChild(script);
    }, [])
    

    return (
        <>
            <Container fluid className="mt-2">
                <Alert variant="info">
                    <Alert.Heading>FYI!</Alert.Heading>
                    <hr/>
                    <p>This app is yet in its beta stage. Under no circumstance should this be considered <strong>secure</strong> or <strong>stable</strong>. Please do not upload any personally identifiable content.</p>
                    <p><b>Be advised</b>: All content is strictly moderated by our moderators and/or by the administrator. If you violate the content policy, your account may be <i>permanently disabled</i> and your ip address <b>blacklisted</b>.</p>
                </Alert>
                <hr/>
                <center><a className='btn btn-primary' as={Link} href='/login'>Login</a></center>
                <hr/>
                <form id="razorpay"></form>
            </Container>
        </>

    )
}
