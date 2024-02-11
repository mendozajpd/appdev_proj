import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      window.location = "/login";
      console.log(response.data);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="Register-container">
      <div className="Register-social-container">
        <div>
          <h1>Sign up to start listening</h1>
        </div>

        <Button className="Register-social-button rounded-pill" variant="light">
          <div className="buttonContent">
            <Image
              src="/register/google.png"
              roundedCircle
              className="Register-google"
            />{" "}
            <p style={{ fontSize: "15px", fontWeight: "500" }}>Login with Google</p>
          </div>
        </Button>

        <Button className="Register-social-button rounded-pill" variant="light">
          <div className="buttonContent">
            <Image
              src="/register/facebook.png"
              roundedCircle
              className="Register-facebook"
            />{" "}
            <p style={{ fontSize: "15px", fontWeight: "500"}}>Login with Facebook</p>
          </div>
        </Button>

        <Button className="Register-social-button rounded-pill" variant="light">
          <div className="buttonContent">
            <Image
              src="/register/apple.png"
              roundedCircle
              className="Register-apple"
            />{" "}
            <p style={{ fontSize: "15px", fontWeight: "500" }}>Continue with Apple</p>
          </div>
        </Button>
      </div>

      <div className="Register-signup-form">
        <div className="Register-textbox">
          <Form onSubmit={handleSubmit}>
            <p>Sign up with</p>
            <Form.Group
              className="Register-textbox"
              controlId="formGroupUsername"
            >
              <Form.Label className="label">Username</Form.Label>
              <Form.Control
                type="text"
                name="name"
                onChange={handleChange}
                value={formData.name}
                placeholder="Enter Username"
                style={{ height: "30px" }}
              />
            </Form.Group>
            <Form.Group className="Register-textbox" controlId="formGroupEmail">
              <Form.Label className="label">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="Enter Email"
                style={{ height: "30px" }}
              />
            </Form.Group>
            <Form.Group className="Register-textbox" controlId="formGroupPass">
              <Form.Label className="label">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                placeholder="Enter Password"
                style={{ height: "30px" }}
              />
            </Form.Group>
            <Form.Group
              className="Register-textbox"
              controlId="formGroupConPass"
            >
              <Form.Label className="label">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                value={formData.confirmPassword}
                placeholder="Confirm Password"
                style={{ height: "30px" }}
              />
            </Form.Group>

            <Button className="Register-button" variant="light" type="submit">
              <p>Sign up</p>
            </Button>
          </Form>
        </div>
        <p>Have an account?</p>
        <Link to={"/login"}>Log in here</Link>
      </div>
    </div>
  );
}

export default Register;
