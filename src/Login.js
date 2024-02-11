import React, { useState } from "react";
import { Link, redirect } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import "./index.css"; // Import your CSS file
import axios from "axios";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        formData
      );
      setFormData({
        email: "",
        password: "",
      });
      console.log(response.data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Container className="main-container">
      <Row className="justify-content-md-center">
        <Col xs={10} md={6}>
          <div className="text-center text-white">
            <h1 style={{ marginTop: "30px" }}>
              Login to
              <span
                style={{
                  marginLeft: "10px",
                  color: "red",
                  transition: "color 0.3s",
                  cursor: "pointer",
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
                width: "100%", // Set width to match input fields
                height: "50px", // Set height to match input fields
                marginTop: "30px",
                marginBottom: "10px",
                backgroundColor: "transparent", // Set default background color
                borderColor: "#8d4b4b", // Set default border color
                color: "#ff3535", // Set default text color
                transition: "background-color 0.3s, color 0.3s, transform 0.3", // Add transition for smooth effect
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "red";
                e.target.style.color = "white";
                e.target.style.borderColor = "#8d4b4b";
                e.target.style.transform = "scale(1.1)"; // Enlarge the button
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#ff3535";
                e.target.style.borderColor = "#8d4b4b";
                e.target.style.transform = "scale(1)"; // Restore original size
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
                width: "100%", // Set width to match input fields
                height: "50px", // Set height to match input fields
                marginBottom: "10px",
                backgroundColor: "transparent", // Set default background color
                borderColor: "#8d4b4b", // Set default border color
                color: "#ff3535", // Set default text color
                transition: "background-color 0.3s, color 0.3s, transform 0.3", // Add transition for smooth effect
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "red";
                e.target.style.color = "white";
                e.target.style.borderColor = "#8d4b4b";
                e.target.style.transform = "scale(1.1)"; // Enlarge the button
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#ff3535";
                e.target.style.borderColor = "#8d4b4b";
                e.target.style.transform = "scale(1)"; // Restore original size
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
                width: "100%", // Set width to match input fields
                height: "50px", // Set height to match input fields
                marginBottom: "10px",
                backgroundColor: "transparent", // Set default background color
                borderColor: "#8d4b4b", // Set default border color
                color: "#ff3535", // Set default text color
                transition: "background-color 0.3s, color 0.3s, transform 0.3", // Add transition for smooth effect
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "red";
                e.target.style.color = "white";
                e.target.style.borderColor = "#8d4b4b";
                e.target.style.transform = "scale(1.1)"; // Enlarge the button
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#ff3535";
                e.target.style.borderColor = "#8d4b4b";
                e.target.style.transform = "scale(1)"; // Restore original size
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
            <div class="line"></div>
          </div>
          <Form className="main-content" onSubmit={handleSubmit}>
            <Form.Group className="d-flex flex-column align-items-start">
              <Form.Label className="label">Email or username</Form.Label>
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
                  backgroundColor: "transparent", // Set background color to transparent
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
                width: "100%", // Set width to match input fields
                height: "50px", // Set height to match input fields
                marginBottom: "10px",
                backgroundColor: "transparent", // Set default background color
                borderColor: "#8d4b4b", // Set default border color
                color: "#ff3535", // Set default text color
                transition: "background-color 0.3s, color 0.3s, transform 0.3", // Add transition for smooth effect
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "red";
                e.target.style.color = "white";
                e.target.style.borderColor = "#8d4b4b";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#ff3535";
                e.target.style.borderColor = "#8d4b4b";
              }}
              type="submit"
            >
              Login
            </Button>

            <div class="line"></div>

            <hr className="my-4 bg-white" />
            <div className="text-center">
              <p>
                Didn't have an account?{" "}
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
