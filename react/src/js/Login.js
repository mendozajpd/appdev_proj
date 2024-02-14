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
            <h1 style={{ marginTop: "30px" }}>
              Log in to
              <span
                style={{
                  marginLeft: "10px",
                  color: "red",
                  transition: "color 0.3s",
                  cursor: "text"
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "red";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "white";
                }}
              >
                MEDIAHARBOR
              </span>
            </h1>
          </div>

          <div className="d-flex flex-column align-items-center">
            <Button
              variant="outline-primary"
              className="social-button mr-2 btn-sm"
              style={{
                fontSize: "150%",
                borderRadius: "20px",
                width: "100%", 
                height: "50px", 
                marginTop: "30px",
                marginBottom: "10px",
                backgroundColor: "transparent", 
                borderColor: "#8d4b4b", 
                color: "#ffffff", 
                transition: "0.3", 
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "red";
                e.target.style.color = "white";
                e.target.style.borderColor = "#8d4b4b";
                e.target.style.transform = "scale(1.1)"; 
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#ffffff";
                e.target.style.borderColor = "#8d4b4b";
                e.target.style.transform = "scale(1)"; 
              }}
            >
              <img
                src={process.env.PUBLIC_URL + "/register/google.png"}
                alt="Google Logo"
                className="mr-2"
                style={{
                  marginRight: "20px",
                  width: "30px",
                  margin: "flex",
                }}
              />
              Login with Google
            </Button>
            <Button
              variant="outline-primary"
              className="social-button mr-2 btn-sm"
              style={{
                fontSize: "150%",
                borderRadius: "20px",
                width: "100%",
                height: "50px",
                marginBottom: "10px",
                backgroundColor: "transparent",
                borderColor: "#8d4b4b",
                color: "#ffffff",
                transition: "background-color 0.3s, color 0.3s, transform 0.3",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "red";
                e.target.style.color = "white";
                e.target.style.borderColor = "#8d4b4b";
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#ffffff";
                e.target.style.borderColor = "#8d4b4b";
                e.target.style.transform = "scale(1)";
              }}
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
              variant="outline-primary"
              className="social-button mr-2 btn-sm"
              style={{
                fontSize: "150%",
                borderRadius: "20px",
                width: "100%",
                height: "50px",
                marginBottom: "10px",
                backgroundColor: "transparent",
                borderColor: "#8d4b4b",
                color: "#ffffff",
                transition: "background-color 0.3s, color 0.3s, transform 0.3",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "red";
                e.target.style.color = "white";
                e.target.style.borderColor = "#8d4b4b";
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.borderColor = "#8d4b4b";
                e.target.style.transform = "scale(1)";
              }}
            >
              <img
                src={process.env.PUBLIC_URL + "/register/apple.png"}
                alt="Apple Logo"
                className="mr-2"
                style={{
                  marginRight: "20px",
                  width: "30px",
                  margin: "flex",
                }}
              />
              Continue with Apple
            </Button>
            <div className="line"></div>
          </div>
          <Form className="main-content" onSubmit={handleSubmit}>
            <Form.Group className="d-flex flex-column align-items-start">
              <Form.Label className="label">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control email-input"
                style={{
                  color: "whitesmoke",
                  width: "100%",
                  marginTop: "30",
                  padding: "12px",
                  borderRadius: "20px",
                  border: "1px solid #8d4b4b",
                  backgroundColor: "transparent",
                }}
              />
            </Form.Group>

            <Form.Group className="d-flex flex-column align-items-start">
              <Form.Label className="label">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                style={{
                  color: "whitesmoke",
                  width: "100%",
                  marginTop: "0",
                  padding: "12px",
                  borderRadius: "20px",
                  border: "1px solid #8d4b4b",
                  backgroundColor: "transparent", 
                }}
              />
            </Form.Group>
            <div className="d-flex flex-row justify-content-between align-items-center">
              <div className="remember-me">
                <Form.Check type="checkbox" label="Remember me" />
              </div>
              <Button
                variant="link"
                className="forgotpassword"
                style={{ color: "#d2abab" }}
              >
                <em>Forgot password?</em>
              </Button>
            </div>

            <Button
              variant="primary"
              className="login-button btn-block"
              style={{
                marginTop: "30px",
                fontSize: "150%",
                borderRadius: "20px",
                width: "100%", 
                height: "50px", 
                marginBottom: "10px",
                backgroundColor: "transparent", 
                borderColor: "#8d4b4b", 
                color: "#ffffff", 
                transition: "background-color 0.3s, color 0.3s, transform 0.3", 
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "red";
                e.target.style.color = "white";
                e.target.style.borderColor = "#8d4b4b";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#ffffff";
                e.target.style.borderColor = "#8d4b4b";
              }}
              type="submit"
            >
              Login
            </Button>

            <div className="line"></div>

            <hr className="my-4 bg-white" />
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
