import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import Home from "./HomePage";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        formData,
      );
      setFormData({
        email: "",
        password: "",
      });

      const token = response.data.access_token;
      localStorage.setItem("jwt_token", token); // change this in the future

      navigate('/home');
      // console.log(response.data);
    } catch (error) {
      // console.error("Login failed:", error);
      alert("Email or password is incorrect. Try again.");
    }
  };


  return (
    <Container className="main-container">
      <Row className="justify-content-md-center">
        <Col xs={10} md={6}>
          <div className="text-center text-white">
            <h1>
              Log in to
              <span>
                MEDIAHARBOR
              </span>
            </h1>
          </div>

          <div className="d-flex flex-column align-items-center">
            <Button
              variant="outline-danger"
              className="social-button mr-2 btn-sm rounded-pill"
            >
              <img
                src={process.env.PUBLIC_URL + "/register/google.png"}
                alt="Google Logo"
                className="mr-2"
              />
              Login with Google
            </Button>

            <Button
              variant="outline-danger"
              className="social-button mr-2 btn-sm rounded-pill login-facebook"
            >
              <img
                src={process.env.PUBLIC_URL + "/register/facebook.png"}
                alt="Facebook Logo"
                className="mr-2"
                style={{
                  marginRight: "20px",
                  width: "30px",
                  margin: "flex",
                }}
              />
              Login with Facebook
            </Button>

            <Button
              variant="outline-danger"
              className="social-button mr-2 btn-sm rounded-pill button"
            >
              <img
                src={process.env.PUBLIC_URL + "/register/apple.png"}
                alt="Apple Logo"
                className="mr-2"
              />
              Continue with Apple
            </Button>
            <div className="line"></div>
          </div>
          <Form className="main-content" onSubmit={handleSubmit}>
            <Form.Group className="d-flex flex-column align-items-start text-input-container">
              <Form.Label className="label">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="d-flex flex-column align-items-start">
              <Form.Label className="label">Password</Form.Label>
              <Form.Control
                type="password"
                id="inputPassword"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                aria-describedby="passwordHelpBlock"
              />
              <div id="passwordHelpBlock" className="form-text">
                Your password must be 8-20 characters long, contain uppercase, lowercase, and numbers.
              </div>
            </Form.Group>

            <div className="d-flex flex-row justify-content-between align-items-center login-options">
              <div className="remember-me">
                <Form.Check type="checkbox" label="Remember me" />
              </div>
              <a href="
              ">
                <em>Forgot password?</em>
              </a>
            </div>

            <Button
              variant="outline-danger"
              className="btn btn-outline-danger login-button btn-block rounded-pill"
              type="submit"
            >
              Login
            </Button>

            <hr className="my-4 bg-dark text-white" />
            <div className="text-center">
              <p>
                Don't have an account?{" "}
                <Link to="/" className="signup">
                  Sign up here
                </Link>
              </p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
