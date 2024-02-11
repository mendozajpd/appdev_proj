import React from 'react';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import './index.css';

function Register() {
  return (
    <div className='Register-container'>
      <div className='Register-social-container'>
      <div className='Register-h1'>
        <p style={{ marginLeft: '10px', color: 'red', transition: 'color 0.3s', cursor: 'pointer' }}
         onMouseEnter={(e) => { e.target.style.color = 'red'; }}
         onMouseLeave={(e) => { e.target.style.color = 'white'; }}>
          Sign up to start <br /> listening
         </p>
        </div>

        <Button className='Register-social-button' variant="primary">
          <Image src="/images/google.png" roundedCircle className="Register-google" />
          {' '} Login with Google
        </Button>

        <Button className='Register-social-button' variant="primary">
          <Image src="/images/facebook.png" roundedCircle className="Register-facebook" />
          {' '} Login with Facebook
        </Button>

        <Button className='Register-social-button' variant="primary">
          <Image src="/images/apple.png" roundedCircle className="Register-apple" />
          {' '} Continue with Apple
        </Button>
      </div>

      <div className='Register-signup-form'>
        <div className='Register-textbox'>
          <Form>
            <p>Sign up with</p>
            <Form.Group className="Register-textbox" controlId="formGroupEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter Username" />
            </Form.Group>
            <Form.Group className="Register-textbox" controlId="formGroupPassword">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter Email" />
            </Form.Group>
            <Form.Group className="Register-textbox" controlId="formGroupEmail">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter Password" />
            </Form.Group>
            <Form.Group className="Register-textbox" controlId="formGroupPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm Password" />
            </Form.Group>

            <Button className='Register-button' variant="primary">Register</Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;