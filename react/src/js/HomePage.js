import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import BACKEND_URL from "../config";



const HomePage = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [logoutDisabled, setLogoutDisabled] = useState(false);

  // MODAL
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate('/login');
    } else {
      fetchUserDetails();
    }

    if (isVerified) {
      handleClose();
    } else {
      handleShow();
    }

    // CHECK ROLE IF IT IS SUPERADMIN OR ADMIN

  }, [isVerified]);

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
    setLogoutDisabled(true);
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.post(
        `${BACKEND_URL}/auth/logout`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem('jwt_token');
      navigate('/login');
    } catch (error) {
      console.error("Login failed:", error);
      setLogoutDisabled(false);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.get(`${BACKEND_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data; // Assuming user details are directly in response.data
      console.log(userData);
      setIsVerified(userData.email_verified_at !== null);
      // Check if the user has admin or superadmin role
      const isAdmin = userData.role.includes('admin');
      const isSuperAdmin = userData.role.includes('superadmin');
      if (isAdmin || isSuperAdmin) {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      localStorage.removeItem("jwt_token");
    }
  };

  const handleSendVerify = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true); // disable the button
    setRemainingTime(180); // set remaining time to 3 minutes
    const timerId = setInterval(() => {
      setRemainingTime((time) => time - 1);
    }, 1000);
    setTimeout(() => {
      setIsButtonDisabled(false); // enable the button after 3 minutes
      clearInterval(timerId); // clear the interval
    }, 3 * 60 * 1000);
    try {
      const token = localStorage.getItem("jwt_token");
      const userDetailsResponse = await axios.get("http://127.0.0.1:8000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = userDetailsResponse.data;
      const response = await axios.post(
        "http://127.0.0.1:8000/api/resend-verification-email",
        {
          name: user.name, // use the name from the user's details
          email: user.email, // use the email from the user's details
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (setShow) {
        handleClose();
      }
      console.log(response.data);
    } catch (error) {
      console.error("Email sending failed:", error);
    }
  };



  return (
    <>
      <Modal show={show} onHide={handleClose} backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Email Verification Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            We noticed that your email address has not been verified yet.
            To ensure the security of your account and to gain full access
            to all features of our application, it's important to verify your
            email address. We kindly request you to check your email for the verification link.
          </p></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
      <Container className="main-container" >
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

            {/* IF NOT VERIFIED */}
            {!isVerified ? (
              <>
                <Button
                  variant="primary"
                  className="login-button btn-block"
                  style={buttonStyle}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleSendVerify}
                  disabled={isButtonDisabled}
                >
                  Send Verification Email
                </Button>
                {isButtonDisabled && <p>Next email can be sent in {remainingTime} seconds</p>}
              </>
            ) : (
              <div className="text-center text-white">
                <h1 style={{ marginTop: "30px" }}>
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
                    YOU'RE VERIFIED!
                  </span>
                </h1>
              </div>
            )}



            <Form className="main-content" onSubmit={handleSubmit}>
              <Button
                variant="primary"
                className="login-button btn-block"
                style={buttonStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                disabled={logoutDisabled}
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
    </>
  );
};

export default HomePage;
