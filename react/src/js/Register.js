import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register", // add to config
        formData,
      );
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      
      // console.log(response.data);
      navigate('/login');
    } catch (error) {
      // console.error("Registration failed:", error);
      alert(error.response.data.message);
    }
  };

  const handleSocialButtonMouseEnter = (e) => {
    e.target.style.backgroundColor = "red"; 
    e.target.style.color = "white"; 
    e.target.style.borderColor = "rgba(185, 128, 128, 0.3)"; 
    e.target.style.transform = "scale(1.05)"; 
    e.stopPropagation();
  };

  const handleSocialButtonMouseLeave = (e) => {
    e.target.style.backgroundColor = "transparent"; 
    e.target.style.color = "white"; 
    e.target.style.borderColor = "rgba(185, 128, 128, 0.3)";
    e.target.style.transform = "scale(1)"; 
    e.stopPropagation();
  };

  return (
    <div className="Register-container">
      <div className="Register-social-container">
        <div>
          <h1
            style={{ marginTop: "30px" }}>
            Sign up to start
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
              LISTENING
            </span>
          </h1>
        </div>

        {/* google */}

        <Button
          className="Register-social-button rounded-pill"
          variant="light"
          style={{
            width: "100%",
            height: "50px",
            marginTop: "30px",
            marginBottom: "10px",
            backgroundColor: "transparent",
            borderColor: "rgba(185, 128, 128, 0.3)",
            color: "white",
            transition: "background-color 0.3s, color 0.3s, transform 0.3s",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={handleSocialButtonMouseEnter}
          onMouseLeave={handleSocialButtonMouseLeave}
        >
          <div className="buttonContent"
            onMouseEnter={(e) => {
              e.stopPropagation();
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
            }}
          >
            <Image
              src="/register/google.png"
              roundedCircle
              className="Register-google"
              style={{
                marginRight: "20px",
                width: "30px",
                margin: "flex",
              }}
              onMouseEnter={(e) => {
                e.stopPropagation();
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
              }}
            />
            <p
              style={{ fontSize: "20px", fontWeight: "500" }}
              onMouseEnter={(e) => {
                e.stopPropagation();
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
              }}
            >
              Login with Google
            </p>
          </div>
        </Button>

        {/* facebook */}
        <Button
          className="Register-social-button rounded-pill"
          variant="light"
          style={{
            width: "100%",
            height: "50px",
            marginTop: "10px",
            marginBottom: "10px",
            backgroundColor: "transparent",
            borderColor: "rgba(185, 128, 128, 0.3)",
            color: "#333333",
            transition: "background-color 0.3s, color 0.3s, transform 0.3s",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={handleSocialButtonMouseEnter}
          onMouseLeave={handleSocialButtonMouseLeave}
        >
          <div className="buttonContent"
            onMouseEnter={(e) => {
              e.stopPropagation();
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
            }}>
            <Image
              src="/register/facebook.png"
              roundedCircle
              className="Register-facebook"
              style={{
                marginRight: "20px",
                width: "30px",
                margin: "flex",
              }}
              onMouseEnter={(e) => {
                e.stopPropagation();
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
              }}
            />
            <p style={{ fontSize: "20px", fontWeight: "500" }}
              onMouseEnter={(e) => {
                e.stopPropagation();
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
              }}>
              Login with Facebook
            </p>
          </div>
        </Button>

        {/* apple */}

        <Button
          className="Register-social-button rounded-pill"
          variant="light"
          style={{
            width: "100%",
            height: "50px",
            marginTop: "10px",
            marginBottom: "10px",
            backgroundColor: "transparent",
            borderColor: "rgba(185, 128, 128, 0.3)",
            color: "white",
            transition: "background-color 0.3s, color 0.3s, transform 0.3s",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={handleSocialButtonMouseEnter}
          onMouseLeave={handleSocialButtonMouseLeave}
        >
          <div className="buttonContent"
            onMouseEnter={(e) => {
              e.stopPropagation();
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
            }}>
            <Image
              src="/register/apple.png"
              roundedCircle
              className="Register-apple"
              style={{
                marginRight: "20px",
                width: "30px",
                margin: "flex",
              }}
              onMouseEnter={(e) => {
                e.stopPropagation();
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
              }}
            />
            <p style={{ fontSize: "20px", fontWeight: "500" }}
              onMouseEnter={(e) => {
                e.stopPropagation();
              }}
              onMouseLeave={(e) => {
                e.stopPropagation();
              }}>
              Continue with Apple
            </p>
          </div>
        </Button>
      </div>

      <div className="Register-signup-form">
        <div className="Register-textbox">
          <Form onSubmit={handleSubmit}>
            <p>Sign up</p>

            <div className="line"></div>

            <Form.Group
              className="Register-textbox"
              controlId="formGroupUsername"
            >
              <Form.Label className="label">
                Username
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                onChange={handleChange}
                value={formData.name}
                // placeholder="Enter Username"
                style={{
                  color: "whitesmoke",
                  width: "100%",
                  marginTop: "10",
                  padding: "12px",
                  borderRadius: "20px",
                  border: "1px solid #8d4b4b",
                  backgroundColor: "transparent",
                }}
              />
            </Form.Group>
            <Form.Group className="Register-textbox" controlId="formGroupEmail">
              <Form.Label className="label">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                // placeholder="Enter Email"
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
            <Form.Group className="Register-textbox" controlId="formGroupPass">
              <Form.Label className="label">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                // placeholder="Enter Password"
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
                // placeholder="Confirm Password"
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

            <Button className="Register-button" variant="light" type="submit"
              style={{
                marginTop: "10px",
                fontSize: "150%",
                borderRadius: "20px",
                width: "100%",
                height: "50px",
                marginBottom: "10px",
                backgroundColor: "transparent",
                borderColor: "rgba(185, 128, 128, 0.3)",
                color: "#ff3535",
                transition: "background-color 0.3s, color 0.3s, transform 0.3", 
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
              }}>
              <span style={{
                fontSize: '20px',
                color: 'white',
                margin: 0,
                padding: 0,
                transition: "color 0.3s",
              }}>Register</span>
            </Button>
          </Form>
        </div>
        <div className="line"></div>
        <div className="loginNavigate">
          <p>Have an account? </p>
          <Link to={"/login"} style={{ textDecoration: 'none' }}></Link>
          <Link to={"/login"}> Log in here</Link>
        </div>
      </div>
    </div >
  );
}

export default Register;
