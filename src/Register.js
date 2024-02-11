import React, { useState } from "react";
import Button from "react-bootstrap/Button";
// import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register",
        formData
      );
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      window.location = "/login"
      console.log(response.data);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="Register-container">
      <div className="Register-signup-form">
        <div className="Register-textbox">
          <Form onSubmit={handleSubmit}>
            <p>Sign up with</p>
            <Form.Group controlId="formGroupName">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Username"
              />
            </Form.Group>
            <Form.Group controlId="formGroupEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
              />
            </Form.Group>
            <Form.Group controlId="formGroupPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
              />
            </Form.Group>
            <Form.Group controlId="formGroupConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
            </Form.Group>
            <Button className="Register-button" variant="primary" type="submit">
              Register
            </Button>
          </Form>
          <p>Have an account?</p>
          <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
