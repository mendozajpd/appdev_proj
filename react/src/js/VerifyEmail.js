import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";

const HomePage = () => {

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate('/login');
    }
  }, []);

  const navigate = useNavigate();

  const buttonStyle = {
    marginTop: "30px",
    fontSize: "150%",
    borderRadius: "20px",
    width: "100%",
    height: "50px",
    marginBottom: "10px",
    backgroundColor: "transparent",
    borderColor: "#8d4b4b",
    color: "#ff3535",
    transition: "background-color 0.3s, color 0.3s, transform 0.3",
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = "red";
    e.target.style.color = "white";
    e.target.style.borderColor = "#8d4b4b";
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "#ff3535";
    e.target.style.borderColor = "#8d4b4b";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/logout",
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data);
      localStorage.removeItem('jwt_token');
      navigate('/login');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.get("http://127.0.0.1:8000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data); // log the user's details to the console
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  const handleSendVerify = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwt_token");
      const userDetailsResponse = await axios.get("http://127.0.0.1:8000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = userDetailsResponse.data;
      const response = await axios.post(
        "http://127.0.0.1:8000/api/sendVerificationEmail",
        {
          name: user.name, // use the name from the user's details
          email: user.email, // use the email from the user's details
          message: 'This is a test message' // replace with actual message
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Email sending failed:", error);
    }
  };

  return (
    < Container className="main-container" >
      <Row className="justify-content-md-center">
        <Col xs={10} md={6}>
          <div className="text-center text-white">
            <h1 style={{ marginTop: "30px" }}>
              Welcome to
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

          <Button
            variant="primary"
            className="login-button btn-block"
            style={buttonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleSendVerify}
          >
            Send Verification Email
          </Button>

          <Form className="main-content" onSubmit={handleSubmit}>
            <Button
              variant="primary"
              className="login-button btn-block"
              style={buttonStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              type="submit"
            >
              Log out
            </Button>


            <div className="line"></div>

            <hr className="my-4 bg-white" />
          </Form>
        </Col>
      </Row>
    </Container >
  );
};

export default HomePage;
